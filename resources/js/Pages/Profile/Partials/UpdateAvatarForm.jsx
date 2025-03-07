import { useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import FileUpload from '@/Components/FileUpload';

export default function UpdateAvatarForm({ avatarUrl }) {
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({ avatar: null });

    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false); // Track the closing state
    const [showSaved, setShowSaved] = useState(false);
    const contentRef = useRef(null);

    // Toggle the open/close state
    const toggleOpen = () => {
        if (!isOpen) {
            setIsClosing(false); // Reset closing state when opening
            setIsOpen(true); // Open the form
        } else {
            setIsClosing(true); // Set to closing state
            // Wait for the closing transition to complete before fully closing
            setTimeout(() => setIsOpen(false), 500); // Close after transition
        }
    };

    // Handle file change for the avatar upload
    const handleFileChange = (file) => {
        setData('avatar', file);
        setIsOpen(true); // Keep the form open when selecting a new file
    };

    // Handle form submission
    const submit = (e) => {
        e.preventDefault();
        post(route('profile.updateAvatar'), {
            forceFormData: true,
            onSuccess: () => {
                setIsClosing(true); // Start closing animation
                setTimeout(() => setIsOpen(false), 500); // Wait for the animation, then hide
                setShowSaved(true);
                setTimeout(() => setShowSaved(false), 5000); // Show "Saved" message for 5 seconds
            },
        });
    };

    // Close the form when the "Saved" message is shown
    useEffect(() => {
        if (showSaved) {
            setIsClosing(true);
            setTimeout(() => setIsOpen(false), 500); // Close after the transition
        }
    }, [showSaved]);

    return (
        <section className="space-y-6">
            {/* Header */}
            <header onClick={toggleOpen} className="cursor-pointer flex justify-between items-center -mb-5">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">Avatar</h2>
                    <p className="mt-1 text-sm text-gray-600">Update your profile's avatar.</p>
                </div>
                <div className="flex items-center">
                    {showSaved && !isOpen && (
                        <p className="text-sm text-gray-600 mr-2 transition-opacity duration-1000 opacity-100">
                            Saved.
                        </p>
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

            {/* Content */}
            <div
                ref={contentRef}
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen && !isClosing ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <form onSubmit={submit} className="mt-6 space-y-4">
                    {/* Avatar Preview */}
                    <div>
                        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Avatar</label>
                        <img src={avatarUrl} alt="Current Avatar" className="w-24 h-24 rounded-full mb-4" />
                        <FileUpload
                            label="Avatar"
                            name="avatar"
                            value={data.avatar}
                            onChange={handleFileChange}
                            error={errors.avatar}
                        />
                    </div>

                    {/* Save Button */}
                    <div>
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 py-2 px-4 text-md font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2"
                            disabled={processing}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
