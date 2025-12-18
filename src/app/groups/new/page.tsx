'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Home, Plane, Users, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const GROUP_TYPES = [
	{ id: 'house', label: 'House', icon: Home, color: 'bg-indigo-500' },
	{ id: 'trip', label: 'Trip', icon: Plane, color: 'bg-teal-500' },
	{ id: 'friends', label: 'Friends', icon: Users, color: 'bg-orange-500' },
	{ id: 'other', label: 'Other', icon: Users, color: 'bg-slate-500' },
];

export default function NewGroupPage() {
	const router = useRouter();
	const [name, setName] = useState('');
	const [selectedType, setSelectedType] = useState('house');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// In a real app, this would hit an API
		alert(`Created group: ${name} (${selectedType})`);
		router.push('/groups');
	};

	return (
		<div className="flex h-full flex-col bg-white">
			{/* Header */}
			<div className="flex items-center gap-4 border-b border-slate-100 p-4">
				<button
					onClick={() => router.back()}
					className="rounded-full p-2 hover:bg-slate-100"
				>
					<ChevronLeft size={24} />
				</button>
				<h1 className="text-xl font-bold text-text-primary">
					New Group
				</h1>
			</div>

			<form onSubmit={handleSubmit} className="flex-1 space-y-8 p-6">
				{/* Name Input */}
				<div className="space-y-2">
					<label className="text-sm font-bold text-text-secondary uppercase tracking-wider">
						Group Name
					</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="e.g. Summer Trip 2024"
						className="w-full border-b-2 border-slate-200 bg-transparent py-2 text-2xl font-bold text-text-primary placeholder:text-slate-300 focus:border-brand-primary focus:outline-none"
						autoFocus
					/>
				</div>

				{/* Type Selection */}
				<div className="space-y-4">
					<label className="text-sm font-bold text-text-secondary uppercase tracking-wider">
						Type
					</label>
					<div className="grid grid-cols-2 gap-3">
						{GROUP_TYPES.map((type) => {
							const Icon = type.icon;
							const isSelected = selectedType === type.id;
							return (
								<button
									key={type.id}
									type="button"
									onClick={() => setSelectedType(type.id)}
									className={cn(
										'flex items-center gap-3 rounded-2xl border p-4 transition-all',
										isSelected
											? 'border-brand-primary bg-blue-50/50 ring-1 ring-brand-primary'
											: 'border-slate-200 hover:border-slate-300'
									)}
								>
									<div
										className={cn(
											'flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm',
											type.color
										)}
									>
										<Icon size={20} />
									</div>
									<span
										className={cn(
											'font-bold',
											isSelected
												? 'text-text-primary'
												: 'text-text-secondary'
										)}
									>
										{type.label}
									</span>
									{isSelected && (
										<Check
											size={18}
											className="ml-auto text-brand-primary"
										/>
									)}
								</button>
							);
						})}
					</div>
				</div>

				{/* Action */}
				<div className="pt-8">
					<button
						type="submit"
						disabled={!name.trim()}
						className="w-full rounded-2xl bg-brand-primary py-4 text-lg font-bold text-white shadow-lg shadow-brand-primary/30 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
					>
						Create Group
					</button>
				</div>
			</form>
		</div>
	);
}
