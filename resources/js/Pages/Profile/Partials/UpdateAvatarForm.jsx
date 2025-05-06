import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import FileUpload from '@/Components/FileUpload';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

export default function UpdateAvatarForm({ avatarUrl, className = '' }) {
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({ 
        avatar: null 
    });

    const [isOpen, setIsOpen] = useState(false);
    const [showSaved, setShowSaved] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleFileChange = (file) => {
        setData('avatar', file);
    };

    const submit = (e) => {
        e.preventDefault();
        if (!data.avatar) return;

        post(route('profile.updateAvatar'), {
            forceFormData: true,
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
                        Avatar
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        Update your profile's avatar.
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
                    <div className="space-y-4">
                        <div className="border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                            <label className="block text-base font-medium text-gray-700 dark:text-gray-200 text-center">
                                Current Avatar
                            </label>
                            <img 
                                src={avatarUrl} 
                                alt="Current Avatar" 
                                className="w-32 h-32 object-cover rounded-full mx-auto mt-3 border-2 border-gray-300 dark:border-gray-500"
                            />
                        </div>
                        
                        <div>
                            <FileUpload
                                label="Choose a new avatar"
                                name="avatar"
                                value={data.avatar}
                                onChange={handleFileChange}
                                error={errors.avatar}
                                className="w-full"
                            />
                            <InputError message={errors.avatar} className="mt-2" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <PrimaryButton 
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            disabled={processing || !data.avatar}
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