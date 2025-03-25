import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function LikeButton({ likeableId, likeableType, initialLikesCount, initialIsLiked }) {
    const [likesCount, setLikesCount] = useState(initialLikesCount || 0); 
    const [isLiked, setIsLiked] = useState(initialIsLiked); 
    const [animateLike, setAnimateLike] = useState(false); 
    const [spin, setSpin] = useState(false); 

    useEffect(() => {
        setIsLiked(initialIsLiked);
    }, [initialIsLiked]);

    const handleLikeToggle = () => {
        const routeName = isLiked ? `${likeableType}.unlike` : `${likeableType}.like`; 
        const method = isLiked ? 'delete' : 'post'; 

        if (isLiked) {
            setSpin(true); 
            setTimeout(() => setSpin(false), 300); 
        } else {
            setAnimateLike(true); 
            setTimeout(() => setAnimateLike(false), 300); 
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
                        isLiked ? 'text-blue-500' : 'text-gray-500'
                    } ${spin ? 'animate-spin-down' : ''}`} 
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    {/* Square border */}
                    <rect x="2" y="2" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" />
                    {/* Stock graph line */}
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
            <span
                className="text-base font-semibold mt-1 text-gray-700" 
            >
                {likesCount}
            </span>
        </div>
    );
}