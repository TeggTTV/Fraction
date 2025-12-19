import { auth } from '@/auth';
import { getGroups } from '@/app/actions';
import { Clock, Receipt, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ActivityPage() {
	const session = await auth();
	if (!session?.user) redirect('/profile');

	const groups = await getGroups();
	const myId = session.user.id;

	// Flatten all expenses from all groups with group context
	const allExpenses = groups.flatMap((group) =>
		group.expenses.map((expense) => ({
			...expense,
			groupName: group.name,
			groupId: group.id,
			groupType: group.type,
		}))
	);

	// Sort by date, newest first
	allExpenses.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);

	// Group expenses by date
	const groupedByDate: { [key: string]: typeof allExpenses } = {};
	allExpenses.forEach((expense) => {
		const dateKey = new Date(expense.date).toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
		});
		if (!groupedByDate[dateKey]) {
			groupedByDate[dateKey] = [];
		}
		groupedByDate[dateKey].push(expense);
	});

	return (
		<div className="flex flex-col min-h-full px-4 pt-4 pb-24">
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-3xl font-extrabold text-text-primary">
					Activity
				</h1>
				<p className="text-sm text-text-secondary mt-1">
					All expenses across your groups
				</p>
			</div>

			{/* Activity List */}
			{allExpenses.length === 0 ? (
				<div className="flex flex-col items-center justify-center pt-20 text-center">
					<div className="mb-4 rounded-full bg-slate-100 p-6">
						<Receipt size={48} className="text-slate-400" />
					</div>
					<h3 className="text-lg font-bold text-text-primary mb-2">
						No activity yet
					</h3>
					<p className="text-sm text-text-secondary">
						Add some expenses to see them here
					</p>
				</div>
			) : (
				<div className="space-y-6">
					{Object.entries(groupedByDate).map(([date, expenses]) => (
						<div key={date}>
							{/* Date Header */}
							<div className="flex items-center gap-2 mb-3 px-1">
								<Clock
									size={14}
									className="text-text-secondary"
								/>
								<span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
									{date}
								</span>
							</div>

							{/* Expenses for this date */}
							<div className="space-y-2">
								{expenses.map((expense) => {
									const isMine = expense.payerId === myId;
									const myShare =
										expense.splits.find(
											(s) => s.userId === myId
										)?.amount || 0;

									return (
										<Link
											href={`/groups/${expense.groupId}`}
											key={expense.id}
										>
											<div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-[98%]">
												<div className="flex items-start justify-between">
													<div className="flex-1 min-w-0">
														{/* Group tag */}
														<div className="flex items-center gap-2 mb-1">
															<span className="text-xs font-medium text-text-secondary bg-slate-100 px-2 py-0.5 rounded-full">
																{
																	expense.groupName
																}
															</span>
														</div>

														{/* Description */}
														<h3 className="font-bold text-text-primary mb-1">
															{
																expense.description
															}
														</h3>

														{/* Payer info */}
														<p className="text-sm text-text-secondary">
															{isMine ? (
																<>
																	You paid{' '}
																	<span className="font-semibold text-text-primary">
																		$
																		{expense.amount.toFixed(
																			2
																		)}
																	</span>
																</>
															) : (
																<>
																	{expense
																		.payer
																		?.name ||
																		'Someone'}{' '}
																	paid{' '}
																	<span className="font-semibold text-text-primary">
																		$
																		{expense.amount.toFixed(
																			2
																		)}
																	</span>
																</>
															)}
														</p>
													</div>

													{/* My share */}
													<div className="flex items-center gap-2 ml-3">
														<div className="text-right">
															<p className="text-xs text-text-secondary">
																Your share
															</p>
															<p className="font-bold text-brand-primary">
																$
																{myShare.toFixed(
																	2
																)}
															</p>
														</div>
														<ChevronRight
															size={18}
															className="text-slate-300"
														/>
													</div>
												</div>
											</div>
										</Link>
									);
								})}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
