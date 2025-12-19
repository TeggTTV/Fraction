'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	LogIn,
	UserPlus,
	Loader2,
	Mail,
	Lock,
	User,
	Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signUpUser, loginUser } from '@/app/actions';
import AlertToast from './AlertToast';

export default function AuthPage() {
	const router = useRouter();
	const [mode, setMode] = useState<'login' | 'signup'>('login');
	const [isLoading, setIsLoading] = useState(false);
	const [isGoogleLoading, setIsGoogleLoading] = useState(false);
	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	// Login state
	const [loginEmail, setLoginEmail] = useState('');
	const [loginPassword, setLoginPassword] = useState('');

	// Signup state
	const [signupUsername, setSignupUsername] = useState('');
	const [signupEmail, setSignupEmail] = useState('');
	const [signupPassword, setSignupPassword] = useState('');
	const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
	const [receiveUpdates, setReceiveUpdates] = useState(false);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const result = await loginUser(loginEmail, loginPassword);
			if (result.success) {
				router.push('/');
				router.refresh();
			} else {
				setErrorMessage(result.message || 'Failed to log in');
				setShowError(true);
			}
		} catch (error) {
			console.error('Login error:', error);
			setErrorMessage('Something went wrong');
			setShowError(true);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();

		if (signupPassword !== signupConfirmPassword) {
			setErrorMessage('Passwords do not match');
			setShowError(true);
			return;
		}

		if (signupPassword.length < 6) {
			setErrorMessage('Password must be at least 6 characters');
			setShowError(true);
			return;
		}

		setIsLoading(true);

		try {
			const result = await signUpUser(
				signupUsername,
				signupEmail,
				signupPassword,
				receiveUpdates
			);

			if (result.success) {
				router.push('/');
				router.refresh();
			} else {
				setErrorMessage(result.message || 'Failed to create account');
				setShowError(true);
			}
		} catch (error) {
			console.error('Signup error:', error);
			setErrorMessage('Something went wrong');
			setShowError(true);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setIsGoogleLoading(true);
		window.location.href = '/api/auth/signin/google';
	};

	return (
		<div className="flex h-full flex-col bg-[#f2f4f7] px-4 pt-8 pb-28 overflow-y-auto">
			{/* Header */}
			<div className="mb-4 text-center">
				<h1 className="text-3xl font-extrabold text-text-primary mb-1">
					Welcome to Fraction
				</h1>
				<p className="text-sm text-text-secondary">
					Split expenses with friends, easily.
				</p>
			</div>

			{/* Tab Switcher */}
			<div className="mb-4 flex gap-2 bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
				<button
					onClick={() => setMode('login')}
					className={cn(
						'flex-1 py-3 px-4 rounded-xl font-bold transition-all',
						mode === 'login'
							? 'bg-brand-primary text-white shadow-md'
							: 'text-text-secondary hover:text-text-primary'
					)}
				>
					<LogIn size={18} className="inline mr-2" />
					Log In
				</button>
				<button
					onClick={() => setMode('signup')}
					className={cn(
						'flex-1 py-3 px-4 rounded-xl font-bold transition-all',
						mode === 'signup'
							? 'bg-brand-primary text-white shadow-md'
							: 'text-text-secondary hover:text-text-primary'
					)}
				>
					<UserPlus size={18} className="inline mr-2" />
					Sign Up
				</button>
			</div>

			{/* Forms */}
			<div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-5">
				{mode === 'login' ? (
					<form onSubmit={handleLogin} className="space-y-3">
						<h2 className="text-lg font-bold text-text-primary mb-3">
							Log in to your account
						</h2>

						{/* Email */}
						<div>
							<label className="block text-sm font-bold text-text-secondary mb-2">
								Email
							</label>
							<div className="relative">
								<Mail
									size={20}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
								/>
								<input
									type="email"
									value={loginEmail}
									onChange={(e) =>
										setLoginEmail(e.target.value)
									}
									placeholder="you@example.com"
									required
									className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-brand-primary transition-colors"
								/>
							</div>
						</div>

						{/* Password */}
						<div>
							<label className="block text-sm font-bold text-text-secondary mb-2">
								Password
							</label>
							<div className="relative">
								<Lock
									size={20}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
								/>
								<input
									type="password"
									value={loginPassword}
									onChange={(e) =>
										setLoginPassword(e.target.value)
									}
									placeholder="••••••••"
									required
									className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-brand-primary transition-colors"
								/>
							</div>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
						>
							{isLoading ? (
								<>
									<Loader2
										className="animate-spin"
										size={20}
									/>
									Logging in...
								</>
							) : (
								'Log In'
							)}
						</button>
					</form>
				) : (
					<form onSubmit={handleSignup} className="space-y-3">
						<h2 className="text-lg font-bold text-text-primary mb-3">
							Create your account
						</h2>

						{/* Username */}
						<div>
							<label className="block text-sm font-bold text-text-secondary mb-2">
								Username
							</label>
							<div className="relative">
								<User
									size={20}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
								/>
								<input
									type="text"
									value={signupUsername}
									onChange={(e) =>
										setSignupUsername(e.target.value)
									}
									placeholder="johndoe"
									required
									className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-brand-primary transition-colors"
								/>
							</div>
						</div>

						{/* Email */}
						<div>
							<label className="block text-sm font-bold text-text-secondary mb-2">
								Email
							</label>
							<div className="relative">
								<Mail
									size={20}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
								/>
								<input
									type="email"
									value={signupEmail}
									onChange={(e) =>
										setSignupEmail(e.target.value)
									}
									placeholder="you@example.com"
									required
									className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-brand-primary transition-colors"
								/>
							</div>
						</div>

						{/* Password */}
						<div>
							<label className="block text-sm font-bold text-text-secondary mb-2">
								Password
							</label>
							<div className="relative">
								<Lock
									size={20}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
								/>
								<input
									type="password"
									value={signupPassword}
									onChange={(e) =>
										setSignupPassword(e.target.value)
									}
									placeholder="••••••••"
									required
									minLength={6}
									className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-brand-primary transition-colors"
								/>
							</div>
						</div>

						{/* Confirm Password */}
						<div>
							<label className="block text-sm font-bold text-text-secondary mb-2">
								Confirm Password
							</label>
							<div className="relative">
								<Lock
									size={20}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
								/>
								<input
									type="password"
									value={signupConfirmPassword}
									onChange={(e) =>
										setSignupConfirmPassword(e.target.value)
									}
									placeholder="••••••••"
									required
									minLength={6}
									className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-brand-primary transition-colors"
								/>
							</div>
						</div>

						{/* Updates Checkbox */}
						<div className="flex items-start gap-3 py-2">
							<button
								type="button"
								onClick={() =>
									setReceiveUpdates(!receiveUpdates)
								}
								className={cn(
									'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors mt-0.5',
									receiveUpdates
										? 'bg-brand-primary border-brand-primary'
										: 'border-slate-300'
								)}
							>
								{receiveUpdates && (
									<Check size={14} className="text-white" />
								)}
							</button>
							<label
								onClick={() =>
									setReceiveUpdates(!receiveUpdates)
								}
								className="text-sm text-text-secondary cursor-pointer select-none"
							>
								Send me product updates and occasional marketing
								emails
							</label>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
						>
							{isLoading ? (
								<>
									<Loader2
										className="animate-spin"
										size={20}
									/>
									Creating account...
								</>
							) : (
								'Sign Up'
							)}
						</button>
					</form>
				)}
			</div>

			{/* Divider */}
			<div className="flex items-center gap-4 my-4">
				<div className="flex-1 h-px bg-slate-200" />
				<span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
					Or continue with
				</span>
				<div className="flex-1 h-px bg-slate-200" />
			</div>

			{/* Google Sign In */}
			<button
				onClick={handleGoogleSignIn}
				disabled={isGoogleLoading}
				className="bg-white border-2 border-slate-200 text-text-primary font-bold py-4 rounded-xl hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-sm"
			>
				{isGoogleLoading ? (
					<Loader2 className="animate-spin" size={20} />
				) : (
					<>
						<svg className="w-5 h-5" viewBox="0 0 24 24">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Continue with Google
					</>
				)}
			</button>

			<AlertToast
				isOpen={showError}
				onClose={() => setShowError(false)}
				message={errorMessage}
				variant="error"
			/>
		</div>
	);
}
