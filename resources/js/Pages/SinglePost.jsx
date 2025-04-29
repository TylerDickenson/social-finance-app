import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Post from '@/Components/Post';
import { router } from '@inertiajs/react';

export default function SinglePost({ auth, post: initialPost }) {
    const processedPost = {
        ...initialPost,
        user: {
            ...initialPost.user,
            is_following: !!initialPost.user.is_following 
        }
    };
    

    const [post, setPost] = useState(processedPost);

    const handlePostDelete = (postId) => {
        router.visit(route('dashboard'));
    };

    const handleFollowChange = (userId, isFollowing) => {
        setPost((prevPost) => ({
            ...prevPost,
            user: {
                ...prevPost.user,
                is_following: isFollowing 
            }
        }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={`Post - ${post.title}`}
        >
            <Head title={`${post.title} by ${post.user.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-14 ">
                    
                    
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