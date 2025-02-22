// filepath: /Users/tylerdickenson/Projects/finance-app-3.0/social-finance-app/resources/js/Components/Comment.jsx
import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import DateTimeDisplay from './DateTimeDisplay';

export default function Comment({ comment, canDelete }) {
    const { put, delete: destroy, processing } = useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(comment.content);

    const handleDelete = () => {
        destroy(route('comments.destroy', { id: comment.id }), {
            preserveScroll: true,
        });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        put(route('comments.update', { id: comment.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
                console.log('Comment updated successfully');
            },
            onError: (errors) => {
                console.error('Failed to update comment:', errors);
            },
            data: { content },
        });
    };

    return (
        <div className="relative mt-2 p-3 border border-gray-200 rounded-lg">
            <div className="flex justify-between mb-2">
                <div className="flex items-center">
                    <img src={comment.user.avatar} alt={comment.user.name} className="w-8 h-8 rounded-full mr-2" />
                    <h5 className="text-md font-semibold">{comment.user.name}</h5>
                </div>
                <DateTimeDisplay timestamp={comment.created_at} />
            </div>
            {isEditing ? (
                <div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-md"
                        rows="3"
                    ></textarea>
                    <button
                        onClick={handleSave}
                        disabled={processing}
                        className="mt-2 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-1 px-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Save
                    </button>
                </div>
            ) : (
                <p className="text-md">
                    {comment.content} {comment.updated_at !== comment.created_at && <span className="text-sm text-gray-500">(edited)</span>}
                </p>
            )}
            {canDelete && (
                <div className="absolute bottom-2 right-2 flex space-x-2">
                    <button
                        onClick={handleEdit}
                        disabled={processing}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM4 12v4h4l10-10-4-4L4 12z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={processing}
                        className="text-red-600 hover:text-red-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H3a1 1 0 100 2h14a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm2 4a1 1 0 00-1 1v8a1 1 0 102 0V7a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v8a1 1 0 102 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}