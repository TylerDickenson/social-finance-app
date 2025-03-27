import React, { useState } from 'react';
import axios from 'axios';
import DateTimeDisplay from './DateTimeDisplay';
import LikeButton from './LikeButton';
import DeleteIcon from './Icons/DeleteIcon';
import EditIcon from './Icons/EditIcon';

export default function Comment({ comment, canEdit, canDelete, onCommentUpdate, onCommentDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(comment.content);
    const [processing, setProcessing] = useState(false);

    const handleDelete = async () => {
        setProcessing(true);
        try {
            await axios.delete(route('comments.destroy', { id: comment.id }));
            onCommentDelete(comment.id);
        } catch (error) {
            console.error('Error deleting comment:', error);
        } finally {
            setProcessing(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setContent(comment.content);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            const response = await axios.patch(route('comments.update', { id: comment.id }), {
                content: content
            });
            // Pass the entire updated comment data including timestamps
            onCommentUpdate(comment.id, {
                ...comment,
                content: content,
                updated_at: new Date().toISOString() // Add current timestamp
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating comment:', error);
        } finally {
            setProcessing(false);
        }
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
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
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
            <LikeButton
                likeableId={comment.id}
                likeableType="comments"
                initialLikesCount={comment.likes_count}
                initialIsLiked={comment.is_liked_by_user}
            />
            {(canEdit || canDelete) && (
                <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                    {canEdit && (
                        <button
                            onClick={handleEdit}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <EditIcon className="h-5 w-5" />
                        </button>
                    )}
                    {canDelete && (
                        <button
                            onClick={handleDelete}
                            disabled={processing}
                            className="text-red-600 hover:text-red-800"
                        >
                            <DeleteIcon className="h-5 w-5" /> 
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}