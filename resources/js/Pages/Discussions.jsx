import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Discussions({ auth, tags }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter tags based on the search term
    const filteredTags = searchTerm
        ? Object.fromEntries(
              Object.entries(tags).map(([letter, tags]) => [
                  letter,
                  tags.filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase())),
              ]).filter(([_, tags]) => tags.length > 0)
          )
        : tags;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Discussions"
        >
            <Head title="Discussions" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-14">
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="p-6">
                            <div className="mb-6 ">
                                <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    Browse Topics
                                </h2>

                                    <div className="">
                                        <input
                                            type="text"
                                            placeholder="Search for a topic..."
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md dark:bg-slate-700 dark:text-white"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Discussions are grouped by tags to help you find the topic you are interested in.
                                </p>

                                {/* Search input */}
                                
                            </div>

                            {Object.keys(filteredTags).length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 dark:text-gray-400">No matching topics found.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {Object.entries(filteredTags).map(([letter, tags]) => (
                                        <div key={letter} className="mb-6">
                                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                                                {letter}
                                            </h3>
                                            <div className="flex flex-wrap gap-3">
                                                {tags.map(tag => (
                                                    <Link
                                                        key={tag.id}
                                                        href={route('tags.show', { tagName: tag.name })}
                                                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors"
                                                    >
                                                        ${tag.name}
                                                        {tag.posts_count && (
                                                            <span className="ml-2 bg-blue-200 dark:bg-blue-800 text-xs px-2 py-1 rounded-full">
                                                                {tag.posts_count}
                                                            </span>
                                                        )}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}