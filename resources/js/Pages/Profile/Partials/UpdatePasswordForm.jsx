import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const contentRef = useRef(null);
    const timeoutRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
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
                setIsOpen(false);
            },
            onError: (errors) => {
                if (!isOpen) setIsOpen(true);
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

    const updateMaxHeight = () => {
        if (contentRef.current) {
            if (isOpen) {
                contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
            } else {
                 if (contentRef.current.style.maxHeight !== '0px') {
                    contentRef.current.style.maxHeight = '0px';
                 }
            }
        }
    };

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        updateMaxHeight();
        if (isOpen) {
             timeoutRef.current = setTimeout(() => {
                updateMaxHeight();
             }, 50);
        }
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isOpen]);


    // ...existing code...
    return (
        <section className={`${className} space-y-6`}>
            {/* Add flex-grow to the left div and ml-4 to the right div */}
            <header onClick={toggleOpen} className="cursor-pointer flex justify-between items-center -mb-5">
                <div className="flex-grow"> {/* Make this div take available space */}
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                        Update Password
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-100">
                        Ensure your account is using a long, random password to stay secure.
                    </p>
                </div>
                <div className="flex items-center ml-4"> {/* Add left margin for spacing */}
                    <Transition
                        show={recentlySuccessful && !isOpen}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-white mr-2">Saved.</p>
                    </Transition>
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
                style={{ maxHeight: '0px' }}
                className="overflow-hidden transition-max-height duration-700 ease-in-out"
            >
                {/* ... rest of the form ... */}
                 <form onSubmit={updatePassword} className="mt-6 space-y-6">
                    <div>
                        <InputLabel
                            htmlFor="current_password"
                            value="Current Password"
                            className="dark:text-white"
                        />
                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) =>
                                setData('current_password', e.target.value)
                            }
                            type="password"
                            className="mt-1 block w-full border-2 dark:bg-gray-500"
                            autoComplete="current-password"
                        />
                        <InputError
                            message={errors.current_password}
                            className="mt-2 dark:text-red-400"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password"
                            value="New Password"
                            className="dark:text-white"
                        />
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            className="mt-1 block w-full border-2 dark:bg-gray-500"
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password} className="mt-2 dark:text-red-400" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                            className='dark:text-white'
                        />
                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            type="password"
                            className="mt-1 block w-full border-2 dark:bg-gray-500"
                            autoComplete="new-password"
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2 dark:text-red-400"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <PrimaryButton className="dark:bg-gray-500 hover:dark:bg-gray-400 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2" disabled={processing}>Save</PrimaryButton>
                        <Transition
                            show={recentlySuccessful && isOpen}
                            enter="transition ease-in-out duration-300"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out duration-300"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-gray-600 dark:text-white">Saved.</p>
                        </Transition>
                    </div>
                </form>
            </div>
        </section>
    );
}