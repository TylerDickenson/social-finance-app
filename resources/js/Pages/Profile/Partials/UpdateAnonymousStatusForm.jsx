import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import React, { useState, useEffect, useRef } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import Toggle from '@/Components/Toggle';

export default function UpdateAnonymousStatusForm({ isAnonymous, className = '' }) {
    const [isOpen, setIsOpen] = useState(true);
    const [showSaved, setShowSaved] = useState(false);
    const [localChecked, setLocalChecked] = useState(() => !!isAnonymous);
    
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        anonymous: !!isAnonymous,
    });
    
    useEffect(() => {
        setLocalChecked(!!isAnonymous);
        setData('anonymous', !!isAnonymous);
    }, [isAnonymous]);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.anonymous.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setLocalChecked(data.anonymous);
                setShowSaved(true);
                setTimeout(() => setShowSaved(false), 3000);
            }
        });
    };

    const handleToggleChange = (e) => {
        const newValue = e.target.checked;
        setLocalChecked(newValue);
        setData('anonymous', newValue);
    };

    return (
        <section className={`${className}`}>
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4 mb-5">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Anonymous Account
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        When enabled, your posts will appear anonymous to other users by default, and your profile will be private.
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
                    <div className="flex items-center justify-between">
                        <InputLabel htmlFor="anonymous" value="Enable Anonymous Mode" className="dark:text-white" />
                        <Toggle
                            id="anonymous"
                            name="anonymous"
                            checked={localChecked}
                            onChange={handleToggleChange}
                            className="rounded-full"
                        />
                    </div>

                    <InputError className="mt-2" message={errors.anonymous} />

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