import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import Post from '@/Components/Post';

export default function TagShow({ tag, posts }) { 
    const { auth } = usePage().props;
    const currentUserId = auth.user ? auth.user.id : null;

    const renderPosts = () => {
        if (!Array.isArray(posts) || posts.length === 0) {
            return <p className="text-center text-gray-500 dark:text-gray-400">No posts found tagged with ${tag.name}.</p>;
        }

        return posts.map((post) => (
            <Post
                key={post.id}
                post={post}
                currentUserId={currentUserId}
            />
        ));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={`Tag - $${tag.name}`}
        >
            <Head title={`Tag: $${tag.name}`} />
            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {renderPosts()}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}