'use client';

import { Expense, User } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ExpenseBubbleProps {
	expense: Expense;
	isMe: boolean;
	sender: User | undefined;
}

export function ExpenseBubble({ expense, isMe, sender }: ExpenseBubbleProps) {
	return (
		<div
			className={cn(
				'flex w-full mb-4',
				isMe ? 'justify-end' : 'justify-start'
			)}
		>
			<div
				className={cn(
					'flex max-w-[80%] gap-2',
					isMe ? 'flex-row-reverse' : 'flex-row'
				)}
			>
				{/* Avatar */}
				<div
					className={cn(
						'h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm mt-auto',
						sender?.avatar || 'bg-gray-400'
					)}
				>
					{sender?.name?.[0]}
				</div>

				{/* Bubble */}
				<div
					className={cn(
						'relative rounded-2xl p-3 shadow-sm',
						isMe
							? 'bg-brand-primary text-white rounded-br-none'
							: 'bg-white text-text-primary border border-gray-100 rounded-bl-none'
					)}
				>
					{/* Header: Description & Amount */}
					<div className="flex items-baseline justify-between gap-4 mb-1">
						<span className="font-semibold">
							{expense.description}
						</span>
						<span className="text-lg font-bold">
							${expense.amount.toFixed(2)}
						</span>
					</div>

					{/* Details: Who paid / split */}
					<div
						className={cn(
							'text-xs opacity-90',
							isMe ? 'text-blue-100' : 'text-text-secondary'
						)}
					>
						<p>{isMe ? 'You' : sender?.name} paid</p>
					</div>

					{/* Timestamp */}
					<div
						className={cn(
							'text-[10px] mt-1 text-right',
							isMe ? 'text-blue-200' : 'text-gray-400'
						)}
					>
						{format(new Date(expense.date), 'h:mm a')}
					</div>
				</div>
			</div>
		</div>
	);
}
