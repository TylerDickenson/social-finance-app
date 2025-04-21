import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Post from '@/Components/Post';
import { router } from '@inertiajs/react';

export default function SinglePost({ auth, post: initialPost }) {
    // Convert is_following to boolean before setting state
    const processedPost = {
        ...initialPost,
        user: {
            ...initialPost.user,
            is_following: !!initialPost.user.is_following // Convert 0/1 to boolean
        }
    };
    
    // Use the processed post for state
    const [post, setPost] = useState(processedPost);

    const handlePostDelete = (postId) => {
        router.visit(route('dashboard'));
    };

    const handleFollowChange = (userId, isFollowing) => {
        // Update with boolean value
        setPost((prevPost) => ({
            ...prevPost,
            user: {
                ...prevPost.user,
                is_following: isFollowing // This should be boolean now
            }
        }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={`Post - ${post.title}`}
        >
            <Head title={`${post.title} by ${post.user.name}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <button 
                            onClick={() => window.history.back()} 
                            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            Back
                        </button>
                    </div>
                    
                    <Post 
                        post={post} 
                        currentUserId={auth.user.id}
                        onFollowChange={handleFollowChange}
                        onPostDelete={handlePostDelete}
                        showAllComments={true}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}