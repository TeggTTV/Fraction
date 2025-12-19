'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Search, X, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addFriend, getFriends } from '@/app/actions';

// Define the Friend type based on what getFriends returns
type Friend = {
	id: string;
	name: string;
	email: string | null;
	image: string | null;
	status: string; // 'settled' | 'owe' | 'owed'
};

export default function FriendsPage() {
	const [friends, setFriends] = useState<Friend[]>([]);
	const [isLoadingFriends, setIsLoadingFriends] = useState(true);

	const [isAdding, setIsAdding] = useState(false);
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle');
	const [message, setMessage] = useState('');

	// Fetch friends on load
	const fetchFriends = async () => {
		try {
			const data = await getFriends();
			// @ts-ignore - status type mismatch simple fix
			setFriends(data);
		} catch (err) {
			console.error('Failed to load friends', err);
		} finally {
			setIsLoadingFriends(false);
		}
	};

	useEffect(() => {
		fetchFriends();
	}, []);

	const handleAddFriend = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus('loading');

		const result = await addFriend(email);

		if (result.success) {
			setStatus('success');
			setMessage(result.message);
			// Refresh list
			await fetchFriends();

			setTimeout(() => {
				setIsAdding(false);
				setStatus('idle');
				setEmail('');
				setMessage('');
			}, 2000);
		} else {
			setStatus('error');
			setMessage(result.message);
		}
	};

	return (
		<div className="relative flex h-full flex-col bg-white px-4 pt-4">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-3xl font-extrabold text-text-primary">
					Friends
				</h1>
				<button
					onClick={() => setIsAdding(true)}
					className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-text-primary transition-colors hover:bg-slate-200"
				>
					<UserPlus size={24} />
				</button>
			</div>

			<div className="relative mb-6">
				<Search
					className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
					size={18}
				/>
				<input
					type="text"
					placeholder="Search friends by name or username"
					className="w-full rounded-2xl bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-text-primary outline-none focus:ring-2 focus:ring-brand-primary/20"
				/>
			</div>

			<div className="space-y-2">
				{isLoadingFriends ? (
					<div className="flex justify-center p-8">
						<Loader2 className="animate-spin text-slate-400" />
					</div>
				) : (
					friends.map((friend) => (
						<div
							key={friend.id}
							className="flex items-center justify-between rounded-2xl p-3 hover:bg-slate-50 transition-colors cursor-pointer"
						>
							<div className="flex items-center gap-3">
								{friend.image ? (
									<img
										src={friend.image}
										alt={friend.name}
										className="h-12 w-12 rounded-full object-cover"
									/>
								) : (
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-500 font-bold">
										{friend.name?.[0] || '?'}
									</div>
								)}

								<div>
									<h3 className="font-bold text-text-primary">
										{friend.name}
									</h3>
									<p className="text-xs text-text-secondary">
										{friend.email}
									</p>
								</div>
							</div>

							<div className="text-right">
								{friend.status === 'owe' && (
									<span className="text-xs font-bold text-orange-500">
										You owe
									</span>
								)}
								{friend.status === 'owed' && (
									<span className="text-xs font-bold text-emerald-500">
										Owes you
									</span>
								)}
								{friend.status === 'settled' && (
									<span className="text-xs font-bold text-slate-300">
										Settled
									</span>
								)}
							</div>
						</div>
					))
				)}
			</div>

			{/* Add Friend Modal Overlay */}
			{isAdding && (
				<div className="absolute inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
					<div className="w-full rounded-t-3xl bg-white p-6 sm:w-[90%] sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-xl font-bold">Add Friend</h2>
							<button
								onClick={() => setIsAdding(false)}
								className="rounded-full bg-slate-100 p-2"
							>
								<X size={20} />
							</button>
						</div>

						<form onSubmit={handleAddFriend} className="space-y-4">
							<div>
								<label className="text-xs font-bold uppercase text-slate-400">
									Email Address
								</label>
								<input
									autoFocus
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="friend@example.com"
									className="mt-1 w-full border-b-2 border-slate-200 py-2 text-lg font-semibold outline-none focus:border-brand-primary"
								/>
							</div>

							{status === 'error' && (
								<p className="text-sm font-medium text-red-500">
									{message}
								</p>
							)}

							<button
								disabled={
									status === 'loading' ||
									status === 'success' ||
									!email
								}
								className={cn(
									'w-full rounded-2xl py-4 text-lg font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-2',
									status === 'success'
										? 'bg-emerald-500'
										: 'bg-brand-primary disabled:opacity-50'
								)}
							>
								{status === 'loading' && (
									<Loader2 className="animate-spin" />
								)}
								{status === 'success' && <Check />}
								{status === 'idle' && 'Send Request'}
								{status === 'success' && 'Sent!'}
								{status === 'error' && 'Try Again'}
							</button>
						</form>
					</div>
				</div>
			)}

			{/* Zero State */}
			{!isLoadingFriends && friends.length === 0 && (
				<div className="mt-12 flex flex-col items-center justify-center text-center opacity-60">
					<div className="mb-4 rounded-full bg-slate-100 p-6">
						<UserPlus size={48} className="text-slate-400" />
					</div>
					<p className="text-lg font-bold text-text-primary">
						Add your friends
					</p>
					<p className="text-sm text-text-secondary max-w-50">
						It&apos;s more fun to split bills with people you
						actually know.
					</p>
				</div>
			)}
		</div>
	);
}
