import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import Post from '@/Components/Post';

export default function TagShow({ tag, posts, currentFilter = 'newest' }) {
    const { auth } = usePage().props;
    const currentUserId = auth.user ? auth.user.id : null;

    const handleFilterChange = (newFilter) => {
        router.get(route('tags.show', tag.name), { filter: newFilter }, { preserveState: true });
    };

    const renderPosts = () => {
        if (!Array.isArray(posts) || posts.length === 0) {
            return <p className="text-center text-gray-500 dark:text-gray-400 mb-6">No posts or comments found tagged with ${tag.name}.</p>;
        }

        return posts.map((post) => (
            <div className="mb-6" key={`post-${post.id}`}>
                <Post
                    post={post}
                    currentUserId={currentUserId}
                />
            </div>
        ));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={`Tag - $${tag.name}`}
        >
            <Head title={`Tag: $${tag.name}`} />

                <div className="mx-auto max-w-7xl px-8">
                    <div className="flex justify-end">
                        <div className="relative">
                            <select
                                value={currentFilter}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                className="appearance-none mr-10 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="newest">Newest Posts</option>
                                <option value="oldest">Oldest Posts</option>
                                <option value="popular">Most Liked</option>
                            </select>
                            
                        </div>
                    </div>

                    <div className="overflow-hidden">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {renderPosts()}
                        </div>
                    </div>
                </div>
        </AuthenticatedLayout>
    );
}