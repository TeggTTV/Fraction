'use client';

import { MOCK_GROUPS } from '@/data/mock';
import { calculateUserBalance } from '@/lib/ledger';
import { Plus, ChevronRight, Home, Plane, User } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function GroupsPage() {
	const myId = 'me';

	return (
		<div className="flex flex-col min-h-full bg-white px-4 pt-12">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-3xl font-extrabold text-text-primary">
					Groups
				</h1>
				<Link href="/groups/new">
					<button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-text-primary transition-colors hover:bg-slate-200">
						<Plus size={24} />
					</button>
				</Link>
			</div>

			<div className="space-y-4">
				{MOCK_GROUPS.map((group) => {
					const balance = calculateUserBalance(myId, group.expenses);
					const isOwed = balance > 0;
					const isDebt = balance < 0;

					let Icon = Home;
					if (group.type === 'trip') Icon = Plane;
					if (group.type === 'other') Icon = User;

					return (
						<Link href={`/groups/${group.id}`} key={group.id}>
							<div className="group relative flex items-center justify-between overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md active:scale-[98%]">
								{/* Icon Background */}
								<div className="flex items-center gap-4">
									<div
										className={cn(
											'flex h-14 w-14 items-center justify-center rounded-2xl',
											group.type === 'house'
												? 'bg-indigo-100 text-indigo-600'
												: group.type === 'trip'
												? 'bg-teal-100 text-teal-600'
												: 'bg-slate-100 text-slate-600'
										)}
									>
										<Icon size={28} />
									</div>

									<div>
										<h2 className="text-lg font-bold text-text-primary">
											{group.name}
										</h2>
										<p className="text-sm text-text-secondary">
											{group.members.length} members
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<div className="text-right">
										{balance === 0 && (
											<span className="text-sm font-medium text-text-muted">
												Settled
											</span>
										)}
										{isOwed && (
											<div className="flex flex-col items-end">
												<span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
													You are owed
												</span>
												<span className="text-lg font-bold text-emerald-600">
													+${balance.toFixed(2)}
												</span>
											</div>
										)}
										{isDebt && (
											<div className="flex flex-col items-end">
												<span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">
													You owe
												</span>
												<span className="text-lg font-bold text-orange-500">
													-$
													{Math.abs(balance).toFixed(
														2
													)}
												</span>
											</div>
										)}
									</div>
									<ChevronRight
										size={20}
										className="text-slate-300"
									/>
								</div>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
