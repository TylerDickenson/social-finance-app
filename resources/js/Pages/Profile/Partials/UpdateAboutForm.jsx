import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

export default function UpdateAboutForm({ about, className = '' }) {
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        about: about || '',
    });

    const [isOpen, setIsOpen] = useState(false);
    const [showSaved, setShowSaved] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.updateAbout'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowSaved(true);
                setTimeout(() => setShowSaved(false), 3000);
            },
        });
    };

    return (
        <section className={`${className}`}>
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4 mb-5">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        About
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        Update your profile's about section.
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
                        <label htmlFor="about" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Your About section
                        </label>
                        <textarea
                            id="about"
                            name="about"
                            rows="4"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-slate-700/50 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.about}
                            onChange={(e) => setData('about', e.target.value)}
                        />
                        <InputError message={errors.about} className="mt-2" />
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