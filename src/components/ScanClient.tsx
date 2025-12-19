'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, X, ArrowLeft, Plus, Trash2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createExpense } from '@/app/actions';

interface Group {
	id: string;
	name: string;
	type: string;
}

interface ReceiptItem {
	description: string;
	amount: number;
}

export default function ScanClient({ groups }: { groups: Group[] }) {
	const router = useRouter();
	const videoRef = useRef<HTMLVideoElement>(null);

	const [mode, setMode] = useState<'choice' | 'camera' | 'manual'>('choice');
	const [isCameraActive, setIsCameraActive] = useState(false);
	const [error, setError] = useState<string>('');

	// Manual entry state
	const [items, setItems] = useState<ReceiptItem[]>([
		{ description: '', amount: 0 },
	]);
	const [selectedGroup, setSelectedGroup] = useState<string>('');
	const [isSaving, setIsSaving] = useState(false);

	// Start camera
	const startCamera = async () => {
		try {
			setError('');
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: 'environment',
					width: { ideal: 1280 },
					height: { ideal: 720 },
				},
			});

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				await videoRef.current.play();
				setIsCameraActive(true);
				setMode('camera');
			}
		} catch (err) {
			console.error('Camera error:', err);
			setError(
				'Unable to access camera. Please check permissions or try manual entry.'
			);
			setMode('choice');
		}
	};

	// Stop camera
	const stopCamera = () => {
		if (videoRef.current && videoRef.current.srcObject) {
			const stream = videoRef.current.srcObject as MediaStream;
			stream.getTracks().forEach((track) => track.stop());
			videoRef.current.srcObject = null;
		}
		setIsCameraActive(false);
	};

	// Add item to manual entry
	const addItem = () => {
		setItems([...items, { description: '', amount: 0 }]);
	};

	// Remove item
	const removeItem = (index: number) => {
		if (items.length > 1) {
			setItems(items.filter((_, i) => i !== index));
		}
	};

	// Update item
	const updateItem = (
		index: number,
		field: 'description' | 'amount',
		value: string | number
	) => {
		const newItems = [...items];
		newItems[index][field] = value as never;
		setItems(newItems);
	};

	// Calculate total
	const total = items.reduce(
		(sum, item) => sum + (Number(item.amount) || 0),
		0
	);

	// Save expense
	const saveExpense = async () => {
		if (!selectedGroup) {
			alert('Please select a group');
			return;
		}

		const validItems = items.filter(
			(item) => item.description && item.amount > 0
		);
		if (validItems.length === 0) {
			alert('Please add at least one valid item');
			return;
		}

		setIsSaving(true);

		try {
			// Create one expense for all items combined
			const description = validItems
				.map((item) => item.description)
				.join(', ');

			const result = await createExpense(
				selectedGroup,
				description,
				total
			);

			if (result.success) {
				router.push(`/groups/${selectedGroup}`);
			} else {
				alert(result.message || 'Failed to create expense');
			}
		} catch (error) {
			console.error('Save error:', error);
			alert('Failed to save expense');
		} finally {
			setIsSaving(false);
		}
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			stopCamera();
		};
	}, []);

	return (
		<div className="relative h-full bg-[#f2f4f7] flex flex-col">
			{/* Header */}
			<header className="relative z-10 flex items-center gap-3 bg-white px-4 py-4 shadow-sm">
				<button
					onClick={() => {
						stopCamera();
						router.back();
					}}
					className="rounded-full p-2 hover:bg-slate-100 transition-colors"
				>
					<ArrowLeft size={24} className="text-text-primary" />
				</button>
				<h1 className="text-lg font-bold text-text-primary">
					{mode === 'manual' ? 'Manual Entry' : 'Scan Receipt'}
				</h1>
			</header>

			<AnimatePresence mode="wait">
				{/* Choice Screen */}
				{mode === 'choice' && (
					<motion.div
						key="choice"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="flex-1 flex items-center justify-center p-6"
					>
						<div className="w-full max-w-md space-y-4">
							{error && (
								<div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
									<p className="text-sm text-red-800">
										{error}
									</p>
								</div>
							)}

							<div className="text-center mb-8">
								<h2 className="text-2xl font-bold text-text-primary mb-2">
									Add Expense
								</h2>
								<p className="text-text-secondary">
									Choose how you'd like to add your expense
								</p>
							</div>

							<button
								onClick={startCamera}
								className="w-full bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-brand-primary hover:bg-blue-50 transition-all active:scale-[0.98] group"
							>
								<Camera
									size={48}
									className="text-brand-primary mx-auto mb-3"
								/>
								<h3 className="font-bold text-text-primary mb-1">
									Scan Receipt
								</h3>
								<p className="text-sm text-text-secondary">
									Use your camera to capture a receipt
								</p>
							</button>

							<button
								onClick={() => setMode('manual')}
								className="w-full bg-brand-primary text-white rounded-2xl p-6 hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg"
							>
								<Plus size={48} className="mx-auto mb-3" />
								<h3 className="font-bold mb-1">Manual Entry</h3>
								<p className="text-sm text-white/90">
									Type in items and amounts manually
								</p>
							</button>
						</div>
					</motion.div>
				)}

				{/* Camera View */}
				{mode === 'camera' && (
					<motion.div
						key="camera"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="flex-1 relative bg-black"
					>
						{isCameraActive ? (
							<>
								<video
									ref={videoRef}
									autoPlay
									playsInline
									muted
									className="w-full h-full object-cover"
								/>

								{/* Frame guide */}
								<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
									<div className="border-4 border-white/50 rounded-2xl w-[85%] h-[60%] shadow-2xl relative">
										<div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-brand-primary rounded-tl" />
										<div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-brand-primary rounded-tr" />
										<div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-brand-primary rounded-bl" />
										<div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-brand-primary rounded-br" />
									</div>
								</div>

								{/* Info text */}
								<div className="absolute top-20 left-0 right-0 text-center">
									<div className="inline-block bg-black/60 backdrop-blur-sm px-6 py-3 rounded-full">
										<p className="text-white text-sm font-medium">
											Camera scanning coming soon! Use
											Manual Entry for now.
										</p>
									</div>
								</div>

								{/* Back to options button */}
								<div className="absolute bottom-8 left-0 right-0 flex justify-center">
									<button
										onClick={() => {
											stopCamera();
											setMode('choice');
										}}
										className="bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-gray-100 active:scale-95 transition-all shadow-lg"
									>
										Use Manual Entry Instead
									</button>
								</div>
							</>
						) : (
							<div className="flex items-center justify-center h-full">
								<div className="text-white text-center">
									<p>Starting camera...</p>
								</div>
							</div>
						)}
					</motion.div>
				)}

				{/* Manual Entry */}
				{mode === 'manual' && (
					<motion.div
						key="manual"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="flex-1 overflow-y-auto p-4 pb-32"
					>
						{/* Group selection */}
						<div className="mb-6">
							<label className="block text-sm font-bold text-text-primary mb-2">
								Select Group
							</label>
							<select
								value={selectedGroup}
								onChange={(e) =>
									setSelectedGroup(e.target.value)
								}
								className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-brand-primary transition-colors bg-white"
							>
								<option value="">Choose a group...</option>
								{groups.map((group) => (
									<option key={group.id} value={group.id}>
										{group.name}
									</option>
								))}
							</select>
						</div>

						{/* Items */}
						<div className="mb-6">
							<div className="flex items-center justify-between mb-3">
								<label className="text-sm font-bold text-text-primary">
									Items
								</label>
								<button
									onClick={addItem}
									className="flex items-center gap-1 text-sm font-medium text-brand-primary hover:text-blue-700"
								>
									<Plus size={16} />
									Add Item
								</button>
							</div>

							<div className="space-y-3">
								{items.map((item, index) => (
									<div
										key={index}
										className="bg-white rounded-xl p-4 border border-slate-200"
									>
										<div className="flex gap-3 mb-3">
											<input
												type="text"
												placeholder="Item description"
												value={item.description}
												onChange={(e) =>
													updateItem(
														index,
														'description',
														e.target.value
													)
												}
												className="flex-1 px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-brand-primary transition-colors"
											/>
											{items.length > 1 && (
												<button
													onClick={() =>
														removeItem(index)
													}
													className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
												>
													<Trash2 size={20} />
												</button>
											)}
										</div>
										<div className="relative">
											<span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
												$
											</span>
											<input
												type="number"
												step="0.01"
												min="0"
												placeholder="0.00"
												value={item.amount || ''}
												onChange={(e) =>
													updateItem(
														index,
														'amount',
														parseFloat(
															e.target.value
														) || 0
													)
												}
												className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-brand-primary transition-colors"
											/>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Total */}
						<div className="bg-gradient-to-r from-brand-primary to-blue-700 rounded-2xl p-6 text-white mb-6">
							<p className="text-sm opacity-90 mb-1">
								Total Amount
							</p>
							<p className="text-3xl font-bold">
								${total.toFixed(2)}
							</p>
						</div>

						{/* Save button */}
						<button
							onClick={saveExpense}
							disabled={isSaving || !selectedGroup || total === 0}
							className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{isSaving ? (
								<>
									<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Check size={20} />
									Save Expense
								</>
							)}
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
