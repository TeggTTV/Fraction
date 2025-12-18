'use client';

import { useState } from 'react';
import { useReceiptStore, ReceiptItem } from '@/store/receiptStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MOCK_ITEMS: ReceiptItem[] = [
	{ id: '1', name: 'Avocados (3)', price: 5.99, assignedTo: [] },
	{ id: '2', name: 'Sourdough Bread', price: 4.5, assignedTo: [] },
	{ id: '3', name: 'Oat Milk', price: 3.29, assignedTo: [] },
	{ id: '4', name: 'Craft Beer 6pk', price: 12.99, assignedTo: [] },
	{ id: '5', name: 'Hot Sauce', price: 6.5, assignedTo: [] },
];

export default function ScanPage() {
	const router = useRouter();
	const { setItems, items, assignItem } = useReceiptStore();
	const [step, setStep] = useState<'camera' | 'scanning' | 'results'>(
		'camera'
	);

	// Camera Simulation
	const handleCapture = () => {
		setStep('scanning');
		// Simulate OCR processing time
		setTimeout(() => {
			setItems(MOCK_ITEMS);
			setStep('results');
		}, 2500);
	};

	return (
		<div className="relative h-full w-full bg-black text-white">
			<AnimatePresence mode="wait">
				{/* Step 1: Camera View */}
				{step === 'camera' && (
					<motion.div
						key="camera"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="flex h-full flex-col items-center justify-between p-6 pt-12"
					>
						<div className="flex w-full justify-between">
							<button onClick={() => router.back()}>
								<X size={28} />
							</button>
							<Zap size={28} className="text-yellow-400" />
						</div>

						{/* Viewfinder */}
						<div className="relative aspect-[3/4] w-full max-w-sm rounded-[32px] border-2 border-white/20 bg-zinc-900/50 overflow-hidden">
							<div className="absolute inset-0 flex items-center justify-center">
								<p className="text-zinc-500 font-medium">
									Point Camera at Receipt
								</p>
							</div>
							{/* Simulated Camera Feed Texture */}
							<div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />

							{/* Corner Markers */}
							<div className="absolute top-6 left-6 w-8 h-8 border-l-4 border-t-4 border-brand-primary rounded-tl-lg" />
							<div className="absolute top-6 right-6 w-8 h-8 border-r-4 border-t-4 border-brand-primary rounded-tr-lg" />
							<div className="absolute bottom-6 left-6 w-8 h-8 border-l-4 border-b-4 border-brand-primary rounded-bl-lg" />
							<div className="absolute bottom-6 right-6 w-8 h-8 border-r-4 border-b-4 border-brand-primary rounded-br-lg" />
						</div>

						<button
							onClick={handleCapture}
							className="group relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-transparent transition-all active:scale-95"
						>
							<div className="h-16 w-16 rounded-full bg-white transition-all group-hover:bg-brand-primary" />
						</button>
					</motion.div>
				)}

				{/* Step 2: Scanning Animation */}
				{step === 'scanning' && (
					<motion.div
						key="scanning"
						className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<p className="mb-8 text-lg font-semibold tracking-widest text-brand-primary">
							PROCESSING...
						</p>
						<div className="relative h-64 w-64 rounded-xl border border-white/10 bg-zinc-900 p-4">
							{/* Mock Content */}
							<div className="space-y-2 opacity-50 blur-[2px]">
								<div className="h-4 w-3/4 rounded bg-zinc-700" />
								<div className="h-4 w-1/2 rounded bg-zinc-700" />
								<div className="h-4 w-full rounded bg-zinc-700" />
							</div>
							{/* Laser Line */}
							<motion.div
								className="absolute left-0 top-0 h-1 w-full bg-brand-primary shadow-[0_0_20px_rgba(59,130,246,0.8)]"
								animate={{ top: ['0%', '100%', '0%'] }}
								transition={{
									duration: 1.5,
									repeat: Infinity,
									ease: 'linear',
								}}
							/>
						</div>
					</motion.div>
				)}

				{/* Step 3: Simulation Results */}
				{step === 'results' && (
					<motion.div
						key="results"
						initial={{ y: '100%' }}
						animate={{ y: 0 }}
						className="flex h-full flex-col bg-background text-foreground"
					>
						<div className="flex items-center justify-between p-6 pb-2">
							<h2 className="text-2xl font-bold">Itemize</h2>
							<button
								className="text-brand-primary font-medium"
								onClick={() => router.push('/')}
							>
								Done
							</button>
						</div>

						<div className="px-6 py-2">
							<p className="text-sm text-text-muted">
								Tap items to claim them.
							</p>
						</div>

						<div className="flex-1 overflow-y-auto p-4 space-y-3">
							{items.map((item) => {
								const isSelected =
									item.assignedTo.includes('me'); // Mock User ID
								return (
									<motion.div
										key={item.id}
										layout
										onClick={() =>
											assignItem(item.id, 'me')
										}
										className={`flex items-center justify-between rounded-xl border p-4 transition-all active:scale-98 ${
											isSelected
												? 'border-brand-primary bg-brand-primary/10'
												: 'border-zinc-200 bg-white'
										}`}
									>
										<div>
											<p className="font-semibold text-text-primary">
												{item.name}
											</p>
										</div>
										<div className="flex items-center gap-3">
											<p className="font-bold text-text-primary">
												${item.price.toFixed(2)}
											</p>
											<div
												className={`flex h-6 w-6 items-center justify-center rounded-full border ${
													isSelected
														? 'bg-brand-primary border-brand-primary text-white'
														: 'border-zinc-300'
												}`}
											>
												{isSelected && (
													<Check size={14} />
												)}
											</div>
										</div>
									</motion.div>
								);
							})}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
