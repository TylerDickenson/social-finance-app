import React from 'react';

export default function DateTimeDisplay({ timestamp }) {
    const formattedTime = new Date(timestamp).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    const formattedDate = new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-500 dark:text-white">{formattedTime}</p>
            <p className="text-sm text-gray-500 dark:text-white">|</p>
            <p className="text-md text-gray-800 dark:text-gray-200 font-semibold">{formattedDate}</p>
        </div>
    );
}