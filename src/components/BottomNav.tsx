'use client';

import Link from 'next/link';
import { Home, Users, User, ScanLine, Plus, LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItemProps {
	href: string;
	icon: LucideIcon;
	label: string;
	active: boolean;
}

function NavItem({ href, icon: Icon, label, active }: NavItemProps) {
	return (
		<Link
			href={href}
			className={cn(
				'flex flex-col items-center justify-center gap-1 transition-colors duration-200',
				active
					? 'text-brand-primary'
					: 'text-text-secondary hover:text-text-primary'
			)}
		>
			<Icon size={24} strokeWidth={active ? 2.5 : 2} />
			<span className="text-[10px] font-medium">{label}</span>
		</Link>
	);
}

export function BottomNav() {
	const pathname = usePathname();

	// Hide BottomNav on immersive pages
	if (pathname?.includes('/scan') || pathname?.endsWith('/settle')) {
		return null;
	}

	return (
		<div className="absolute bottom-0 left-0 z-40 w-full px-4 pb-6 pt-2">
			{/* Floating Glass Bar */}
			<div className="glass-panel flex h-16 w-full items-center justify-around rounded-3xl border border-white/20 shadow-lg shadow-black/5">
				<NavItem
					href="/"
					icon={Home}
					label="Home"
					active={
						pathname === '/' ||
						(pathname?.startsWith('/activity') ?? false)
					}
				/>

				<NavItem
					href="/groups"
					icon={Users}
					label="Groups"
					active={pathname?.startsWith('/groups') ?? false}
				/>

				{/* Floating Action Button (Scan) */}
				<div className="relative -top-6">
					<Link href="/scan">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary text-white shadow-xl shadow-brand-primary/40 transition-transform active:scale-95">
							<ScanLine size={28} strokeWidth={2.5} />
						</div>
					</Link>
				</div>

				<NavItem
					href="/friends"
					icon={Plus} // Placeholder for Friends/Add
					label="Friends"
					active={pathname?.startsWith('/friends') ?? false}
				/>

				<NavItem
					href="/profile"
					icon={User}
					label="Profile"
					active={pathname?.startsWith('/profile') ?? false}
				/>
			</div>
		</div>
	);
}
