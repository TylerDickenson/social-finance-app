import React from 'react';

export default function BackArrowIcon({ className = "w-6 h-6", ...props }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="w-5 h-5"
            >
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" 
            />
        </svg>
    )
}
