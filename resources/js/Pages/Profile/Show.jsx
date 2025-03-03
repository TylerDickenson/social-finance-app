import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Post from '@/Components/Post';

const Show = ({ user, posts }) => {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-6 py-2">
                    <img src={user.avatar} alt="User Avatar" className="w-48 h-48 rounded-full" />
                    <div>
                        <h1 className="text-4xl font-bold leading-tight text-gray-800">
                            {user.name}
                        </h1>
                        <p className="mt-2 text-gray-600">{user.about}</p>
                        <p className="mt-2 text-gray-600">Posts: {posts.length}</p>
                    </div>
                </div>
            }
        >
            <Head title={`${user.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-10 text-gray-900">
                            <h2 className="mt-4 text-2xl font-semibold">Posts</h2>
                            <div className="mt-6 space-y-6">
                                {posts && posts.length > 0 ? (
                                    posts.map(post => (
                                        <Post key={post.id} post={post} currentUserId={user.id} />
                                    ))
                                ) : (
                                    <p className="text-lg">No posts available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;