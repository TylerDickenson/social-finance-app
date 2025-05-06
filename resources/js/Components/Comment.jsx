import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import DateTimeDisplay from './DateTimeDisplay';
import LikeButton from './LikeButton';
import DeleteIcon from './Icons/DeleteIcon';
import EditIcon from './Icons/EditIcon';
import { Link } from '@inertiajs/react';

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
            onCommentUpdate(comment.id, response.data.comment);
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
        <div className="mt-2 p-4 ">
            <div className="flex justify-between mb-2">
                <div className="flex items-center">
                    <img src={comment.user.avatar_url} alt={comment.user.name} className="w-8 h-8 rounded-full mr-2" />
                    <h5 className="text-md font-semibold dark:text-white">{comment.user.name}</h5>
                </div>
                <DateTimeDisplay timestamp={comment.created_at} />
            </div>

            {isEditing ? (
                <form onSubmit={handleUpdate} className="relative mb-2" ref={editRef}> 
                     <div className="flex">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md dark:bg-slate-700/50 dark:text-white"
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
                                className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 text-md font-medium text-white shadow-sm hover:bg-gray-700 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 w-20"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <p className="text-md dark:text-white mb-2"> 
                    {comment.content} {comment.updated_at !== comment.created_at && <span className="text-sm text-gray-500 dark:text-gray-400">(edited)</span>}
                </p>
            )}

            <div className="flex items-center justify-between mt-2">
   
                <div className="flex items-center space-x-4"> 
                    <LikeButton
                        likeableId={comment.id}
                        likeableType="comments"
                        initialLikesCount={comment.likes_count}
                        initialIsLiked={comment.is_liked_by_user}
                    />
                    {comment.tags && comment.tags.length > 0 && (
                        <div className="flex flex-wrap items-center space-x-1 mt-2"> 
                            {comment.tags.map((tag) => (
                                <Link
                                    key={tag.id}
                                    href={route('tags.show', { tagName: tag.name })}
                                    className="inline-block text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-500 dark:border-blue-400 rounded px-1.5 py-0.5 hover:bg-blue-100 dark:hover:bg-blue-900"
                                >
                                    ${tag.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {(canEdit || canDelete) && (
                    <div className="flex items-center space-x-2">
                        {canEdit && (
                            <button
                                onClick={handleEdit}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                aria-label="Edit comment"
                            >
                                <EditIcon className="h-5 w-5" />
                            </button>
                        )}
                        {canDelete && (
                            <button
                                onClick={handleDelete}
                                disabled={processing}
                                className="text-red-600 hover:text-red-800 dark:text-red-400"
                                aria-label="Delete comment"
                            >
                                <DeleteIcon className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}