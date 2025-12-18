'use client';

import { use, useState, useEffect } from 'react';
import { MOCK_GROUPS, MOCK_USERS } from '@/data/mock';
import { ExpenseBubble } from '@/components/ExpenseBubble';
import {
	ChevronLeft,
	Info,
	Receipt,
	Send,
	DollarSign,
	MoreHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function GroupPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	// Unwrap params using use() hook as per Next.js 15+ guidance or await it if async component
	// Since this is a client component, we'll use React.use() to unwrap the promise
	const { id } = use(params);
	const router = useRouter();

	const group = MOCK_GROUPS.find((g) => g.id === id);

	if (!group) {
		return (
			<div className="flex h-full items-center justify-center">
				<p>Group not found</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-[#f2f4f7]">
			{/* Header */}
			<header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/20 bg-white/80 px-4 py-4 backdrop-blur-md shadow-sm">
				<div className="flex items-center gap-3">
					<Link
						href="/groups"
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
									: 'bg-teal-500'
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
					<Link href={`/groups/${id}/settle`}>
						<button className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-transform active:scale-95">
							<DollarSign size={14} />
							Settle
						</button>
					</Link>
					<button className="rounded-full p-2 hover:bg-slate-100 transition-colors">
						<MoreHorizontal
							size={24}
							className="text-text-secondary"
						/>
					</button>
				</div>
			</header>

			{/* Chat / Feed Area */}
			<main className="flex-1 overflow-y-auto p-4">
				{/* Date Divider Example */}
				<div className="mb-6 text-center">
					<span className="rounded-full bg-slate-200/60 px-3 py-1 text-[10px] font-medium text-slate-500">
						Today
					</span>
				</div>

				{group.expenses.map((expense) => {
					const isMe = expense.payerId === 'me';
					const sender = isMe
						? MOCK_USERS['me']
						: MOCK_USERS[expense.payerId];
					return (
						<ExpenseBubble
							key={expense.id}
							expense={expense}
							isMe={isMe}
							sender={sender}
						/>
					);
				})}

				{/* Bottom spacer for input area */}
				<div className="h-4" />
			</main>

			{/* Input Area (Mock) */}
			<div className="sticky bottom-0 bg-white p-3 border-t border-slate-100 pb-8">
				<div className="flex items-center gap-2">
					<button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white transition-transform active:scale-95">
						<Receipt size={20} />
					</button>
					<div className="flex-1 rounded-full bg-slate-100 px-4 py-2.5 text-sm text-slate-500">
						Add an expense...
					</div>
					<button className="p-2 text-brand-primary">
						<Send size={24} />
					</button>
				</div>
			</div>
		</div>
	);
}
