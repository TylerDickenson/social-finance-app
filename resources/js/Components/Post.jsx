import React, { useRef, useState, memo, useCallback } from 'react';
import axios from 'axios';
import Comment from './Comment';
import DateTimeDisplay from './DateTimeDisplay';
import FollowButton from './FollowButton';
import LikeButton from './LikeButton';
import LinkIcon from './Icons/LinkIcon';
import { Link } from '@inertiajs/react';
import CollectionModal from './CollectionModal';
import { Transition } from '@headlessui/react';

export default memo(function Post({ post, currentUserId, onFollowChange, onPostDelete, onPostRemove, showAllComments }) {
    const [comments, setComments] = useState(post.comments || []);
    const [commentContent, setCommentContent] = useState('');
    const [processing, setProcessing] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [collections, setCollections] = useState([]);
    const likeButtonRef = useRef(null);
    const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);
    const [commentsCount, setCommentsCount] = useState(post.comments?.length || 0);

    const handleSubmitComment = useCallback(async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            const response = await axios.post(route('comments.store'), {
                content: commentContent,
                postId: post.id,
            });
            
            // Update the displayed comments (limited to 10 if not showing all)
            setComments((prevComments) => {
                const updatedComments = [response.data.comment, ...prevComments];
                return showAllComments 
                    ? updatedComments 
                    : updatedComments.slice(0, 10);
            });
            
            // Always increment the total count
            setCommentsCount(prevCount => prevCount + 1);
            
            setCommentContent('');
        } catch (error) {
            console.error('Error creating comment:', error);
        } finally {
            setProcessing(false);
        }
    }, [post.id, commentContent, showAllComments]);

    const fetchCollections = useCallback(async () => {
        try {
            const response = await axios.get(route('collections.index'));
            setCollections(response.data.collections || []);
            setShowModal(true);
        } catch (error) {
            console.error('Error - fetching the collections:', error);
            setCollections([]);
        }
    }, []);

    const handleAddToCollection = useCallback(async (collectionId) => {
        try {
            await axios.post(route('collections.addPost'), {
                collection_id: collectionId,
                post_id: post.id,
            });
            setShowModal(false);
            setDropdownOpen(false);
        } catch (error) {
            console.error('Error - adding a post to the collection:', error);
        }
    }, [post.id]);
    
    const handleRemoveFromCollection = async (collectionId) => {
        try {
            await axios.post(route('collections.removePost'), {
                collection_id: collectionId,
                post_id: post.id,
            });
            setShowModal(false);
            setDropdownOpen(false);
            if (onPostRemove) {
                onPostRemove(post.id);
            }
        } catch (error) {
            console.error('Error removing post from collection:', error);
        }
    };

    const isPostInCollection = (collection) => {
        if (!collection || !Array.isArray(collection.posts)) {
            return false;
        }
        return collection.posts.some((postInCollection) => postInCollection.id === post.id);
    };

    const handleSharePost = () => {
        const postUrl = route('posts.show', { id: post.id });
        navigator.clipboard.writeText(postUrl)
            .then(() => {
                alert('Post link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy link: ', err);
                alert('Failed to copy link. Please try again.');
            });
        toggleDropdown();
    };

    const toggleDropdown = useCallback(() => {
        setDropdownOpen((prev) => !prev);
    }, []);

    const handleDeletePost = useCallback(async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        
        try {
            await axios.delete(route('posts.destroy', { id: post.id }));
            if (onPostDelete) {
                onPostDelete(post.id);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    }, [post.id, onPostDelete]);

    return (
        <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white dark:bg-slate-800 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
            
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                    <Link 
                        href={post.is_anonymous && post.user.id !== currentUserId 
                            ? '#' // Disable link for anonymous posts for other users
                            : route('profile.show', { id: post.user.id })} 
                        className={`group ${post.is_anonymous && post.user.id !== currentUserId ? 'cursor-default' : ''}`}
                        onClick={(e) => post.is_anonymous && post.user.id !== currentUserId && e.preventDefault()}
                    >
                        <img
                            src={post.user.avatar_url}
                            alt={post.is_anonymous && post.user.id !== currentUserId ? 'Anonymous' : post.user.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-500 transition-all duration-300"
                        />
                    </Link>
                    <div>
                        <Link 
                            href={post.is_anonymous && post.user.id !== currentUserId 
                                ? '#' // Disable link for anonymous posts for other users
                                : route('profile.show', { id: post.user.id })}
                            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                            onClick={(e) => post.is_anonymous && post.user.id !== currentUserId && e.preventDefault()}
                        >
                            {post.is_anonymous && post.user.id !== currentUserId ? 'Anonymous' : post.user.name}
                            {post.is_anonymous && post.user.id === currentUserId ? (
                                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(You, posted anonymously)</span>
                            ) : null}
                        </Link>
                        <DateTimeDisplay 
                            timestamp={post.created_at} 
                            className="text-sm text-gray-500 dark:text-gray-400" 
                        />
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    {currentUserId && 
                        post.user.id !== currentUserId && 
                        (!post.is_anonymous || post.user.id === currentUserId) && (
                            <FollowButton
                                userId={post.user.id}
                                isFollowing={post.user.is_following}
                                onFollowChange={onFollowChange}
                                className="mr-2"
                            />
                            )}
                        
                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Post options"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 11 0-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 11 0-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 11 0-1.5.75.75 0 010 1.5z" />
                            </svg>
                        </button>
                        
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg z-10 border border-gray-100 dark:border-gray-600 overflow-hidden">
                                <button 
                                    onClick={fetchCollections} 
                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                    </svg>
                                    Add to Collection
                                </button>
                                <button
                                    onClick={handleSharePost}
                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-green-400/50 group "
                                >
                                    <LinkIcon className="w-4 h-4 mr-2 text-gray-500 group-hover:text-green-600 dark:text-gray-400 dark:group-hover:text-green-400 " />
                                    Share Post
                                </button>
                                
                                {post.user.id === currentUserId && (
                                    <button 
                                        onClick={handleDeletePost} 
                                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                        Delete Post
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map(tag => (
                            <Link
                                key={tag.id}
                                href={route('tags.show', { tagName: tag.name })}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors"
                            >
                                ${tag.name}
                            </Link>
                        ))}
                    </div>
                )}
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>
                
                {post.image_url && (
                    <div className="mt-4 rounded-lg overflow-hidden">
                        <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-auto object-cover cursor-pointer hover:opacity-95 transition-opacity"
                            onDoubleClick={() => likeButtonRef.current?.toggleLike()}
                        />
                    </div>
                )}
            </div>
            
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-700/50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <LikeButton
                        ref={likeButtonRef}
                        likeableId={post.id}
                        likeableType="posts"
                        initialLikesCount={post.likes_count}
                        initialIsLiked={post.is_liked_by_user}
                    />
                    
                    <button 
                        onClick={() => setIsCommentBoxVisible(prev => !prev)}
                        className="flex items-center mt-2 text-gray-500 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                        </svg>
                        <span className="text-md font-bold text-white">{commentsCount}</span>
                    </button>
                </div>
                
                <button 
                    onClick={fetchCollections}
                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                    <span>Save</span>
                </button>
            </div>
            
            <div className="border-t border-gray-100 dark:border-gray-700 overflow-hidden">
                <Transition
                    show={isCommentBoxVisible}
                    enter="transition-all duration-300 ease-out"
                    enterFrom="opacity-0 max-h-0"
                    enterTo="opacity-100 max-h-[2000px]"
                    leave="transition-all duration-200 ease-in"
                    leaveFrom="opacity-100 max-h-[2000px]"
                    leaveTo="opacity-0 max-h-0"
                >
                    <div>
                        <form onSubmit={handleSubmitComment} className="p-4">
                            <div className="flex items-start">
                                <textarea
                                    value={commentContent}
                                    onChange={(e) => setCommentContent(e.target.value)}
                                    className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-slate-700/50 dark:text-white resize-none focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                    placeholder="Write a comment..."
                                    required
                                />
                                <div className="ml-3 flex flex-col gap-2">
                                    <button 
                                        type="submit" 
                                        disabled={processing} 
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Posting...' : 'Post'}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsCommentBoxVisible(false)} 
                                        className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                        
                        {comments && comments.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">

                                {(showAllComments ? comments : comments
                                    .slice()
                                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                    .slice(0, 10))
                                    .map((comment) => (
                                    <Comment
                                        key={comment.id}
                                        comment={comment}
                                        canEdit={currentUserId && comment.user.id === currentUserId}
                                        canDelete={currentUserId && comment.user.id === currentUserId}
                                        onCommentUpdate={(commentId, updatedComment) =>
                                            setComments((prev) =>
                                                prev.map((c) => (c.id === commentId ? { ...c, ...updatedComment } : c))
                                            )
                                        }
                                        onCommentDelete={(commentId) => {
                                            setComments((prev) => prev.filter((c) => c.id !== commentId));
                                            setCommentsCount((prevCount) => prevCount - 1);
                                        }}
                                    />
                                ))}
                                
                                {!showAllComments && (
                                    <div className="p-3 text-center">
                                        <button 
                                            onClick={() => window.location.href = route('posts.show', { id: post.id })}
                                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                        >
                                            View all {commentsCount} comments
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                No comments yet. Be the first to comment!
                            </div>
                        )}
                    </div>
                </Transition>
            </div>
            <CollectionModal 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                collections={collections}
                postId={post.id}
                onAddToCollection={handleAddToCollection}
                onRemoveFromCollection={handleRemoveFromCollection}
                isPostInCollection={isPostInCollection}
            />
        </div>
    );
});