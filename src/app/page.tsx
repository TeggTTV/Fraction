import { calculateUserBalance } from '@/lib/ledger';
import { getGroups } from '@/app/actions';
import { auth } from '@/auth';
import SignInPromptModal from '@/components/SignInPromptModal';
import HomeClient from '@/components/HomeClient';
import { cn } from '@/lib/utils';

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
					!isAuthenticated && 'pointer-events-none opacity-60'
				)}
			>
				<HomeClient
					totalBalance={totalBalance}
					threads={threads}
					myId={myId}
				/>
			</div>
		</div>
	);
}
