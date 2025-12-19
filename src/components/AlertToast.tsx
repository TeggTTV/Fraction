'use client';

import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertToastProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	message: string;
	variant?: 'error' | 'success' | 'info';
}

export default function AlertToast({
	isOpen,
	onClose,
	title,
	message,
	variant = 'error',
}: AlertToastProps) {
	const configs = {
		error: {
			icon: AlertCircle,
			bg: 'bg-red-50',
			border: 'border-red-200',
			iconColor: 'text-red-500',
			textColor: 'text-red-900',
		},
		success: {
			icon: CheckCircle,
			bg: 'bg-emerald-50',
			border: 'border-emerald-200',
			iconColor: 'text-emerald-500',
			textColor: 'text-emerald-900',
		},
		info: {
			icon: Info,
			bg: 'bg-blue-50',
			border: 'border-blue-200',
			iconColor: 'text-blue-500',
			textColor: 'text-blue-900',
		},
	};

	const config = configs[variant];
	const Icon = config.icon;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
				>
					<div
						className={`${config.bg} ${config.border} border rounded-2xl shadow-lg overflow-hidden`}
					>
						<div className="flex items-start gap-3 p-4">
							<Icon
								size={24}
								className={`${config.iconColor} shrink-0 mt-0.5`}
							/>
							<div className="flex-1 min-w-0">
								{title && (
									<h4
										className={`font-bold text-sm ${config.textColor}`}
									>
										{title}
									</h4>
								)}
								<p
									className={`text-sm ${config.textColor} ${
										title ? 'mt-1' : ''
									}`}
								>
									{message}
								</p>
							</div>
							<button
								onClick={onClose}
								className={`shrink-0 p-1 rounded-lg hover:bg-black/10 ${config.iconColor}`}
							>
								<X size={18} />
							</button>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
