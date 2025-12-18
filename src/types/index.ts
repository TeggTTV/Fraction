export interface User {
	id: string;
	name: string;
	avatar: string; // URL or color class for now
	email?: string;
}

export interface Expense {
	id: string;
	groupId: string;
	payerId: string;
	amount: number;
	description: string;
	timestamp: string; // ISO date
	splits: Split[];
}

export interface Split {
	userId: string;
	amount: number; // The amount this user OWES for this expense
	paid: boolean; // Whether they have settled this specific split (optional, usually handled by netting)
}

export interface Group {
	id: string;
	name: string;
	members: User[];
	expenses: Expense[];
	type: 'couple' | 'trip' | 'house' | 'other';
}

export interface Balance {
	userId: string;
	amount: number; // Positive = Owed to you, Negative = You owe
}

// For the "Simplification" graph
export interface DebtError {
	from: string;
	to: string;
	amount: number;
}
