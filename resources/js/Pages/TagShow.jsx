import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import Post from '@/Components/Post';

export default function TagShow({ tag, posts }) {
    const { auth } = usePage().props;
    const currentUserId = auth.user ? auth.user.id : null;

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
            header={`Content Tagged - $${tag.name}`}
        >
            <Head title={`Tag: $${tag.name}`} />
            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {renderPosts()}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}