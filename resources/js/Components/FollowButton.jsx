import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function FollowButton({ userId, isFollowing, onFollowChange }) {
    const [following, setFollowing] = useState(isFollowing);
    const { post, processing } = useForm();

   
    useEffect(() => {
        setFollowing(isFollowing);
    }, [isFollowing]);

    const handleFollow = () => {
        post(route('follow', { id: userId }), {
            preserveScroll: true,
            onSuccess: () => {
                setFollowing(true);
                if (onFollowChange) {
                    onFollowChange(userId, true);
                }
            },
            onError: (error) => {
                console.error('Error following user:', error);
            },
        });
    };

    const handleUnfollow = () => {
        post(route('unfollow', { id: userId }), {
            preserveScroll: true,
            onSuccess: () => {
                setFollowing(false);
                if (onFollowChange) {
                    onFollowChange(userId, false); 
                }
            },
            onError: (error) => {
                console.error('Error unfollowing user:', error);
            },
        });
    };

    return (
        <div className="flex space-x-2">
            {!following && (
                <button
                    onClick={handleFollow}
                    disabled={processing}
                    className="inline-flex items-center justify-center w-20 px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gray-500 hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-gray-700"
                >
                    Add <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
            {following && (
                <button
                    onClick={handleUnfollow}
                    disabled={processing}
                    className="inline-flex items-center justify-center w-20 px-4 py-2 border border-transparent text-sm font-bold rounded-lg shadow-sm text-white bg-gray-500 hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-gray-700"
                >
                    Unfollow
                </button>
            )}
        </div>
    );
}