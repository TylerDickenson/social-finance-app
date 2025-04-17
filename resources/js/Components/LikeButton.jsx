import React, { useState, useImperativeHandle, forwardRef } from 'react';

const LikeButton = forwardRef(({ likeableId, likeableType, initialLikesCount, initialIsLiked }, ref) => {
    const [likesCount, setLikesCount] = useState(initialLikesCount || 0);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isUnliking, setIsUnliking] = useState(false);

    const toggleLike = () => {
        const routeName = isLiked ? `${likeableType}.unlike` : `${likeableType}.like`;
        const method = isLiked ? 'delete' : 'post';

        if (isLiked) {
            setIsUnliking(true);
            setTimeout(() => setIsUnliking(false), 300);
        }

        window.axios[method](route(routeName, { id: likeableId }))
            .then(() => {
                setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
                setIsLiked((prev) => !prev);
            })
            .catch((error) => {
                console.error('Error toggling like:', error);
            });
    };

    useImperativeHandle(ref, () => ({
        toggleLike,
    }));

    return (
        <div className="flex items-center space-x-2 mt-2">
            <button
                onClick={toggleLike}
                className={`flex items-center space-x-1 focus:outline-none ${
                    isLiked ? 'animate-like' : ''
                }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 transition-transform duration-300 ${
                        isLiked ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-100' 
                    } ${isUnliking ? 'animate-spin-down text-red-500' : ''}`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <rect x="2" y="2" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path
                        d="M4 16l5-5 4 4 7-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            <span className="text-base font-semibold mt-1 text-gray-700 dark:text-white">{likesCount}</span>
        </div>
    );
});

export default LikeButton;