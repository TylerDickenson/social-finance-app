import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function LikeButton({ likeableId, likeableType, initialLikesCount, initialIsLiked }) {
    const [likesCount, setLikesCount] = useState(initialLikesCount || 0); // Track the number of likes
    const [isLiked, setIsLiked] = useState(initialIsLiked); // Track if the user has liked the item
    const [animateLike, setAnimateLike] = useState(false); // Track animation state for liking
    const [spin, setSpin] = useState(false); // Track spin animation for unliking

    // Reinitialize isLiked state when initialIsLiked changes (e.g., after a page refresh)
    useEffect(() => {
        setIsLiked(initialIsLiked);
    }, [initialIsLiked]);

    const handleLikeToggle = () => {
        const routeName = isLiked ? `${likeableType}.unlike` : `${likeableType}.like`; // Determine the route
        const method = isLiked ? 'delete' : 'post'; // Determine the HTTP method

        if (isLiked) {
            setSpin(true); // Trigger spin animation for unliking
            setTimeout(() => setSpin(false), 300); // Reset spin animation after 300ms
        } else {
            setAnimateLike(true); // Trigger like animation
            setTimeout(() => setAnimateLike(false), 300); // Reset like animation after 300ms
        }

        window.axios[method](route(routeName, { id: likeableId }))
            .then(() => {
                setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1)); // Update the likes count
                setIsLiked((prev) => !prev); // Toggle the like state
            })
            .catch((error) => {
                console.error('Error toggling like:', error);
            });
    };

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={handleLikeToggle}
                className={`flex items-center space-x-1 focus:outline-none ${
                    animateLike ? 'animate-like' : ''
                }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 transition-transform duration-300 ${
                        isLiked ? 'text-red-500' : 'text-gray-500'
                    } ${spin ? 'animate-spin-down' : ''}`} // Apply spin animation when unliking
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a1 1 0 01-1-1V7.414L5.707 10.707a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L11 7.414V17a1 1 0 01-1 1z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
            <span
                className="text-base font-semibold mt-1 text-gray-700" // Ensure consistent size and styling
            >
                {likesCount}
            </span>
        </div>
    );
}