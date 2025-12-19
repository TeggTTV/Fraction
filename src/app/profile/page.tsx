import { auth, signOut } from '@/auth';
import Image from 'next/image';
import AuthPage from '@/components/AuthPage';

export default async function ProfilePage() {
	const session = await auth();

	if (!session?.user) {
		return <AuthPage />;
	}

	return (
		<div className="flex h-full flex-col bg-white px-4 pt-4">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-3xl font-extrabold text-text-primary">
					Profile
				</h1>
			</div>

			<div className="flex flex-col items-center gap-4 py-8">
				{session.user.image ? (
					<Image
						src={session.user.image}
						alt="Avatar"
						width={96}
						height={96}
						className="h-24 w-24 rounded-full border-4 border-white shadow-xl"
					/>
				) : (
					<div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-primary text-3xl font-bold text-white shadow-xl">
						{session.user.name?.[0] || 'U'}
					</div>
				)}
				<div className="text-center">
					<h2 className="text-xl font-bold text-text-primary">
						{session.user.name}
					</h2>
					<p className="text-text-secondary">{session.user.email}</p>
				</div>
			</div>

			<div className="space-y-2">
				<div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
					<h3 className="mb-2 font-bold text-text-primary">
						Account
					</h3>
					<div className="flex items-center justify-between py-2">
						<span className="text-sm font-medium text-text-secondary">
							Email
						</span>
						<span className="text-sm text-text-primary">
							{session.user.email}
						</span>
					</div>
					<div className="flex items-center justify-between py-2 border-t border-slate-200">
						<span className="text-sm font-medium text-text-secondary">
							ID
						</span>
						<span className="text-xs text-text-primary truncate max-w-[150px]">
							{session.user.id}
						</span>
					</div>
				</div>

				<div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
					<h3 className="mb-2 font-bold text-text-primary">
						Preferences
					</h3>
					<div className="flex items-center justify-between py-2">
						<span className="text-sm font-medium text-text-secondary">
							Notifications
						</span>
						<div className="h-6 w-10 rounded-full bg-brand-primary p-1">
							<div className="h-4 w-4 rounded-full bg-white shadow-sm translate-x-4 transition-transform" />
						</div>
					</div>
				</div>

				<form
					action={async () => {
						'use server';
						await signOut();
					}}
				>
					<button className="mt-8 w-full rounded-2xl bg-white border-2 border-slate-100 py-3 font-bold text-red-500 hover:bg-red-50 transition-colors">
						Log Out
					</button>
				</form>
			</div>
		</div>
	);
}
