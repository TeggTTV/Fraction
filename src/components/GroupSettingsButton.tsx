'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, LogOut, Trash2, X } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import AlertToast from './AlertToast';
import { deleteGroup, leaveGroup } from '@/app/actions';

interface GroupSettingsMenuProps {
	groupId: string;
	groupName: string;
	isOwner: boolean;
}

export default function GroupSettingsMenu({
	groupId,
	groupName,
	isOwner,
}: GroupSettingsMenuProps) {
	const [isOpen, setIsOpen] = useState(false);

	const handleLeaveGroup = () => {
		if (confirm(`Are you sure you want to leave "${groupName}"?`)) {
			// TODO: Implement leave group action
			alert('Leave group functionality coming soon');
		}
		setIsOpen(false);
	};

	const handleDeleteGroup = () => {
		if (
			confirm(
				`Are you sure you want to DELETE "${groupName}"? This cannot be undone.`
			)
		) {
			// TODO: Implement delete group action
			alert('Delete group functionality coming soon');
		}
		setIsOpen(false);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-20 animate-in fade-in duration-200">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/20"
				onClick={() => setIsOpen(false)}
			/>

			{/* Menu */}
			<div className="relative bg-white rounded-2xl shadow-xl overflow-hidden w-64 animate-in slide-in-from-top-2 duration-200">
				<div className="flex items-center justify-between p-4 border-b border-slate-100">
					<h3 className="font-bold text-text-primary">
						Group Settings
					</h3>
					<button
						onClick={() => setIsOpen(false)}
						className="p-1 rounded-full hover:bg-slate-100"
					>
						<X size={18} />
					</button>
				</div>

				<div className="p-2">
					{isOwner && (
						<button
							onClick={handleDeleteGroup}
							className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
						>
							<Trash2 size={18} />
							<span className="font-medium">Delete Group</span>
						</button>
					)}

					<button
						onClick={handleLeaveGroup}
						className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 text-text-secondary transition-colors"
					>
						<LogOut size={18} />
						<span className="font-medium">Leave Group</span>
					</button>
				</div>
			</div>
		</div>
	);
}

// Export a button component that toggles the menu
export function GroupSettingsButton({
	groupId,
	groupName,
	isOwner,
}: GroupSettingsMenuProps) {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const handleDelete = async () => {
		try {
			const result = await deleteGroup(groupId);
			if (result.success) {
				router.push('/');
				router.refresh();
			} else {
				setErrorMessage(result.message || 'Failed to delete group');
				setShowError(true);
			}
		} catch (error) {
			console.error('Failed to delete group:', error);
			setErrorMessage('Something went wrong');
			setShowError(true);
		}
	};

	const handleLeave = async () => {
		try {
			const result = await leaveGroup(groupId);
			if (result.success) {
				router.push('/');
				router.refresh();
			} else {
				setErrorMessage(result.message || 'Failed to leave group');
				setShowError(true);
			}
		} catch (error) {
			console.error('Failed to leave group:', error);
			setErrorMessage('Something went wrong');
			setShowError(true);
		}
	};

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="rounded-full p-2 hover:bg-slate-100 transition-colors"
			>
				<Settings size={24} className="text-text-secondary" />
			</button>

			{isOpen && (
				<div className="inset-0 z-50 animate-in fade-in duration-200">
					{/* Backdrop */}
					<div
						className="absolute h-screen inset-0 bg-black/30 backdrop-blur-sm"
						onClick={() => setIsOpen(false)}
					/>

					{/* Menu - positioned in top right */}
					<div className="absolute right-4 bg-white rounded-2xl shadow-2xl overflow-hidden w-64 animate-in slide-in-from-top-4 fade-in duration-200 border border-slate-100">
						<div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
							<h3 className="font-bold text-text-primary">
								Settings
							</h3>
							<button
								onClick={() => setIsOpen(false)}
								className="p-1 rounded-full hover:bg-slate-200 transition-colors"
							>
								<X size={18} className="text-text-secondary" />
							</button>
						</div>

						<div className="p-2">
							{isOwner && (
								<button
									onClick={() => {
										setIsOpen(false);
										setShowDeleteConfirm(true);
									}}
									className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors group"
								>
									<Trash2
										size={20}
										className="group-hover:scale-110 transition-transform"
									/>
									<span className="font-medium">
										Delete Group
									</span>
								</button>
							)}

							<button
								onClick={() => {
									setIsOpen(false);
									setShowLeaveConfirm(true);
								}}
								className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 text-text-secondary transition-colors group"
							>
								<LogOut
									size={20}
									className="group-hover:scale-110 transition-transform"
								/>
								<span className="font-medium">Leave Group</span>
							</button>
						</div>
					</div>
				</div>
			)}

			<ConfirmModal
				isOpen={showDeleteConfirm}
				onClose={() => setShowDeleteConfirm(false)}
				onConfirm={handleDelete}
				title="Delete Group?"
				message={`Are you sure you want to permanently delete "${groupName}"? This action cannot be undone and all expense data will be lost.`}
				confirmText="Delete"
				cancelText="Cancel"
				variant="danger"
			/>

			<ConfirmModal
				isOpen={showLeaveConfirm}
				onClose={() => setShowLeaveConfirm(false)}
				onConfirm={handleLeave}
				title="Leave Group?"
				message={`Are you sure you want to leave "${groupName}"? You'll need to be re-invited to rejoin.`}
				confirmText="Leave"
				cancelText="Stay"
				variant="warning"
			/>

			<AlertToast
				isOpen={showError}
				onClose={() => setShowError(false)}
				message={errorMessage}
				variant="error"
			/>
		</>
	);
}
