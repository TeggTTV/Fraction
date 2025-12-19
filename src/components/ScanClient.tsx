'use client';

import { useState } from 'react';
import { Camera, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Group {
	id: string;
	name: string;
	type: string;
}

export default function ScanClient({ groups }: { groups: Group[] }) {
	const router = useRouter();
	const [isProcessing, setIsProcessing] = useState(false);

	const handleScan = () => {
		setIsProcessing(true);
		// Placeholder for future OCR implementation
		setTimeout(() => {
			alert('Receipt scanning feature coming soon!');
			setIsProcessing(false);
		}, 1000);
	};

	return (
		<div className="flex h-full flex-col bg-[#0a0a0a]">
			{/* Header */}
			<header className="flex items-center gap-3 p-4">
				<button
					onClick={() => router.back()}
					className="rounded-full p-2 hover:bg-white/10 transition-colors"
				>
					<ArrowLeft size={24} className="text-white" />
				</button>
				<h1 className="text-lg font-bold text-white">Scan Receipt</h1>
			</header>

			{/* Camera View */}
			<div className="flex-1 flex items-center justify-center">
				<div className="text-center">
					<div className="mb-6 rounded-full bg-white/10 p-8 inline-block">
						<Camera size={64} className="text-white" />
					</div>
					<h2 className="text-xl font-bold text-white mb-2">
						Camera Access Required
					</h2>
					<p className="text-white/60 mb-6">
						This feature will allow you to scan receipts
					</p>
					<button
						onClick={handleScan}
						disabled={isProcessing}
						className="bg-brand-primary text-white font-bold py-4 px-8 rounded-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
					>
						{isProcessing ? 'Processing...' : 'Test Scan'}
					</button>
				</div>
			</div>
		</div>
	);
}
