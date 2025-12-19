import { auth } from '@/auth';
import { getGroupDetails, getFriends } from '@/app/actions';
import { ExpenseBubble } from '@/components/ExpenseBubble';
import ExpenseInput from '@/components/ExpenseInput';
import AddMemberModal from '@/components/AddMemberModal';
import { GroupSettingsButton } from '@/components/GroupSettingsButton';
import { ChevronLeft, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { redirect } from 'next/navigation';

// Add this interface to handle the params type
interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function GroupPage({ params }: PageProps) {
	const session = await auth();
	if (!session?.user) redirect('/profile');

	const { id } = await params;
	const [group, friends] = await Promise.all([
		getGroupDetails(id),
		getFriends(),
	]);
	const myId = session.user.id;

	if (!group) {
		return (
			<div className="flex h-full items-center justify-center">
				<p>Group not found</p>
			</div>
		);
	}

	const memberIds = group.members.map((m) => m.userId);

	return (
		<div className="flex flex-col h-full bg-[#f2f4f7]">
			{/* Header */}
			<header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/20 bg-white/80 px-4 py-4 backdrop-blur-md shadow-sm">
				<div className="flex items-center gap-3">
					<Link
						href="/"
						className="rounded-full p-2 hover:bg-slate-100 transition-colors"
					>
						<ChevronLeft size={24} className="text-text-primary" />
					</Link>
					<div className="flex items-center gap-3">
						<div
							className={cn(
								'flex h-10 w-10 items-center justify-center rounded-full text-white font-bold shadow-sm',
								group.type === 'house'
									? 'bg-indigo-500'
									: group.type === 'trip'
									? 'bg-teal-500'
									: 'bg-orange-500'
							)}
						>
							{group.name[0]}
						</div>
						<div>
							<h1 className="text-lg font-bold text-text-primary leading-tight">
								{group.name}
							</h1>
							<p className="text-xs text-text-secondary">
								{group.members.length} people
							</p>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<AddMemberModal
						groupId={id}
						friends={friends}
						currentMemberIds={memberIds}
					/>
					<Link href={`/groups/${id}/settle`}>
						<button className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-transform active:scale-95">
							<DollarSign size={14} />
							Settle
						</button>
					</Link>
					<GroupSettingsButton
						groupId={id}
						groupName={group.name}
						isOwner={group.ownerId === myId}
					/>
				</div>
			</header>

			{/* Chat / Feed Area */}
			<main className="flex-1 overflow-y-auto p-4">
				{/* Date Divider (Mock for now, could group by date later) */}
				{/* 
				<div className="mb-6 text-center">
					<span className="rounded-full bg-slate-200/60 px-3 py-1 text-[10px] font-medium text-slate-500">
						Today
					</span>
				</div>
				*/}

				{group.expenses.length === 0 && (
					<div className="flex flex-col items-center justify-center h-full opacity-50">
						<p className="text-sm">No expenses yet.</p>
					</div>
				)}

				{group.expenses.map((expense) => {
					const isMe = expense.payerId === myId;

					// Map Prisma user to Shared User type expected by ExpenseBubble
					const sender = expense.payer
						? {
								id: expense.payer.id,
								name: expense.payer.name || 'Unknown',
								email: expense.payer.email || '',
								avatar: expense.payer.image || '',
						  }
						: undefined;

					// Map Prisma expense to Shared Expense type
					// Note: Shared type expects 'date: Date', Prisma provides 'date: Date' (mapped from createdAt usually or date field)
					// Our schema has 'date' field in Expense.
					// However, splits might be mismatching types slightly (Prisma split vs Shared split).
					// ExpenseBubble only uses description, amount, date. Splits are not rendered in bubble detail yet.
					// We'll cast carefully.

					return (
						<ExpenseBubble
							key={expense.id}
							expense={{
								...expense,
								groupId: expense.groupId || '', // Fallback for strict type
							}}
							isMe={isMe}
							sender={sender}
						/>
					);
				})}

				{/* Bottom spacer for input area */}
				<div className="h-4" />
			</main>

			{/* Input Area */}
			<ExpenseInput groupId={id} />
		</div>
	);
}
