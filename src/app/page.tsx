'use client';

import { Search, MoreHorizontal } from 'lucide-react';
import { MOCK_GROUPS, MOCK_USERS } from '@/data/mock';
import { calculateUserBalance } from '@/lib/ledger';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function Home() {
	const myId = 'me';

	// 1. Calculate Total Net Worth across all groups
	const totalBalance = MOCK_GROUPS.reduce((acc, group) => {
		return acc + calculateUserBalance(myId, group.expenses);
	}, 0);

	// 2. Generate a "Thread" for each group
	const threads = MOCK_GROUPS.map((group) => {
		// Determine the last activity
		const lastExpense = group.expenses.sort(
			(a, b) =>
				new Date(b.timestamp).getTime() -
				new Date(a.timestamp).getTime()
		)[0];

		const payerName =
			lastExpense.payerId === myId
				? 'You'
				: MOCK_USERS[lastExpense.payerId]?.name;
		const isSettled = calculateUserBalance(myId, group.expenses) === 0;

		return {
			group,
			lastExpense,
			payerName,
			isSettled,
			balance: calculateUserBalance(myId, group.expenses),
		};
	}).sort((a, b) => {
		// Sort by recent activity
		return (
			new Date(b.lastExpense.timestamp).getTime() -
			new Date(a.lastExpense.timestamp).getTime()
		);
	});

	return (
		<div className="flex flex-col min-h-full bg-white">
			{/* Header */}
			<header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 px-4 py-4 backdrop-blur-md">
				<h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
					Fraction
				</h1>
				<div className="flex gap-4">
					<button className="rounded-full bg-slate-100 p-2 transition-colors hover:bg-slate-200">
						<Search size={20} className="text-text-secondary" />
					</button>
					<button className="rounded-full bg-slate-100 p-2 transition-colors hover:bg-slate-200">
						<MoreHorizontal
							size={20}
							className="text-text-secondary"
						/>
					</button>
				</div>
			</header>

			{/* Debt Summary (Quick-glance) */}
			<section className="px-4 pb-2 pt-2">
				<div className="flex w-full items-center justify-between rounded-2xl bg-black p-4 text-white shadow-lg">
					<div>
						<p className="text-xs font-medium text-zinc-400">
							Total Balance
						</p>
						<p
							className={cn(
								'text-2xl font-bold',
								totalBalance >= 0
									? 'text-emerald-400'
									: 'text-orange-400'
							)}
						>
							{totalBalance >= 0 ? '+' : '-'}$
							{Math.abs(totalBalance).toFixed(2)}
						</p>
					</div>
					<div className="text-right">
						<p className="text-xs font-medium text-zinc-400">
							{totalBalance >= 0 ? 'You are owed' : 'You owe'}
						</p>
					</div>
				</div>
			</section>

			{/* Thread List */}
			<main className="flex-1 px-2 pt-4">
				<div className="space-y-1">
					{threads.map(
						({ group, lastExpense, payerName, isSettled }) => (
							<Link
								key={group.id}
								href={`/groups/${group.id}`}
								className="group flex cursor-pointer items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-slate-50 active:bg-slate-100"
							>
								{/* Avatar */}
								<div
									className={cn(
										'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-sm',
										group.type === 'house'
											? 'bg-indigo-500'
											: 'bg-teal-500'
									)}
								>
									<span className="text-lg font-bold">
										{group.name[0]}
									</span>
								</div>

								{/* Content */}
								<div className="flex flex-1 flex-col justify-center gap-0.5 overflow-hidden">
									<div className="flex items-center justify-between">
										<h3 className="truncate text-base font-bold text-text-primary">
											{group.name}
										</h3>
										<span className="text-xs font-medium text-text-muted">
											{new Date(
												lastExpense.timestamp
											).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
											})}
										</span>
									</div>
									<div className="flex items-center justify-between">
										{isSettled ? (
											<p className="text-sm font-medium text-text-muted italic">
												All settled up
											</p>
										) : (
											<p className="truncate text-sm text-text-secondary">
												{payerName} paid{' '}
												<span className="font-semibold text-text-primary">
													$
													{lastExpense.amount.toFixed(
														2
													)}
												</span>{' '}
												for{' '}
												{
													lastExpense.description.split(
														' '
													)[0]
												}
											</p>
										)}

										{/* Small Activity Dot if Unread (Mock) */}
										{!isSettled && (
											<div className="h-2 w-2 rounded-full bg-brand-primary" />
										)}
									</div>
								</div>
							</Link>
						)
					)}
				</div>
			</main>
		</div>
	);
}
