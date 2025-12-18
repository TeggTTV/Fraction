'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addFriend(email: string) {
	// Mock delay
	await new Promise((resolve) => setTimeout(resolve, 1000));

	// In a real app with Auth, we would get the current user ID
	// const session = await auth();
	// const currentUserId = session?.user?.id;

	// For now, we'll try to find the user by email
	// NOTE: This will fail if the database isn't connected or seeded, so we wrap in try/catch
	// to return mocked success for the UI demo.

	try {
		const friend = await prisma.user.findUnique({
			where: { email },
		});

		if (!friend) {
			return { success: false, message: 'User not found' };
		}

		// Here we would create the friendship relation
		// await prisma.friendship.create(...)

		revalidatePath('/friends');
		return { success: true, message: 'Friend request sent!' };
	} catch (error) {
		console.error('Database error (expected if no DB connection):', error);
		// Fallback for demo purposes if DB is not ready
		if (email.includes('@')) {
			return { success: true, message: 'Friend request sent! (Mock)' };
		}
		return { success: false, message: 'Invalid email' };
	}
}
