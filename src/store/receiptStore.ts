import { create } from 'zustand';

export interface ReceiptItem {
	id: string;
	name: string;
	price: number;
	assignedTo: string[]; // User IDs
}

interface ReceiptState {
	items: ReceiptItem[];
	isScanning: boolean;
	setItems: (items: ReceiptItem[]) => void;
	addItem: (item: ReceiptItem) => void;
	assignItem: (itemId: string, userId: string) => void;
	reset: () => void;
}

export const useReceiptStore = create<ReceiptState>((set) => ({
	items: [],
	isScanning: false,
	setItems: (items) => set({ items }),
	addItem: (item) => set((state) => ({ items: [...state.items, item] })),
	assignItem: (itemId, userId) =>
		set((state) => ({
			items: state.items.map((item) =>
				item.id === itemId
					? {
							...item,
							assignedTo: item.assignedTo.includes(userId)
								? item.assignedTo.filter((id) => id !== userId)
								: [...item.assignedTo, userId],
					  }
					: item
			),
		})),
	reset: () => set({ items: [], isScanning: false }),
}));
