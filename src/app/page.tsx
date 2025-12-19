import { Search, MoreHorizontal, Plus } from 'lucide-react';
import { calculateUserBalance } from '@/lib/ledger';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { getGroups } from '@/app/actions';
import { auth } from '@/auth';
import SignInPromptModal from '@/components/SignInPromptModal';

export default async function Home() {
	const session = await auth();
	const isAuthenticated = !!session?.user?.id;

	// Fetch data (will be empty if not authenticated)
	const myId = session?.user?.id || '';
	const groups = isAuthenticated ? await getGroups() : [];

	// 1. Calculate Total Net Worth across all groups
	const totalBalance = groups.reduce((acc, group) => {
		return acc + calculateUserBalance(myId, group.expenses);
	}, 0);

	// 2. Generate a "Thread" for each group
	const threads = groups
		.map((group) => {
			// Determine the last activity
			const sortedExpenses = [...group.expenses].sort(
				(a, b) =>
					new Date(b.date).getTime() - new Date(a.date).getTime()
			);
			const lastExpense = sortedExpenses[0];

			const balance = calculateUserBalance(myId, group.expenses);
			const isSettled = balance === 0;

			let payerName = 'Someone';
			if (lastExpense) {
				payerName =
					lastExpense.payerId === myId
						? 'You'
						: lastExpense.payer?.name || 'Unknown';
			}

			return {
				group,
				lastExpense,
				payerName,
				isSettled,
				balance,
			};
		})
		.sort((a, b) => {
			// Sort by recent activity
			const timeA = a.lastExpense
				? new Date(a.lastExpense.date).getTime()
				: new Date(a.group.createdAt).getTime();
			const timeB = b.lastExpense
				? new Date(b.lastExpense.date).getTime()
				: new Date(b.group.createdAt).getTime();
			return timeB - timeA;
		});

	return (
		<div className="relative h-full">
			{/* Show modal when not authenticated */}
			{!isAuthenticated && <SignInPromptModal />}

			{/* Main UI - disabled when not authenticated */}
			<div
				className={cn(
					'flex flex-col min-h-full bg-white',
					!isAuthenticated && 'pointer-events-none opacity-60'
				)}
			>
				{/* Header */}
				<header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 px-4 py-4 backdrop-blur-md">
					<h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
						Fraction
					</h1>
					<div className="flex gap-4">
						<Link
							href="/groups/new"
							className="rounded-full bg-slate-100 p-2 transition-colors hover:bg-slate-200"
						>
							<Plus size={20} className="text-text-secondary" />
						</Link>
						<button className="rounded-full bg-slate-100 p-2 transition-colors hover:bg-slate-200">
							<Search size={20} className="text-text-secondary" />
						</button>
					</div>
				</header>

				{/* Debt Summary (Quick-glance) */}
				<section className="px-4 pb-2 pt-2">
					<div className="flex w-full items-center justify-between rounded-2xl p-4 shadow-lg">
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
				<main className="flex-1 px-2 pt-4 pb-24">
					{threads.length === 0 ? (
						<div className="flex flex-col items-center justify-center pt-4 text-center">
							<div className="mb-4 rounded-full bg-slate-100 p-6">
								<MoreHorizontal
									size={48}
									className="text-slate-400"
								/>
							</div>
							<p className="text-lg font-bold text-text-primary">
								No groups yet
							</p>
							<p className="text-sm text-text-secondary">
								Start a group to split expenses
							</p>
							<Link
								href="/groups/new"
								className="mt-6 rounded-xl bg-brand-primary px-6 py-3 font-bold text-white"
							>
								Create Group
							</Link>
						</div>
					) : (
						<div className="space-y-1">
							{threads.map(
								({
									group,
									lastExpense,
									payerName,
									isSettled,
								}) => (
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
													: group.type === 'trip'
													? 'bg-teal-500'
													: 'bg-orange-500'
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
												{lastExpense && (
													<span className="text-xs font-medium text-text-muted">
														{new Date(
															lastExpense.date
														).toLocaleTimeString(
															[],
															{
																hour: '2-digit',
																minute: '2-digit',
															}
														)}
													</span>
												)}
											</div>
											<div className="flex items-center justify-between">
												{!lastExpense ? (
													<p className="text-sm text-text-muted italic">
														No expenses yet
													</p>
												) : (
													<div className="flex items-center gap-2">
														<p
															className={cn(
																'truncate text-sm',
																isSettled
																	? 'text-text-muted'
																	: 'text-text-secondary'
															)}
														>
															<span className="font-medium text-text-primary">
																{payerName}
															</span>{' '}
															paid{' '}
															<span className="font-medium text-text-primary">
																$
																{lastExpense.amount.toFixed(
																	2
																)}
															</span>{' '}
															for{' '}
															{
																lastExpense.description
															}
														</p>
													</div>
												)}

												{/* Status Indicator */}
												{lastExpense && (
													<div className="shrink-0 ml-2">
														{!isSettled ? (
															<div className="h-2 w-2 rounded-full bg-brand-primary" />
														) : (
															<span className="text-xs font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
																Settled
															</span>
														)}
													</div>
												)}
											</div>
										</div>
									</Link>
								)
							)}
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
