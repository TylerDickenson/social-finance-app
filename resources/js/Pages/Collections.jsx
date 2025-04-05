import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Collections({ collections }) {
    return (
        <AuthenticatedLayout header="Collections">
            <Head title="Collections" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold">Your Collections</h1>
                            {collections.length > 0 ? (
                                <ul className="mt-4">
                                    {collections.map((collection) => (
                                        <li key={collection.id} className="mb-4">
                                            <Link
                                                href={route('collections.show', { id: collection.id })} // Correct route name
                                                className="text-blue-500 hover:underline"
                                            >
                                                {collection.name}
                                            </Link>
                                            <p className="text-sm text-gray-600">{collection.description}</p>
                                            <p className="text-sm text-gray-500">
                                                {collection.posts_count} {collection.posts_count === 1 ? 'post' : 'posts'}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-4 text-gray-600">You have no collections yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}