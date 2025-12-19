'use client';

import { useState } from 'react';
import { UserPlus, X, Loader2, Search } from 'lucide-react';
import { addGroupMember } from '@/app/actions';

interface SharedUser {
	id: string;
	name: string | null;
	email: string | null;
	image: string | null;
}

interface AddMemberModalProps {
	groupId: string;
	friends: SharedUser[];
	currentMemberIds: string[];
}

export default function AddMemberModal({
	groupId,
	friends,
	currentMemberIds,
}: AddMemberModalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState<string | null>(null); // userId being added

	const unaddedFriends = friends.filter(
		(friend) => !currentMemberIds.includes(friend.id)
	);

	const handleAdd = async (email: string, userId: string) => {
		setIsSubmitting(userId);
		try {
			const result = await addGroupMember(groupId, email);
			if (result.success) {
				// We don't necessarily close it, maybe they want to add more
			} else {
				alert(result.message);
			}
		} catch (error) {
			console.error('Failed to add member', error);
		} finally {
			setIsSubmitting(null);
		}
	};

	if (!isOpen) {
		return (
			<button
				onClick={() => setIsOpen(true)}
				className="rounded-full p-2 hover:bg-slate-100 transition-colors"
			>
				<UserPlus size={24} className="text-text-secondary" />
			</button>
		);
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
			<div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[80vh] flex flex-col">
				<div className="flex items-center justify-between p-4 border-b border-slate-100">
					<h3 className="text-lg font-bold text-text-primary">
						Add People
					</h3>
					<button
						onClick={() => setIsOpen(false)}
						className="p-1 rounded-full hover:bg-slate-100"
					>
						<X size={24} className="text-text-secondary" />
					</button>
				</div>

				<div className="p-4 bg-slate-50 border-b border-slate-100">
					<div className="relative">
						<Search
							className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							size={18}
						/>
						<input
							type="text"
							placeholder="Search friends by name..."
							className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-primary transition-colors"
						/>
					</div>
				</div>

				<div className="max-h-[60vh] overflow-y-auto p-2">
					{unaddedFriends.length === 0 ? (
						<div className="py-8 text-center text-slate-500">
							<p className="text-sm">No new friends to add.</p>
							<p className="text-xs mt-1">
								Add friends from your profile first!
							</p>
						</div>
					) : (
						<div className="space-y-1">
							{unaddedFriends.map((friend) => (
								<div
									key={friend.id}
									className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
								>
									<div className="flex items-center gap-3">
										<div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
											{friend.name?.[0]}
										</div>
										<div>
											<p className="font-bold text-text-primary text-sm">
												{friend.name}
											</p>
											<p className="text-xs text-text-secondary">
												{friend.email}
											</p>
										</div>
									</div>
									<button
										onClick={() => {
											if (friend.email)
												handleAdd(
													friend.email,
													friend.id
												);
										}}
										disabled={isSubmitting === friend.id}
										className="bg-brand-primary/10 text-brand-primary px-4 py-1.5 rounded-full text-xs font-bold hover:bg-brand-primary hover:text-white transition-colors disabled:opacity-50"
									>
										{isSubmitting === friend.id ? (
											<Loader2
												size={14}
												className="animate-spin"
											/>
										) : (
											'Add'
										)}
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
