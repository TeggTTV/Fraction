import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { MobileContainer } from '@/components/MobileContainer';
import { BottomNav } from '@/components/BottomNav';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Fraction',
	description: 'The Social Finance Layer for Students',
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<MobileContainer>
					<div className="flex-1 h-full w-full overflow-y-auto no-scrollbar pb-24">
						{children}
					</div>
					<BottomNav />
				</MobileContainer>
			</body>
		</html>
	);
}
