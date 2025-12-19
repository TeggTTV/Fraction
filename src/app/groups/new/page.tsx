'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Home, Plane, Users, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createGroup, getFriends, addGroupMember } from '@/app/actions';

const GROUP_TYPES = [
	{ id: 'house', label: 'House', icon: Home, color: 'bg-indigo-500' },
	{ id: 'trip', label: 'Trip', icon: Plane, color: 'bg-teal-500' },
	{ id: 'friends', label: 'Friends', icon: Users, color: 'bg-orange-500' },
	{ id: 'other', label: 'Other', icon: Users, color: 'bg-slate-500' },
];

interface Friend {
	id: string;
	name: string;
	email: string | null;
	image: string | null;
}

export default function NewGroupPage() {
	const router = useRouter();
	const [name, setName] = useState('');
	const [selectedType, setSelectedType] = useState('house');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [friends, setFriends] = useState<Friend[]>([]);
	const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
	const [isLoadingFriends, setIsLoadingFriends] = useState(true);

	useEffect(() => {
		async function loadFriends() {
			try {
				const friendsList = await getFriends();
				setFriends(friendsList as Friend[]);
			} catch (error) {
				console.error('Failed to load friends', error);
			} finally {
				setIsLoadingFriends(false);
			}
		}
		loadFriends();
	}, []);

	const toggleFriend = (friendId: string) => {
		setSelectedFriendIds((prev) =>
			prev.includes(friendId)
				? prev.filter((id) => id !== friendId)
				: [...prev, friendId]
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// 1. Create the group
			const result = await createGroup(name, selectedType);
			if (result.success && result.group) {
				const groupId = result.group.id;

				// 2. Add selected members
				if (selectedFriendIds.length > 0) {
					const addMemberPromises = selectedFriendIds.map(
						(friendId) => {
							const friend = friends.find(
								(f) => f.id === friendId
							);
							if (friend?.email) {
								return addGroupMember(groupId, friend.email);
							}
							return Promise.resolve({ success: false });
						}
					);

					await Promise.all(addMemberPromises);
				}

				router.push(`/groups/${groupId}`);
				router.refresh();
			} else {
				alert('Failed to create group');
			}
		} catch (error) {
			console.error('Failed to create group', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex h-full flex-col bg-white">
			{/* Header */}
			<div className="flex items-center gap-4 border-b border-slate-100 p-4">
				<button
					onClick={() => router.back()}
					className="rounded-full p-2 hover:bg-slate-100"
				>
					<ChevronLeft size={24} />
				</button>
				<h1 className="text-xl font-bold text-text-primary">
					New Group
				</h1>
			</div>

			<form
				onSubmit={handleSubmit}
				className="flex-1 overflow-y-auto space-y-6 p-6 pb-32"
			>
				{/* Name Input */}
				<div className="space-y-2">
					<label className="text-sm font-bold text-text-secondary uppercase tracking-wider">
						Group Name
					</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="e.g. Summer Trip 2024"
						className="w-full border-b-2 border-slate-200 bg-transparent py-2 text-2xl font-bold text-text-primary placeholder:text-slate-300 focus:border-brand-primary focus:outline-none"
						autoFocus
					/>
				</div>

				{/* Type Selection */}
				<div className="space-y-4">
					<label className="text-sm font-bold text-text-secondary uppercase tracking-wider">
						Type
					</label>
					<div className="grid grid-cols-2 gap-3">
						{GROUP_TYPES.map((type) => {
							const Icon = type.icon;
							const isSelected = selectedType === type.id;
							return (
								<button
									key={type.id}
									type="button"
									onClick={() => setSelectedType(type.id)}
									className={cn(
										'flex items-center gap-3 rounded-2xl border p-4 transition-all',
										isSelected
											? 'border-brand-primary bg-blue-50/50 ring-1 ring-brand-primary'
											: 'border-slate-200 hover:border-slate-300'
									)}
								>
									<div
										className={cn(
											'flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm',
											type.color
										)}
									>
										<Icon size={20} />
									</div>
									<span
										className={cn(
											'font-bold',
											isSelected
												? 'text-text-primary'
												: 'text-text-secondary'
										)}
									>
										{type.label}
									</span>
									{isSelected && (
										<Check
											size={18}
											className="ml-auto text-brand-primary"
										/>
									)}
								</button>
							);
						})}
					</div>
				</div>

				{/* Add Members */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<label className="text-sm font-bold text-text-secondary uppercase tracking-wider">
							Add Members (Optional)
						</label>
						{selectedFriendIds.length > 0 && (
							<span className="text-xs text-brand-primary font-medium">
								{selectedFriendIds.length} selected
							</span>
						)}
					</div>

					{isLoadingFriends ? (
						<div className="flex justify-center py-8">
							<Loader2
								className="animate-spin text-slate-400"
								size={24}
							/>
						</div>
					) : friends.length === 0 ? (
						<div className="text-center py-8 text-sm text-text-muted">
							<p>No friends yet!</p>
							<p className="mt-1">
								Add friends from your profile first.
							</p>
						</div>
					) : (
						<div className="space-y-2 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 p-2">
							{friends.map((friend) => {
								const isSelected = selectedFriendIds.includes(
									friend.id
								);
								return (
									<button
										key={friend.id}
										type="button"
										onClick={() => toggleFriend(friend.id)}
										className={cn(
											'w-full flex items-center gap-3 p-3 rounded-xl transition-all',
											isSelected
												? 'bg-brand-primary/10 border border-brand-primary'
												: 'hover:bg-slate-50 border border-transparent'
										)}
									>
										<div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold shrink-0">
											{friend.name?.[0]}
										</div>
										<div className="flex-1 text-left">
											<p className="font-bold text-text-primary text-sm">
												{friend.name}
											</p>
											<p className="text-xs text-text-secondary">
												{friend.email}
											</p>
										</div>
										<div
											className={cn(
												'flex h-6 w-6 items-center justify-center rounded-full border shrink-0',
												isSelected
													? 'bg-brand-primary border-brand-primary text-white'
													: 'border-slate-300'
											)}
										>
											{isSelected && <Check size={14} />}
										</div>
									</button>
								);
							})}
						</div>
					)}
				</div>
			</form>

			{/* Fixed Action Button */}
			<div className="absolute bottom-0 left-0 w-full p-6 bg-white border-t border-slate-100 pb-28">
				<button
					type="submit"
					disabled={!name.trim() || isSubmitting}
					onClick={handleSubmit}
					className="w-full rounded-2xl bg-brand-primary py-4 text-lg font-bold text-white shadow-lg shadow-brand-primary/30 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
				>
					{isSubmitting ? (
						<Loader2 className="animate-spin" />
					) : (
						<>
							Create Group
							{selectedFriendIds.length > 0 && (
								<span className="text-sm opacity-80">
									with {selectedFriendIds.length}{' '}
									{selectedFriendIds.length === 1
										? 'person'
										: 'people'}
								</span>
							)}
						</>
					)}
				</button>
			</div>
		</div>
	);
}
