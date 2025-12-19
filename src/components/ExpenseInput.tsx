'use client';

import { useState } from 'react';
import { Receipt, Send, Loader2, Plus, X } from 'lucide-react';
import { createExpense } from '@/app/actions';
import AlertToast from './AlertToast';

export default function ExpenseInput({ groupId }: { groupId: string }) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [description, setDescription] = useState('');
	const [amount, setAmount] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!description || !amount) return;

		setIsSubmitting(true);
		try {
			const result = await createExpense(
				groupId,
				description,
				parseFloat(amount)
			);
			if (result.success) {
				setDescription('');
				setAmount('');
				setIsExpanded(false);
			} else {
				setErrorMessage(result.message || 'Failed to create expense');
				setShowError(true);
			}
		} catch (error) {
			console.error('Failed to create expense', error);
			setErrorMessage('Something went wrong');
			setShowError(true);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isExpanded) {
		return (
			<>
				<AlertToast
					isOpen={showError}
					onClose={() => setShowError(false)}
					message={errorMessage}
					variant="error"
				/>
				<div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 pb-8 shadow-2xl rounded-t-3xl animate-in slide-in-from-bottom-10 fade-in duration-200">
					<div className="flex justify-between items-center mb-4">
						<h3 className="font-bold text-lg">New Expense</h3>
						<button
							onClick={() => setIsExpanded(false)}
							className="p-1 bg-slate-100 rounded-full"
						>
							<X size={20} />
						</button>
					</div>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<input
								type="text"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="What is it for? (e.g. Dinner)"
								className="w-full text-lg border-b border-slate-200 py-2 outline-none focus:border-brand-primary font-medium"
								autoFocus
							/>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-2xl font-bold text-slate-400">
								$
							</span>
							<input
								type="number"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								placeholder="0.00"
								step="0.01"
								className="w-full text-3xl font-bold border-b border-slate-200 py-2 outline-none focus:border-brand-primary"
							/>
						</div>
						<button
							type="submit"
							disabled={isSubmitting || !description || !amount}
							className="w-full bg-brand-primary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-all"
						>
							{isSubmitting ? (
								<Loader2 className="animate-spin" />
							) : (
								'Add Expense'
							)}
						</button>
					</form>
				</div>
			</>
		);
	}

	return (
		<div className="sticky bottom-0 bg-white p-3 border-t border-slate-100 pb-8">
			<div className="flex items-center gap-2">
				<button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform active:scale-95">
					<Receipt size={20} />
				</button>

				<button
					onClick={() => setIsExpanded(true)}
					className="flex-1 text-left rounded-full bg-slate-100 px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-200 transition-colors"
				>
					Add an expense...
				</button>

				<button
					onClick={() => setIsExpanded(true)}
					className="p-2 text-brand-primary bg-brand-primary/10 rounded-full"
				>
					<Plus size={24} />
				</button>
			</div>
		</div>
	);
}
