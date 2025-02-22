// filepath: /Users/tylerdickenson/Projects/finance-app-3.0/social-finance-app/resources/js/Components/DateTimeDisplay.jsx
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
        <div className="text-right">
            <p className="text-sm text-gray-500">{formattedTime}</p>
            <p className="text-md text-gray-800 font-semibold">{formattedDate}</p>
        </div>
    );
}