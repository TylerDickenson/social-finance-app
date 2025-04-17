import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import DateTimeDisplay from './DateTimeDisplay';
import LikeButton from './LikeButton';
import DeleteIcon from './Icons/DeleteIcon';
import EditIcon from './Icons/EditIcon';

export default function Comment({ comment, canEdit, canDelete, onCommentUpdate, onCommentDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(comment.content);
    const [processing, setProcessing] = useState(false);
    const editRef = useRef(null);

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
            onCommentUpdate(comment.id, {
                ...comment,
                content: content,
                updated_at: new Date().toISOString()
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating comment:', error);
        } finally {
            setProcessing(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (editRef.current && !editRef.current.contains(event.target)) {
                handleCancelEdit();
            }
        };

        if (isEditing) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditing]);

    return (
        <div className="relative mt-2 p-3 border border-gray-200 rounded-2xl">
            <div className="flex justify-between mb-2">
                <div className="flex items-center">
                    <img src={comment.user.avatar_url} alt={comment.user.name} className="w-8 h-8 rounded-full mr-2" />
                    <h5 className="text-md font-semibold dark:text-white">{comment.user.name}</h5>
                </div>
                <DateTimeDisplay timestamp={comment.created_at} />
            </div>
            {isEditing ? (
                <form onSubmit={handleUpdate} className="relative" ref={editRef}>
                    <div className="flex">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-md dark:bg-gray-500 dark:text-white"
                            rows="3"
                            style={{ resize: 'none' }}
                        ></textarea>
                        <div className="flex flex-col items-center justify-start ml-2 space-y-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 py-2 text-md font-medium text-white shadow-sm hover:bg-blue-600 dark:hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-20"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 text-md font-medium text-white shadow-sm hover:bg-gray-600 dark:hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 w-20"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <p className="text-md dark:text-white">
                    {comment.content} {comment.updated_at !== comment.created_at && <span className="text-sm text-gray-500 dark:text-white">(edited)</span>}
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
                            className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                        >
                            <EditIcon className="h-5 w-5" />
                        </button>
                    )}
                    {canDelete && (
                        <button
                            onClick={handleDelete}
                            disabled={processing}
                            className="text-red-600 hover:text-red-800 dark:hover:text-red-400"
                        >
                            <DeleteIcon className="h-5 w-5" /> 
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}