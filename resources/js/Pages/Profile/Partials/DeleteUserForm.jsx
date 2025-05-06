
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`${className}`}>
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4 mb-5">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Delete Account
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        Once your account is deleted, all of its resources and data will be permanently deleted.
                    </p>
                </div>
                <button 
                    type="button"
                    onClick={toggleOpen}
                    className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                    {isOpen ? 'Hide' : 'Show'}
                    <svg
                        className={`w-5 h-5 ml-1 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div className="space-y-6">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Before deleting your account, please download any data or information that you wish to retain.
                    </p>

                    <DangerButton onClick={confirmUserDeletion}>Delete Account</DangerButton>

                    <Modal show={confirmingUserDeletion} onClose={closeModal}>
                        <form onSubmit={deleteUser} className="p-6">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Are you sure you want to delete your account?
                            </h2>

                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your
                                password to confirm you would like to permanently delete your account.
                            </p>

                            <div className="mt-6">
                                <InputLabel htmlFor="password" value="Password" className="sr-only" />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-700/50 dark:text-white rounded-lg"
                                    isFocused
                                    placeholder="Password"
                                />

                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="mt-6 flex justify-end">
                                <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

                                <DangerButton className="ms-3" disabled={processing}>
                                    Delete Account
                                </DangerButton>
                            </div>
                        </form>
                    </Modal>
                </div>
            )}
        </section>
    );
}