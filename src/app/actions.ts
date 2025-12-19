'use server';

import { prisma } from '@/lib/prisma';
import { auth, signIn } from '@/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function signUpUser(
	username: string,
	email: string,
	password: string,
	receiveUpdates: boolean
) {
	try {
		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return { success: false, message: 'Email already registered' };
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user
		const user = await prisma.user.create({
			data: {
				email,
				name: username,
				password: hashedPassword,
				emailVerified: null,
				image: null,
			},
		});

		// Auto sign in after signup
		await signIn('credentials', {
			email,
			password,
			redirect: false,
		});

		return { success: true, message: 'Account created successfully' };
	} catch (error) {
		console.error('Signup error:', error);
		return { success: false, message: 'Failed to create account' };
	}
}

export async function loginUser(email: string, password: string) {
	try {
		const result = await signIn('credentials', {
			email,
			password,
			redirect: false,
		});

		if (result?.error) {
			return { success: false, message: 'Invalid credentials' };
		}

		return { success: true, message: 'Logged in successfully' };
	} catch (error) {
		console.error('Login error:', error);
		return { success: false, message: 'Failed to log in' };
	}
}

export async function addFriend(email: string) {
	const session = await auth();
	const currentUserId = session?.user?.id;

	if (!currentUserId) {
		return {
			success: false,
			message: 'You must be logged in to add friends',
		};
	}

	try {
		// 1. Find the target user
		const friend = await prisma.user.findUnique({
			where: { email },
		});

		if (!friend) {
			return {
				success: false,
				message: 'User not found with that email',
			};
		}

		if (friend.id === currentUserId) {
			return {
				success: false,
				message: 'You cannot add yourself as a friend',
			};
		}

		// 2. Check if friendship already exists
		const existingFriendship = await prisma.friendship.findUnique({
			where: {
				followerId_followingId: {
					followerId: currentUserId,
					followingId: friend.id,
				},
			},
		});

		if (existingFriendship) {
			return { success: false, message: 'You are already friends' };
		}

		// 3. Create friendship (One-way for now, effectively "following")
		await prisma.friendship.create({
			data: {
				followerId: currentUserId,
				followingId: friend.id,
			},
		});

		revalidatePath('/friends');
		return { success: true, message: 'Friend added successfully!' };
	} catch (error) {
		console.error('Error adding friend:', error);
		return {
			success: false,
			message: 'Something went wrong. Please try again.',
		};
	}
}

export async function getFriends() {
	const session = await auth();
	const currentUserId = session?.user?.id;

	if (!currentUserId) return [];

	try {
		const friendships = await prisma.friendship.findMany({
			where: {
				followerId: currentUserId,
			},
			include: {
				following: true, // Get the friend's user details
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return friendships.map((f) => ({
			id: f.following.id,
			name: f.following.name || 'Unnamed User',
			email: f.following.email,
			image: f.following.image,
			// Mock status for now until we have expense logic
			status: 'settled',
		}));
	} catch (error) {
		console.error('Error fetching friends:', error);
		return [];
	}
}

export async function createGroup(name: string, type: string) {
	const session = await auth();
	const currentUserId = session?.user?.id;

	if (!currentUserId) {
		return { success: false, message: 'Must be logged in' };
	}

	try {
		const group = await prisma.group.create({
			data: {
				name,
				type,
				ownerId: currentUserId,
				members: {
					create: {
						userId: currentUserId,
					},
				},
			},
		});

		revalidatePath('/groups');
		return { success: true, group };
	} catch (error) {
		console.error('Error creating group:', error);
		return { success: false, message: 'Failed to create group' };
	}
}

export async function getGroups() {
	const session = await auth();
	const currentUserId = session?.user?.id;

	if (!currentUserId) return [];

	try {
		const memberships = await prisma.groupMember.findMany({
			where: { userId: currentUserId },
			include: {
				group: {
					include: {
						expenses: {
							include: {
								payer: true,
								splits: true,
							},
						},
						members: true,
					},
				},
			},
			orderBy: {
				joinedAt: 'desc',
			},
		});

		return memberships.map((m) => m.group);
	} catch (error) {
		console.error('Error fetching groups:', error);
		return [];
	}
}

export async function createExpense(
	groupId: string,
	description: string,
	amount: number
) {
	const session = await auth();
	const currentUserId = session?.user?.id;

	if (!currentUserId) {
		return { success: false, message: 'Must be logged in' };
	}

	try {
		// 1. Get group members to split equally
		const group = await prisma.group.findUnique({
			where: { id: groupId },
			include: { members: true },
		});

		if (!group) return { success: false, message: 'Group not found' };

		// Basic Logic: Split equally among all members
		const splitAmount = amount / group.members.length;
		const splitsData = group.members.map((member) => ({
			userId: member.userId,
			amount: splitAmount,
			paid: member.userId === currentUserId, // Payer is "paid" in terms of their own share?
			// actually "paid" in Split usually means "did they pay back".
			// For the payer, they don't owe.
			// But usually Split table tracks "Who owes".
			// If I paid 50, and split is 25/25.
			// I owe 25 (paid). Friend owes 25 (unpaid).
		}));

		await prisma.expense.create({
			data: {
				groupId,
				payerId: currentUserId,
				description,
				amount,
				splits: {
					create: splitsData.map((s) => ({
						userId: s.userId,
						amount: s.amount,
						paid: s.userId === currentUserId, // Auto-mark payer as settled on their own split
					})),
				},
			},
		});

		revalidatePath(`/groups/${groupId}`);
		revalidatePath('/'); // Update home dashboard too
		return { success: true, message: 'Expense added' };
	} catch (error) {
		console.error('Error creating expense:', error);
		return { success: false, message: 'Failed to add expense' };
	}
}

export async function getGroupDetails(groupId: string) {
	const session = await auth();
	if (!session?.user) return null;

	try {
		const group = await prisma.group.findUnique({
			where: { id: groupId },
			include: {
				members: {
					include: {
						user: true,
					},
				},
				expenses: {
					include: {
						payer: true,
						splits: true,
					},
					orderBy: {
						createdAt: 'desc',
					},
				},
			},
		});

		return group;
	} catch (error) {
		console.error('Error getting group details:', error);
		return null;
	}
}

export async function addGroupMember(groupId: string, email: string) {
	const session = await auth();
	const currentUserId = session?.user?.id;

	if (!currentUserId) {
		return { success: false, message: 'Must be logged in' };
	}

	try {
		// 1. Find the user by email
		const userToAdd = await prisma.user.findUnique({
			where: { email },
		});

		if (!userToAdd) {
			return {
				success: false,
				message: 'User not found with that email',
			};
		}

		// 2. Check if already a member
		const existingMember = await prisma.groupMember.findUnique({
			where: {
				groupId_userId: {
					groupId,
					userId: userToAdd.id,
				},
			},
		});

		if (existingMember) {
			return { success: false, message: 'User is already in the group' };
		}

		// 3. Add to group
		await prisma.groupMember.create({
			data: {
				groupId,
				userId: userToAdd.id,
			},
		});

		revalidatePath(`/groups/${groupId}`);
		return { success: true, message: 'Member added successfully' };
	} catch (error) {
		console.error('Error adding group member:', error);
		return { success: false, message: 'Failed to add member' };
	}
}

export async function deleteGroup(groupId: string) {
	const session = await auth();
	const currentUserId = session?.user?.id;

	if (!currentUserId) {
		return { success: false, message: 'Must be logged in' };
	}

	try {
		// 1. Verify the user is the owner
		const group = await prisma.group.findUnique({
			where: { id: groupId },
		});

		if (!group) {
			return { success: false, message: 'Group not found' };
		}

		if (group.ownerId !== currentUserId) {
			return {
				success: false,
				message: 'Only the group owner can delete the group',
			};
		}

		// 2. Delete the group (cascade will handle related records)
		await prisma.group.delete({
			where: { id: groupId },
		});

		revalidatePath('/');
		return { success: true, message: 'Group deleted successfully' };
	} catch (error) {
		console.error('Error deleting group:', error);
		return { success: false, message: 'Failed to delete group' };
	}
}

export async function leaveGroup(groupId: string) {
	const session = await auth();
	const currentUserId = session?.user?.id;

	if (!currentUserId) {
		return { success: false, message: 'Must be logged in' };
	}

	try {
		// 1. Check if user is the owner
		const group = await prisma.group.findUnique({
			where: { id: groupId },
			include: { members: true },
		});

		if (!group) {
			return { success: false, message: 'Group not found' };
		}

		if (group.ownerId === currentUserId) {
			return {
				success: false,
				message:
					'Group owner cannot leave. Transfer ownership or delete the group instead.',
			};
		}

		// 2. Remove the user from the group
		await prisma.groupMember.delete({
			where: {
				groupId_userId: {
					groupId,
					userId: currentUserId,
				},
			},
		});

		revalidatePath('/');
		return { success: true, message: 'Left group successfully' };
	} catch (error) {
		console.error('Error leaving group:', error);
		return { success: false, message: 'Failed to leave group' };
	}
}
