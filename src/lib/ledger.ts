import { User, Expense, Split } from '@prisma/client';

// Expense with splits included
type ExpenseWithSplits = Expense & {
	splits: Split[];
};

export interface Balance {
	userId: string;
	amount: number;
}

export interface DebtError {
	from: string;
	to: string;
	amount: number;
}

/**
 * Calculates the net position for a specific user across a set of expenses.
 * Returns:
 * - Positive number: The user is OWED this amount.
 * - Negative number: The user OWES this amount.
 */
export function calculateUserBalance(
	userId: string,
	expenses: ExpenseWithSplits[]
): number {
	let balance = 0;

	expenses.forEach((expense) => {
		// 1. Did the user pay for this?
		if (expense.payerId === userId) {
			balance += expense.amount;
		}

		// 2. How much does theuser owe on this expense?
		const userSplit = expense.splits.find((s) => s.userId === userId);
		if (userSplit) {
			balance -= userSplit.amount;
		}
	});

	return parseFloat(balance.toFixed(2));
}

/**
 * Generates the "Simplified Debt" graph.
 * It takes a list of expenses and turns it into "Who owes who".
 */
export function calculateDebts(
	members: User[],
	expenses: ExpenseWithSplits[]
): DebtError[] {
	// 1. Calculate net balances for everyone
	const balances: { [userId: string]: number } = {};

	members.forEach((member) => {
		balances[member.id] = calculateUserBalance(member.id, expenses);
	});

	// 2. Separate into debtors (owe money) and creditors (owed money)
	let debtors: { id: string; amount: number }[] = [];
	let creditors: { id: string; amount: number }[] = [];

	Object.entries(balances).forEach(([id, amount]) => {
		if (amount < -0.01) debtors.push({ id, amount }); // Negative balance
		if (amount > 0.01) creditors.push({ id, amount }); // Positive balance
	});

	// Sort by magnitude to optimize (greedy approach)
	debtors.sort((a, b) => a.amount - b.amount); // Most negative first
	creditors.sort((a, b) => b.amount - a.amount); // Most positive first

	const debts: DebtError[] = [];

	// 3. Match them up
	let i = 0; // debtor index
	let j = 0; // creditor index

	while (i < debtors.length && j < creditors.length) {
		const debtor = debtors[i];
		const creditor = creditors[j];

		// The amount to settle is the minimum of what's owed vs what's owed TO
		// Math.abs(debtor.amount) is what they owe. creditor.amount is what they are owed.
		const amount = Math.min(Math.abs(debtor.amount), creditor.amount);

		if (amount > 0) {
			debts.push({
				from: debtor.id,
				to: creditor.id,
				amount: parseFloat(amount.toFixed(2)),
			});
		}

		// Update remaining balances
		debtor.amount += amount;
		creditor.amount -= amount;

		// If fully settled, move to next person
		if (Math.abs(debtor.amount) < 0.01) i++;
		if (creditor.amount < 0.01) j++;
	}

	return debts;
}
