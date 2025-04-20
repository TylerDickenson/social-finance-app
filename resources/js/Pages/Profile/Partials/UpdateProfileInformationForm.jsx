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
    const [isOpen, setIsOpen] = useState(false);
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
                if (isOpen) setIsOpen(false);
                setShowSaved(true);
                setTimeout(() => setShowSaved(false), 5000);
            },
            onError: () => {
                if (!isOpen) setIsOpen(true);
            }
        });
    };

    useEffect(() => {
        if (recentlySuccessful) {
            setShowSaved(true);
            const timer = setTimeout(() => setShowSaved(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [recentlySuccessful]);

    useEffect(() => {
        const element = contentRef.current;
        if (!element) return;
        
        if (isOpen) {
            element.style.maxHeight = 'none'; 
            const height = element.scrollHeight;
            element.style.maxHeight = '0px';
            
            element.offsetHeight;
            
            element.style.maxHeight = `${height}px`;
        } else {
            element.style.maxHeight = '0px';
        }
    }, [isOpen, errors]);

    return (
        <section className={`${className} space-y-6`}>
            {/* Header - Match UpdatePasswordForm.jsx with -mb-5 */}
            <header 
                onClick={toggleOpen} 
                className="cursor-pointer flex justify-between items-center -mb-5"
            >
                <div className="flex-grow">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                        Profile Information
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-100">
                        Update your account's profile information and email address.
                    </p>
                </div>
                <div className="flex items-center ml-4">
                    {showSaved && !isOpen && (
                        <p className="text-sm text-gray-600 dark:text-white mr-2">Saved.</p>
                    )}
                    <svg
                        className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'} dark:stroke-white`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </header>

            <div
                ref={contentRef}
                className="overflow-hidden transition-max-height duration-700 ease-in-out"
                style={{ maxHeight: '0px' }}
            >
                <form onSubmit={submit} className="mt-6 space-y-6">
                    <div>
                        <InputLabel htmlFor="name" value="Name" className="dark:text-white" />
                        <TextInput
                            id="name"
                            className="mt-1 block border-2 w-full dark:bg-gray-500"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            isFocused={isOpen}
                            autoComplete="name"
                        />
                        <InputError className="mt-2 dark:text-red-400" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" className="dark:text-white" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full border-2 dark:bg-gray-500"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />
                        <InputError className="mt-2 dark:text-red-400" message={errors.email} />
                    </div>

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div>
                            <p className="text-sm mt-2 text-gray-800 dark:text-gray-200">
                                Your email address is unverified.
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 ml-1"
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

                    <div className="flex items-center gap-4">
                        <PrimaryButton className="dark:bg-gray-500 hover:dark:bg-gray-400 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2" disabled={processing}>Save</PrimaryButton>
                        {showSaved && isOpen && (
                            <p className="text-sm text-gray-600 dark:text-white">
                                Saved.
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </section>
    );
}