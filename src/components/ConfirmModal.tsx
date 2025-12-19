'use client';

import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	variant?: 'danger' | 'warning' | 'info' | 'success';
}

export default function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	variant = 'warning',
}: ConfirmModalProps) {
	const icons = {
		danger: XCircle,
		warning: AlertTriangle,
		info: Info,
		success: CheckCircle,
	};

	const colors = {
		danger: {
			iconBg: 'bg-red-100',
			icon: 'text-red-500',
			button: 'bg-red-600 hover:bg-red-700 active:bg-red-800',
		},
		warning: {
			iconBg: 'bg-orange-100',
			icon: 'text-orange-500',
			button: 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800',
		},
		info: {
			iconBg: 'bg-blue-100',
			icon: 'text-blue-500',
			button: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
		},
		success: {
			iconBg: 'bg-emerald-100',
			icon: 'text-emerald-500',
			button: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800',
		},
	};

	const Icon = icons[variant];
	const colorScheme = colors[variant];

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="absolute inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute top-0 inset-0 bg-black/50 backdrop-blur-sm h-screen"
					/>

					{/* Modal */}
					<motion.div
						initial={{ scale: 0.95, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.95, opacity: 0, y: 20 }}
						transition={{ type: 'spring', duration: 0.3 }}
						className="relative top-[200px] bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
					>
						{/* Icon */}
						<div className="flex justify-center pt-8 pb-6">
							<div
								className={`rounded-full p-4 ${colorScheme.iconBg}`}
							>
								<Icon
									size={40}
									className={colorScheme.icon}
									strokeWidth={2.5}
								/>
							</div>
						</div>

						{/* Content */}
						<div className="px-6 pb-6 text-center">
							<h3 className="text-xl font-bold text-text-primary mb-3">
								{title}
							</h3>
							<p className="text-sm text-text-secondary leading-relaxed">
								{message}
							</p>
						</div>

						{/* Actions */}
						<div className="flex gap-3 p-6 pt-0 pb-8">
							<button
								onClick={onClose}
								className="flex-1 py-3.5 px-4 rounded-xl bg-slate-100 text-text-primary font-bold hover:bg-slate-200 active:bg-slate-300 transition-colors"
							>
								{cancelText}
							</button>
							<button
								onClick={() => {
									onConfirm();
									onClose();
								}}
								className={`flex-1 py-3.5 px-4 rounded-xl text-white font-bold transition-all active:scale-95 ${colorScheme.button}`}
							>
								{confirmText}
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
