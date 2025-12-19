'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedPageProps {
	children: ReactNode;
}

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const item = {
	hidden: { y: 20, opacity: 0 },
	show: { y: 0, opacity: 1 },
};

export function AnimatedPage({ children }: AnimatedPageProps) {
	return (
		<motion.div
			initial="hidden"
			animate="show"
			variants={container}
			className="h-full"
		>
			{children}
		</motion.div>
	);
}

export function AnimatedItem({ children }: AnimatedPageProps) {
	return <motion.div variants={item}>{children}</motion.div>;
}

export function FadeIn({
	children,
	delay = 0,
}: AnimatedPageProps & { delay?: number }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay, duration: 0.4 }}
		>
			{children}
		</motion.div>
	);
}

export function SlideIn({
	children,
	delay = 0,
	direction = 'up',
}: AnimatedPageProps & {
	delay?: number;
	direction?: 'up' | 'down' | 'left' | 'right';
}) {
	const directions = {
		up: { y: 20 },
		down: { y: -20 },
		left: { x: 20 },
		right: { x: -20 },
	};

	return (
		<motion.div
			initial={{ opacity: 0, ...directions[direction] }}
			animate={{ opacity: 1, x: 0, y: 0 }}
			transition={{ delay, duration: 0.5, type: 'spring', damping: 20 }}
		>
			{children}
		</motion.div>
	);
}

export { container, item };
