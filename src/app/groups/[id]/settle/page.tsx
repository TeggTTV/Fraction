'use client';

import { use } from 'react';
import { MOCK_GROUPS, MOCK_USERS } from '@/data/mock';
import { calculateDebts } from '@/lib/ledger';
import { ChevronDown, X, CheckCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SettlePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const router = useRouter();

	const group = MOCK_GROUPS.find((g) => g.id === id);

	if (!group) return null;

	// Calculate the simplification graph
	const debts = calculateDebts(group.members, group.expenses);

	return (
		<div className="flex h-full flex-col bg-slate-50">
			{/* Header */}
			<div className="relative flex items-center justify-center p-6 pb-2">
				<h1 className="text-xl font-bold text-text-primary">
					Settlement Plan
				</h1>
				<button
					onClick={() => router.back()}
					className="absolute right-6 top-6 rounded-full bg-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-300"
				>
					<X size={20} />
				</button>
			</div>

			<p className="px-6 text-center text-sm text-text-secondary mb-8">
				The most efficient way to settle all debts in{' '}
				<span className="font-semibold text-text-primary">
					{group.name}
				</span>
				.
			</p>

			{/* Debt Graph Visualization */}
			<div className="flex-1 overflow-y-auto px-4 pb-24">
				<div className="space-y-3">
					{debts.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
							<CheckCheck
								size={64}
								className="mb-4 text-emerald-500"
							/>
							<p className="text-lg font-medium">
								All settled up!
							</p>
							<p className="text-sm">
								No debts pending in this group.
							</p>
						</div>
					) : (
						debts.map((debt, idx) => {
							const fromUser = MOCK_USERS[debt.from];
							const toUser = MOCK_USERS[debt.to];

							return (
								<motion.div
									key={`${debt.from}-${debt.to}`}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: idx * 0.1 }}
									className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100"
								>
									{/* From Person */}
									<div className="flex items-center gap-3">
										<div
											className={`flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-bold shadow-sm ${
												fromUser?.avatar ||
												'bg-gray-400'
											}`}
										>
											{fromUser?.name?.[0]}
										</div>
									</div>

									{/* Arrow / Action */}
									<div className="flex flex-1 flex-col items-center px-4">
										<span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
											Pays
										</span>
										<div className="my-1 h-[2px] w-full bg-slate-200 relative">
											<div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-200 rotate-45 transform origin-center translate-x-1" />
										</div>
										<span className="font-bold text-lg text-text-primary">
											${debt.amount.toFixed(2)}
										</span>
									</div>

									{/* To Person */}
									<div className="flex items-center gap-3">
										<div
											className={`flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-bold shadow-sm ${
												toUser?.avatar || 'bg-gray-400'
											}`}
										>
											{toUser?.name?.[0]}
										</div>
									</div>
								</motion.div>
							);
						})
					)}
				</div>
			</div>

			{/* Action Button */}
			{debts.length > 0 && (
				<div className="absolute bottom-6 left-0 w-full px-6">
					<button className="w-full rounded-2xl bg-brand-primary py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/30 transition-transform active:scale-95">
						Mark as Settled
					</button>
				</div>
			)}
		</div>
	);
}
