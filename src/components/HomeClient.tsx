'use client';

import { motion } from 'framer-motion';
import {
	Search,
	MoreHorizontal,
	Plus,
	TrendingUp,
	TrendingDown,
	Minus,
	ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Thread {
	group: {
		id: string;
		name: string;
		type: string;
	};
	lastExpense: {
		id: string;
		description: string;
		amount: number;
		payerId: string;
		date: Date;
	} | null;
	payerName: string;
	balance: number;
	isSettled: boolean;
}

interface HomeClientProps {
	totalBalance: number;
	threads: Thread[];
	myId: string;
}

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.08,
		},
	},
};

const item = {
	hidden: { y: 20, opacity: 0 },
	show: {
		y: 0,
		opacity: 1,
		transition: {
			type: 'spring',
			damping: 20,
			stiffness: 300,
		},
	},
};

export default function HomeClient({
	totalBalance,
	threads,
	myId,
}: HomeClientProps) {
	return (
		<div className="flex flex-col min-h-full bg-white">
			{/* Header */}
			<motion.header
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.4 }}
				className="sticky top-0 z-30 flex items-center justify-between bg-white/80 px-4 py-4 backdrop-blur-md"
			>
				<h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
					Fraction
				</h1>
				<div className="flex gap-4">
					<Link
						href="/groups/new"
						className="rounded-full bg-slate-100 p-2 transition-colors hover:bg-slate-200 active:scale-95"
					>
						<Plus size={20} className="text-text-secondary" />
					</Link>
					<button className="rounded-full bg-slate-100 p-2 transition-colors hover:bg-slate-200 active:scale-95">
						<Search size={20} className="text-text-secondary" />
					</button>
				</div>
			</motion.header>

			{/* Balance Card */}
			<motion.section
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
				className="px-4 pb-2 pt-2"
			>
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
							${Math.abs(totalBalance).toFixed(2)}
						</p>
					</div>
					<div
						className={cn(
							'rounded-full p-3',
							totalBalance >= 0 ? 'bg-emerald-50' : 'bg-orange-50'
						)}
					>
						{totalBalance > 0 ? (
							<TrendingUp
								size={24}
								className="text-emerald-500"
							/>
						) : totalBalance < 0 ? (
							<TrendingDown
								size={24}
								className="text-orange-500"
							/>
						) : (
							<Minus size={24} className="text-zinc-400" />
						)}
					</div>
				</div>
			</motion.section>

			{/* Threads */}
			<motion.main
				variants={container}
				initial="hidden"
				animate="show"
				className="flex-1 overflow-y-auto px-4 pb-24"
			>
				<motion.h2
					initial={{ x: -20, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="mb-3 text-sm font-bold uppercase tracking-wider text-zinc-400"
				>
					Your Groups
				</motion.h2>

				{threads.length === 0 ? (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="flex flex-col items-center justify-center py-12 text-center"
					>
						<div className="mb-4 rounded-full bg-slate-100 p-6">
							<Plus size={32} className="text-slate-400" />
						</div>
						<h3 className="text-lg font-bold text-text-primary mb-2">
							No Groups Yet
						</h3>
						<p className="text-sm text-text-secondary mb-4">
							Create your first group to start splitting expenses
						</p>
						<Link href="/groups/new">
							<button className="bg-brand-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 active:scale-95 transition-all">
								Create Group
							</button>
						</Link>
					</motion.div>
				) : (
					<div className="space-y-2">
						{threads.map((thread, index) => (
							<motion.div key={thread.group.id} variants={item}>
								<Link href={`/groups/${thread.group.id}`}>
									<div className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-white p-4 transition-all hover:shadow-md active:scale-[0.98]">
										{/* Left: Avatar + Info */}
										<div className="flex items-center gap-3">
											<div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-lg font-bold text-white shadow-md">
												{thread.group.name[0]}
											</div>
											<div>
												<p className="font-bold text-text-primary">
													{thread.group.name}
												</p>
												{thread.lastExpense ? (
													<p className="text-xs text-zinc-500">
														{thread.payerName} paid{' '}
														<span className="font-semibold">
															$
															{thread.lastExpense.amount.toFixed(
																2
															)}
														</span>
													</p>
												) : (
													<p className="text-xs text-zinc-400">
														No expenses yet
													</p>
												)}
											</div>
										</div>

										{/* Right: Balance + Arrow */}
										<div className="flex items-center gap-2">
											{thread.isSettled ? (
												<span className="text-xs font-medium text-emerald-500">
													Settled
												</span>
											) : (
												<p
													className={cn(
														'text-sm font-bold',
														thread.balance >= 0
															? 'text-emerald-500'
															: 'text-orange-500'
													)}
												>
													{thread.balance > 0
														? '+'
														: ''}
													${thread.balance.toFixed(2)}
												</p>
											)}
											<ChevronRight
												size={20}
												className="text-zinc-300"
											/>
										</div>
									</div>
								</Link>
							</motion.div>
						))}
					</div>
				)}
			</motion.main>
		</div>
	);
}
