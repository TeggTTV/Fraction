'use client';

import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function SignInPromptModal() {
	const handleGoogleSignIn = async () => {
		await signIn('google', { callbackUrl: '/' });
	};

	return (
		<div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
			{/* Backdrop blur */}
			<div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

			{/* Modal */}
			<motion.div
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ type: 'spring', damping: 25, stiffness: 300 }}
				className="relative bg-linear-to-br from-white to-slate-50 rounded-3xl shadow-2xl w-[90%] max-w-md overflow-hidden border border-slate-200"
			>
				{/* Accent bar */}
				<div className="h-1.5 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500" />

				<div className="p-8 text-center">
					{/* Icon */}
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{
							delay: 0.2,
							type: 'spring',
							stiffness: 200,
						}}
						className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-brand-primary to-blue-700 shadow-lg"
					>
						<LogIn size={32} className="text-white" />
					</motion.div>

					{/* Title */}
					<motion.h2
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.3 }}
						className="text-2xl font-extrabold text-text-primary mb-3"
					>
						Welcome to Fraction!
					</motion.h2>

					{/* Message */}
					<motion.p
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.4 }}
						className="text-text-secondary mb-8 leading-relaxed"
					>
						Sign in or create an account to start splitting expenses
						with friends easily.
					</motion.p>

					{/* Buttons */}
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.5 }}
						className="flex flex-col gap-3"
					>
						<Link href="/profile">
							<button className="w-full bg-gradient-to-r from-brand-primary to-blue-700 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
								<LogIn size={20} />
								Sign In
							</button>
						</Link>

						<button
							onClick={handleGoogleSignIn}
							className="w-full bg-white border-2 border-slate-200 text-text-primary font-bold py-4 rounded-xl hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all flex items-center justify-center gap-2"
						>
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
									d="M6.16 14.01c-.1-.33-.16-.65-.16-.99 0-.34.06-.66.16-.99V9.02H2.18c-.69 1.39-.99 2.91-.99 4.5s.3 3.11.99 4.5l3.98-3.01z"
								/>
								<path
									fill="#EA4335"
									d="M12 4.73c1.64 0 3.1-.57 4.22-1.66l3.14-3.14C17.45.92 14.98 0 12 0 7.7 0 3.99 2.47 2.18 6.02l3.98 3.01C6.71 6.66 9.14 4.73 12 4.73z"
								/>
							</svg>
							Sign in with Google
						</button>
					</motion.div>

					{/* Footer text */}
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6 }}
						className="text-xs text-text-secondary mt-6"
					>
						Split bills, track expenses, settle debts — all in one
						place
					</motion.p>
				</div>
			</motion.div>
		</div>
	);
}
