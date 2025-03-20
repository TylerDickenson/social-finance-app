import React from 'react';
import { Link } from '@inertiajs/react';

const UserModal = ({ isOpen, closeModal, modalType, list, searchQuery, setSearchQuery }) => {
    if (!isOpen) return null;

    const filteredList = list.filter((person) =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center"
            onClick={closeModal}
        >
            <div
                className="bg-white rounded-lg shadow-lg max-w-md w-full mt-10"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    onClick={closeModal}
                >
                    &times;
                </button>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">
                        {modalType === 'followers' ? 'Followers' : 'Following'}
                    </h2>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {filteredList && filteredList.length > 0 ? (
                        <ul className="space-y-2">
                            {filteredList.map((person) => (
                                <Link
                                    key={person.id}
                                    href={`/profile/${person.id}`}
                                    className="block p-3 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-md"
                                >
                                    <li className="flex items-center space-x-4">
                                        <img
                                            src={person.avatar_url}
                                            alt={person.name}
                                            className="w-12 h-12 rounded-full transition-transform duration-300 hover:scale-110"
                                        />
                                        <p className="text-lg font-medium">{person.name}</p>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No {modalType} available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserModal;