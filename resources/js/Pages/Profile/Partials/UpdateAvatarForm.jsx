import { useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import FileUpload from '@/Components/FileUpload';
import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';

export default function UpdateAvatarForm({ avatarUrl }) {
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({ avatar: null });

    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef(null);
    const timeoutRef = useRef(null);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleFileChange = (file) => {
        setData('avatar', file);
        if (!isOpen) {
            setIsOpen(true);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (!data.avatar) return;

        const scrollPosition = window.scrollY;
        post(route('profile.updateAvatar'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
            },
            onError: () => {
                setIsOpen(true);
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

        if (isOpen && data.avatar) {
             timeoutRef.current = setTimeout(() => {
                updateMaxHeight();
             }, 50);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };

    }, [isOpen, data.avatar]);

    return (
        <section className="space-y-6">
            <header onClick={toggleOpen} className="cursor-pointer flex justify-between items-center -mb-5">
                <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Avatar</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-100">Update your profile's avatar.</p>
                </div>
                <div className="flex items-center">
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
                <form onSubmit={submit} className="mt-6 space-y-4">
                    <div className="space-y-4">
                        {/* Current Avatar Section */}
                        <div className="border-2 border-gray-300 bg-gray-200 dark:bg-gray-500 dark:border-gray-400 rounded-3xl p-4 max-w-xs">
                            <label htmlFor="avatar-current" className="block text-lg font-semibold text-gray-700 dark:text-white text-center">Your Current Avatar</label>
                            <img id="avatar-current" src={avatarUrl} alt="Current Avatar" className="w-auto border-2 rounded-3xl mt-2 mx-auto block" />
                        </div>

                        <hr className="border-gray-300 border-2 dark:border-gray-600 max-w-xs" />

                        {/* File Upload / New Preview Section */}
                        <div className="max-w-xs">
                            <div className={data.avatar ? "border-2 border-gray-300 bg-gray-200 dark:bg-gray-500 dark:border-gray-400 rounded-3xl p-4" : ""}>
                                {data.avatar && (
                                    <label className="block text-lg font-semibold text-gray-700 dark:text-white text-center mb-2">New Avatar Preview</label>
                                )}
                                <FileUpload
                                    label={data.avatar ? "Change Avatar" : "Select a new Avatar"}
                                    name="avatar"
                                    value={data.avatar}
                                    onChange={handleFileChange}
                                    error={errors.avatar}
                                />
                            </div>
                        </div>
                    </div>

                     {/* Save Button Section*/}
                     <div className="flex items-center gap-4 mt-6 max-w-xs">
                        <PrimaryButton
                            className="dark:bg-gray-500 hover:dark:bg-gray-400 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                            disabled={processing || !data.avatar}
                        >
                            Save
                        </PrimaryButton>
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