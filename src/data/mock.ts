import { Group, User } from '@/types';

export const MOCK_USERS: { [key: string]: User } = {
	me: { id: 'me', name: 'You', avatar: 'bg-indigo-500' },
	sarah: { id: 'sarah', name: 'Sarah', avatar: 'bg-pink-500' },
	mike: { id: 'mike', name: 'Mike', avatar: 'bg-teal-500' },
	jess: { id: 'jess', name: 'Jess', avatar: 'bg-emerald-500' },
};

export const MOCK_GROUPS: Group[] = [
	{
		id: 'g1',
		name: 'Roommates 🏠',
		type: 'house',
		members: [
			MOCK_USERS.me,
			MOCK_USERS.sarah,
			MOCK_USERS.mike,
			MOCK_USERS.jess,
		],
		expenses: [
			{
				id: 'e1',
				groupId: 'g1',
				payerId: 'me',
				amount: 145.0,
				description: 'Utilities (Jan)',
				timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 mins ago
				splits: [
					{ userId: 'me', amount: 36.25, paid: true },
					{ userId: 'sarah', amount: 36.25, paid: false },
					{ userId: 'mike', amount: 36.25, paid: false },
					{ userId: 'jess', amount: 36.25, paid: false },
				],
			},
			{
				id: 'e2',
				groupId: 'g1',
				payerId: 'sarah',
				amount: 24.5,
				description: 'Sushi Takeout',
				timestamp: new Date(
					Date.now() - 1000 * 60 * 60 * 2
				).toISOString(), // 2 hours ago
				splits: [
					{ userId: 'me', amount: 12.25, paid: false },
					{ userId: 'sarah', amount: 12.25, paid: true },
				],
			},
		],
	},
	{
		id: 'g2',
		name: 'Tahoe Trip 🏔️',
		type: 'trip',
		members: [MOCK_USERS.me, MOCK_USERS.mike],
		expenses: [
			{
				id: 'e3',
				groupId: 'g2',
				payerId: 'mike',
				amount: 65.0,
				description: 'Gas',
				timestamp: new Date(
					Date.now() - 1000 * 60 * 60 * 24
				).toISOString(), // 1 day ago
				splits: [
					{ userId: 'me', amount: 32.5, paid: false },
					{ userId: 'mike', amount: 32.5, paid: true },
				],
			},
		],
	},
];
