import { auth } from '@/auth';
import { getGroupDetails } from '@/app/actions';
import { calculateDebts } from '@/lib/ledger';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function SettlePage({ params }: PageProps) {
	const session = await auth();
	if (!session?.user) redirect('/api/auth/signin');

	const { id } = await params;
	const group = await getGroupDetails(id);

	if (!group) {
		return (
			<div className="flex h-full items-center justify-center">
				<p>Group not found</p>
			</div>
		);
	}

	// Extract members as User objects
	const members = group.members.map((m) => m.user);

	// Calculate debts from group expenses
	const debts = calculateDebts(members, group.expenses);

	return (
		<div className="flex h-full flex-col bg-[#f2f4f7]">
			{/* Header */}
			<header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/20 bg-white/80 px-4 py-4 backdrop-blur-md shadow-sm">
				<Link
					href={`/groups/${id}`}
					className="rounded-full p-2 hover:bg-slate-100 transition-colors"
				>
					<ChevronLeft size={24} className="text-text-primary" />
				</Link>
				<div>
					<h1 className="text-lg font-bold text-text-primary">
						Settle Up
					</h1>
					<p className="text-xs text-text-secondary">{group.name}</p>
				</div>
			</header>

			{/* Content */}
			<main className="flex-1 overflow-y-auto p-4">
				{debts.length === 0 ? (
					<div className="flex flex-col items-center justify-center pt-20 text-center">
						<div className="mb-4 rounded-full bg-emerald-100 p-6">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
								className="w-12 h-12 text-emerald-600"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<h3 className="text-lg font-bold text-text-primary mb-2">
							All Settled!
						</h3>
						<p className="text-sm text-text-secondary">
							No outstanding debts in this group
						</p>
					</div>
				) : (
					<div className="space-y-6">
						<div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
							<h2 className="font-bold text-text-primary mb-4">
								Settlement Plan
							</h2>
							<p className="text-sm text-text-secondary mb-4">
								Optimized to minimize number of transactions
							</p>

							<div className="space-y-3">
								{debts.map((debt, index) => {
									const fromUser = group.members.find(
										(m) => m.userId === debt.from
									)?.user;
									const toUser = group.members.find(
										(m) => m.userId === debt.to
									)?.user;

									if (!fromUser || !toUser) return null;

									return (
										<div
											key={index}
											className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100"
										>
											{/* From User */}
											<div className="flex items-center gap-2 flex-1">
												<div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
													{fromUser.name?.[0] || '?'}
												</div>
												<span className="text-sm font-medium text-text-primary">
													{fromUser.name}
												</span>
											</div>

											{/* Arrow & Amount */}
											<div className="flex flex-col items-center gap-1">
												<ArrowRight
													size={20}
													className="text-slate-400"
												/>
												<span className="text-lg font-bold text-brand-primary">
													${debt.amount.toFixed(2)}
												</span>
											</div>

											{/* To User */}
											<div className="flex items-center gap-2 flex-1 justify-end">
												<span className="text-sm font-medium text-text-primary">
													{toUser.name}
												</span>
												<div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
													{toUser.name?.[0] || '?'}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						{/* Info Card */}
						<div className="rounded-2xl bg-blue-50 p-4 border border-blue-100">
							<p className="text-sm text-blue-900">
								💡 <span className="font-bold">Tip:</span> This
								plan uses the minimum number of payments to
								settle all debts fairly.
							</p>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
