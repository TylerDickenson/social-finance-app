import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function LikeButton({ likeableId, likeableType, initialLikesCount, initialIsLiked }) {
    const [likesCount, setLikesCount] = useState(initialLikesCount || 0); // Track the number of likes
    const [isLiked, setIsLiked] = useState(initialIsLiked); // Track if the user has liked the item

    // Reinitialize isLiked state when initialIsLiked changes (e.g., after a page refresh)
    useEffect(() => {
        setIsLiked(initialIsLiked);
    }, [initialIsLiked]);

    const handleLikeToggle = () => {
        const routeName = isLiked ? `${likeableType}.unlike` : `${likeableType}.like`; // Determine the route
        const method = isLiked ? 'delete' : 'post'; // Determine the HTTP method

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
                className={`px-2 py-1 rounded-md text-white ${isLiked ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'}`}
            >
                {isLiked ? 'Unlike' : 'Like'}
            </button>
            <span className="text-sm font-semibold">{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
        </div>
    );
}