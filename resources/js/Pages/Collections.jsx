import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Collections({ collections }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        description: '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('collections.store'), {
            onSuccess: () => {
                reset();
                setIsModalOpen(false); // Close the modal after successful submission
            },
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <AuthenticatedLayout header="Collections">
            <Head title="Collections" />

            <div className="py-12">
                <div className="relative mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-6">Your Collections</h1>

                            {/* Collections Grid */}
                            <div className="relative">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {collections.map((collection) => (
                                        <div
                                            key={collection.id}
                                            className="p-4 border border-gray-300 rounded-lg shadow hover:shadow-xl hover:shadow-blue-400 transition-shadow"
                                        >
                                            <Link
                                                href={route('collections.show', { id: collection.id })}
                                                className="text-lg font-semibold text-blue-500 hover:underline"
                                            >
                                                {collection.name}
                                            </Link>
                                            <p className="text-sm text-gray-600 mt-2">
                                                {collection.description || 'No description available.'}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {collection.posts_count} {collection.posts_count === 1 ? 'post' : 'posts'}
                                            </p>
                                        </div>
                                    ))}

                                    {/* Add New Collection Button */}
                                    <div
                                        onClick={() => setIsModalOpen(true)}
                                        className="flex items-center justify-center p-4 border border-gray-300 rounded-lg shadow hover:shadow-xl hover:shadow-blue-400 transition-shadow cursor-pointer h-28"
                                    >
                                        <div className="flex flex-col items-center">
                                            <p className="text-lg font-semibold text-gray-500 mt-2">
                                                Create New Collection
                                            </p>
                                            <span className="text-5xl text-gray-500 -mt-2">+</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal for Creating a New Collection */}
                    {isModalOpen && (
                        <div
                            className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                            onClick={closeModal} // Close modal when clicking outside
                        >
                            <div
                                className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
                                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                            >
                                <h2 className="text-xl font-bold mb-4">Create New Collection</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Collection Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-24 resize-none" // Fixed height and no resizing
                                        ></textarea>
                                        {errors.description && (
                                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                        )}
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            Create
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}