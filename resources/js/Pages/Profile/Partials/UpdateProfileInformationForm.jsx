import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const [isOpen, setIsOpen] = useState(true);
    const [showSaved, setShowSaved] = useState(false);
    const contentRef = useRef(null);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowSaved(true);
                setTimeout(() => setShowSaved(false), 3000);
            }
        });
    };

    return (
        <section className={`${className}`}>
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4 mb-5">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Profile Information
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        Update your account's profile information and email address.
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
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="name" value="Name" className="dark:text-white" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-700/50 dark:text-white rounded-lg"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" className="dark:text-white" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-700/50 dark:text-white rounded-lg"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg">
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                Your email address is unverified.
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    className="ml-1 underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                >
                                    Click here to re-send the verification email.
                                </Link>
                            </p>

                            {status === 'verification-link-sent' && (
                                <div className="mt-2 font-medium text-sm text-green-600 dark:text-green-400">
                                    A new verification link has been sent to your email address.
                                </div>
                            )}
                        </div>
                    )}

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