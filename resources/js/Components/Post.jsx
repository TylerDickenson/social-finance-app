import React, { useRef, useState } from 'react';
import axios from 'axios';
import Comment from './Comment';
import DateTimeDisplay from './DateTimeDisplay';
import FollowButton from './FollowButton';
import LikeButton from './LikeButton';
import { Link } from '@inertiajs/react';

export default function Post({ post, currentUserId, onFollowChange, onPostDelete, onPostRemove }) {
    const [comments, setComments] = useState(post.comments);
    const [commentContent, setCommentContent] = useState('');
    const [processing, setProcessing] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false); 
    const [showModal, setShowModal] = useState(false); 
    const [collections, setCollections] = useState([]); 
    const likeButtonRef = useRef(null);
    const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false); 
    

    const handleRemoveFromCollection = async (collectionId) => {
        try {
            const response = await axios.post(route('collections.removePost'), {
                collection_id: collectionId,
                post_id: post.id,
            });
    
            console.log(response.data.message); 
            setDropdownOpen(false); 
            setShowModal(false); 
            
            if (onPostRemove) {
                onPostRemove(post.id);
            }

        } catch (error) {
            console.error('Error removing post from collection:', error);
        }
    };


    const handleSubmitComment = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            const response = await axios.post(route('comments.store'), {
                content: commentContent,
                postId: post.id,
            });
            setComments((prevComments) => [...prevComments, response.data.comment]);
            setCommentContent('');
            setIsCommentBoxVisible(false);
        } catch (error) {
            console.error('Error creating comment:', error);
        } finally {
            setProcessing(false);
        }
    };

    const fetchCollections = async () => {
        try {
            const response = await axios.get(route('collections.index'));
            console.log('Fetched collections:', response.data.collections); 
            setCollections(response.data.collections || []); 
            setShowModal(true); 
        } catch (error) {
            console.error('Error fetching collections:', error);
            setCollections([]); 
        }
    };

    const isPostInCollection = (collection) => {
        if (!Array.isArray(collection.posts)) {
            console.log(`Collection ${collection.name} has no posts or posts is not an array.`);
            return false;
        }
    
        const isInCollection = collection.posts.some((postInCollection) => postInCollection.id === post.id);
        console.log(`Post ${post.id} is ${isInCollection ? '' : 'not '}in collection ${collection.name}`);
        return isInCollection;
    };

    const handleAddToCollection = async (collectionId) => {
        try {
            const response = await axios.post(route('collections.addPost'), {
                collection_id: collectionId,
                post_id: post.id,
            });

            console.log(response.data.message); 
            setShowModal(false); 
            setDropdownOpen(false); 
        } catch (error) {
            console.error('Error adding post to collection:', error);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const handleDeletePost = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;
    
        try {
            await axios.delete(route('posts.destroy', { id: post.id }));
            if (onPostDelete) {
                onPostDelete(post.id); // Notify parent component about the deletion
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <div className="mb-6 p-6 border-2 border-gray-200 rounded-3xl shadow-sm bg-neutral-50 dark:bg-slate-700 dark:border-gray-400" >
            {/* Post Header */}
            <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-4 ml-2">
                    <div className="flex items-center hover:scale-105 transition-transform duration-500">
                        <Link href={route('profile.show', { id: post.user.id })}>
                            <img
                                src={post.user.avatar_url}
                                alt={post.user.name}
                                className="w-16 h-16 rounded-full mr-2 cursor-pointer"
                            />
                        </Link>
                        <Link href={route('profile.show', { id: post.user.id })} className="text-3xl font-bold dark:text-gray-50">
                            {post.user.name}
                        </Link>
                    </div>
                    {post.user.id !== currentUserId && (
                        <FollowButton
                            className="flex mb-5"
                            userId={post.user.id}
                            isFollowing={post.user.is_following}
                            onFollowChange={onFollowChange}
                        />
                    )}
                </div>
                <div className="flex items-center space-x-4 relative">
                    <DateTimeDisplay timestamp={post.created_at} />

                    {/* Dropdown Menu */}
                    <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="-ml-2 mt-1 text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-gray-100 hoverfocus:outline-none"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-6 h-6"
                        >
                            <circle cx="12" cy="5" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="19" r="2" />
                        </svg>
                    </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                <ul className="py-1">
                                    <li>
                                        <button
                                            onClick={fetchCollections}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Add to Collection
                                        </button>
                                    </li>
                                    {post.user.id === currentUserId && (
                                        <li>
                                            <button
                                                onClick={handleDeletePost}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                Delete Post
                                            </button>
                                        </li>
                                    )}

                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <hr className="my-4 border-gray-300" />
            <div className="flex">
                {post.image_url && (
                    <img
                        src={post.image_url}
                        alt={post.title}
                        className="mb-4 rounded-lg cursor-pointer"
                        style={{
                            maxWidth: '300px',
                            maxHeight: '1000px',
                            objectFit: 'contain',
                            width: 'auto',
                            height: 'auto',
                        }}
                        onDoubleClick={() => likeButtonRef.current?.toggleLike()}
                    />
                )}
                <div className="ml-6 flex-1 relative">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 dark:text-gray-50">
                            <h3 className="text-xl font-bold ">{post.title}</h3>
                            <p className="text-lg mt-2">{post.content}</p>
                        </div>
                        <div className="ml-4">
                            <LikeButton
                                ref={likeButtonRef}
                                likeableId={post.id}
                                likeableType="posts"
                                initialLikesCount={post.likes_count}
                                initialIsLiked={post.is_liked_by_user}
                            />
                        </div>
                    </div>
                    <hr className="my-4 border-gray-300" />
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mt-4 dark:text-white">Comments</h4>
                        {comments && comments.length > 0 ? (
                            comments.map((comment) => (
                                <Comment
                                    key={comment.id}
                                    comment={comment}
                                    canEdit={comment.user.id === currentUserId}
                                    canDelete={comment.user.id === currentUserId}
                                    onCommentUpdate={(commentId, updatedComment) =>
                                        setComments((prev) =>
                                            prev.map((c) => (c.id === commentId ? { ...c, ...updatedComment } : c))
                                        )
                                    }
                                    onCommentDelete={(commentId) =>
                                        setComments((prev) => prev.filter((c) => c.id !== commentId))
                                    }
                                />
                            ))
                        ) : (
                            <p className="text-md text-gray-600 dark:text-gray-100">No comments available.</p>
                        )}
                         {/* Add Comment Section */}
                        {!isCommentBoxVisible ? (
                            <button
                                onClick={() => setIsCommentBoxVisible(true)}
                                className="mt-4 ml-3 text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Add a comment...
                            </button>
                        ) : (
                            <form onSubmit={handleSubmitComment} className="mt-4 relative flex items-start">
                                <textarea
                                    value={commentContent}
                                    onChange={(e) => setCommentContent(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-md resize-none dark:bg-gray-500 dark:text-white"
                                    rows="3"
                                    placeholder="Write your comment here..."
                                ></textarea>
                                <div className="flex flex-col items-center justify-start ml-2 space-y-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 py-2 px-4 text-md font-medium text-white shadow-sm hover:bg-blue-600 dark:hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-20"
                                    >
                                        Post
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsCommentBoxVisible(false)}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-500 py-2 px-4 text-md font-medium text-white shadow-sm hover:bg-gray-600 dark:hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 w-20"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for Managing Collections */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Manage Collections</h2>
                        {Array.isArray(collections) && collections.length > 0 ? (
                            <ul>
                                {collections
                                    .filter((collection) => collection.name !== 'Liked Posts')
                                    .map((collection) => (
                                        <li key={collection.id} className="mb-2">
                                            {isPostInCollection(collection) ? (
                                                <button
                                                    onClick={() => handleRemoveFromCollection(collection.id)}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                >
                                                    Remove from {collection.name}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleAddToCollection(collection.id)}
                                                    className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                                                >
                                                    Add to {collection.name}
                                                </button>
                                            )}
                                        </li>
                                    ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">No collections available.</p>
                        )}
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}