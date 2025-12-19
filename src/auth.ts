import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		Google({
			clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
			clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
		}),
		Credentials({
			// Mock credentials for development since we don't have Google ID yet
			name: 'Mock Login',
			credentials: {
				username: {
					label: 'Username',
					type: 'text',
					placeholder: 'jsmith',
				},
			},
			async authorize(_credentials) {
				// Find or create a mock user for data persistence
				// In production this would verify password
				const user = await prisma.user.upsert({
					where: { email: 'mockuser@example.com' },
					update: {},
					create: {
						email: 'mockuser@example.com',
						name: 'Mock User',
						image: '',
					},
				});
				return user;
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async session({ session, token }) {
			if (session.user && token.sub) {
				session.user.id = token.sub;
			}
			return session;
		},
	},
});
