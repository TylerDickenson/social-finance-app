import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [showSaved, setShowSaved] = useState(false);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowSaved(true);
                setTimeout(() => setShowSaved(false), 3000);
            },
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={`${className}`}>
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4 mb-5">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Update Password
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        Ensure your account is using a long, random password to stay secure.
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
                <form onSubmit={updatePassword} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="current_password" value="Current Password" className="dark:text-white" />
                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type="password"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-700/50 dark:text-white rounded-lg"
                            autoComplete="current-password"
                        />
                        <InputError message={errors.current_password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="New Password" className="dark:text-white" />
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-700/50 dark:text-white rounded-lg"
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="dark:text-white" />
                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type="password"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-700/50 dark:text-white rounded-lg"
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-between">
                        <PrimaryButton 
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            disabled={processing}
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </PrimaryButton>
                        
                        {showSaved && (
                            <span className="text-sm text-green-600 dark:text-green-400 animate-pulse">
                                Saved successfully!
                            </span>
                        )}
                    </div>
                </form>
            )}
        </section>
    );
}