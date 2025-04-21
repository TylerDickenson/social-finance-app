import React from 'react';
import { Link } from '@inertiajs/react';

const UserModal = ({ isOpen, closeModal, modalType, list, searchQuery, setSearchQuery }) => {
    if (!isOpen) return null;

    const filteredList = list?.filter((person) =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center"
            onClick={closeModal}
        >
            <div
                className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden transition-all duration-300 transform"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {modalType === 'followers' ? 'Followers' : 'Following'}
                    </h2>
                    <button
                        className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={closeModal}
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="p-4">
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700/50 dark:text-white"
                        />
                    </div>
                    
                    <div className="mt-4 max-h-60 overflow-y-auto">
                        {filteredList.length > 0 ? (
                            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredList.map((person) => (
                                    <li key={person.id}>
                                        <Link
                                            href={route('profile.show', { id: person.id })}
                                            className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                                        >
                                            <img
                                                src={person.avatar_url}
                                                alt={person.name}
                                                className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-blue-500 transition-all"
                                            />
                                            <p className="ml-3 font-medium text-gray-900 dark:text-white">{person.name}</p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                                No {modalType} found
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserModal;