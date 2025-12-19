import { auth } from '@/auth';
import { getGroups } from '@/app/actions';
import ScanClient from '@/components/ScanClient';
import { redirect } from 'next/navigation';

export default async function ScanPage() {
	const session = await auth();
	if (!session?.user) redirect('/profile');

	const groups = await getGroups();

	// Map to simple object to avoid Date serialization issues in Client Component prop
	const simpleGroups = groups.map((g) => ({
		id: g.id,
		name: g.name,
		type: g.type,
	}));

	return <ScanClient groups={simpleGroups} />;
}
