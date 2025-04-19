import { useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';

import { Transition } from '@headlessui/react';

export default function UpdateAboutForm({ about }) {
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        about: about || '',
    });

    const [isOpen, setIsOpen] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const contentRef = useRef(null);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const submit = (e) => {
        e.preventDefault();
        const scrollPosition = window.scrollY;
        patch(route('profile.updateAbout'), {
            onSuccess: () => {
                setIsOpen(false);
                setShowSaved(true);
                setTimeout(() => setShowSaved(false), 5000); 
                window.scrollTo(0, scrollPosition); 
            },
        });
    };

    useEffect(() => {
        if (recentlySuccessful) {
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 5000); 
        }
    }, [recentlySuccessful]);

    useEffect(() => {
        if (isOpen) {
            contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
        } else {
            contentRef.current.style.maxHeight = '0px';
        }
    }, [isOpen]);

    return (
        <section className="space-y-6">
            <header onClick={toggleOpen} className="cursor-pointer flex justify-between items-center -mb-5">
                <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">About</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-100">
                        Update your profile's about section.
                    </p>
                </div>
                <div className="flex items-center">
                    {showSaved && !isOpen && (
                        <p className="text-sm text-gray-600 mr-2 transition-opacity duration-1000 dark:text-white">Saved.</p>
                    )}
                    <svg
                        className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </header>

            <div ref={contentRef} className="transition-max-height duration-1000 overflow-hidden max-h-0">
                <form onSubmit={submit} className="mt-6 relative">
                    <div>
                        <label htmlFor="about" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Your About section
                        </label>
                        <textarea
                            id="about"
                            className="mt-1 block w-full h-24 rounded-md border-2 border-gray-300 dark:bg-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm resize-none"
                            value={data.about}
                            onChange={(e) => setData('about', e.target.value)}
                        />
                        {errors.about && <div className="mt-2 text-sm text-red-600">{errors.about}</div>}
                    </div>

                    <div className="flex items-center gap-4 mt-6">
                        <PrimaryButton
                            className="dark:bg-gray-500 hover:dark:bg-gray-400 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2" // Added dark mode styles
                            disabled={processing}
                        >
                            Save
                        </PrimaryButton>

                    </div>
                    
                </form>

                
            </div>
        </section>
    );
}