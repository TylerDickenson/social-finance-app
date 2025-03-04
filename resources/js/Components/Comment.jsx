import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import DateTimeDisplay from './DateTimeDisplay';

export default function Comment({ comment, canDelete }) {
    const { data, setData, patch, delete: destroy, processing } = useForm({
        content: comment.content,
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = () => {
        destroy(route('comments.destroy', { id: comment.id }), {
            preserveScroll: true,
        });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setData('content', comment.content);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        patch(route('comments.update', { id: comment.id }), {
            preserveScroll: true,
            onSuccess: () => setIsEditing(false),
        });
    };

    return (
        <div className="relative mt-2 p-3 border border-gray-200 rounded-lg">
            <div className="flex justify-between mb-2">
                <div className="flex items-center">
                    <img src={comment.user.avatar_url} alt={comment.user.name} className="w-8 h-8 rounded-full mr-2" />
                    <h5 className="text-md font-semibold">{comment.user.name}</h5>
                </div>
                <DateTimeDisplay timestamp={comment.created_at} />
            </div>
            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <textarea
                        name="content"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-md"
                        rows="3"
                    ></textarea>
                    <div className="mt-2 flex space-x-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-md font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-md font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-md">
                    {comment.content} {comment.updated_at !== comment.created_at && <span className="text-sm text-gray-500">(edited)</span>}
                </p>
            )}
            {canDelete && (
                <div className="absolute bottom-2 right-2 flex items-center space-x-2"> {/* Added items-center to align icons */}
                    <button
                        onClick={handleEdit}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM4 12v4h4v-2H6v-2H4z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={processing}
                        className="text-red-600 hover:text-red-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 6h18v2H3V6zm2 2h14v14H5V8zm4-4h6v2H9V4z" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}