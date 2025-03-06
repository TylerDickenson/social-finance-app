import { useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

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
                setTimeout(() => setShowSaved(false), 5000); // Show "Saved" message for 5 seconds
                window.scrollTo(0, scrollPosition); // Preserve scroll position
            },
        });
    };

    useEffect(() => {
        if (recentlySuccessful) {
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 5000); // Show "Saved" message for 5 seconds
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
            <header onClick={toggleOpen} className="cursor-pointer flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">About</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Update your profile's about section.
                    </p>
                </div>
                <div className="flex items-center">
                    {showSaved && !isOpen && (
                        <p className="text-sm text-gray-600 mr-2 transition-opacity duration-1000">Saved.</p>
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
                        <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                            About
                        </label>
                        <textarea
                            id="about"
                            className="mt-1 block w-full h-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm resize-none"
                            value={data.about}
                            onChange={(e) => setData('about', e.target.value)}
                        />
                        {errors.about && <div className="mt-2 text-sm text-red-600">{errors.about}</div>}
                    </div>

                    <button
                        type="submit"
                        className="absolute bottom-2 right-2 inline-flex justify-center rounded-md border border-transparent bg-blue-500 py-2 px-4 text-md font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2"
                        disabled={processing}
                    >
                        Save
                    </button>
                </form>
            </div>
        </section>
    );
}