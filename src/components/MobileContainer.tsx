'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileContainerProps {
	children: ReactNode;
	className?: string;
}

export function MobileContainer({ children, className }: MobileContainerProps) {
	return (
		<div className="flex h-screen w-full items-center justify-center bg-zinc-950 p-0 sm:p-4">
			{/* Mobile Frame Container */}
			<main
				className={cn(
					'relative flex h-full w-full flex-col overflow-hidden bg-background sm:h-[850px] sm:max-h-[90vh] sm:w-[400px] sm:rounded-[40px] sm:border-[8px] sm:border-zinc-900 sm:shadow-2xl',
					className
				)}
			>
				{/* iOS Status Bar Placeholder for Desktop Aesthetics */}
				<div className="hidden h-7 w-full items-center justify-between px-6 pt-2 opacity-0 sm:flex">
					{/* Space for status bar if we want to fake it later */}
				</div>

				{/* Dynamic Island Area (Desktop Only Aesthetic) */}
				<div className="absolute left-1/2 top-2 z-50 hidden h-[28px] w-[100px] -translate-x-1/2 rounded-full bg-black sm:block" />

				{children}
			</main>
		</div>
	);
}
