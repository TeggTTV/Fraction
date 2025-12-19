import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MobileContainer } from '@/components/MobileContainer';
import { BottomNav } from '@/components/BottomNav';

const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-inter',
	weight: ['300', '400', '500', '600', '700', '800', '900'],
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
			<body className={`${inter.className} antialiased`}>
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
