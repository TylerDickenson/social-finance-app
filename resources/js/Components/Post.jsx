import React, { useRef, useState } from 'react';
import axios from 'axios';
import Comment from './Comment';
import DateTimeDisplay from './DateTimeDisplay';
import FollowButton from './FollowButton';
import LikeButton from './LikeButton';
import DeleteIcon from './Icons/DeleteIcon';
import { Link } from '@inertiajs/react';

export default function Post({ post, currentUserId, onFollowChange, onPostDelete }) {
    const [comments, setComments] = useState(post.comments);
    const [commentContent, setCommentContent] = useState('');
    const [processing, setProcessing] = useState(false);
    const likeButtonRef = useRef(null);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            const response = await axios.post(route('comments.store'), {
                content: commentContent,
                postId: post.id
            });
            setComments(prevComments => [...prevComments, response.data.comment]);
            setCommentContent('');
        } catch (error) {
            console.error('Error creating comment:', error);
        } finally {
            setProcessing(false);
        }
    };

    const handleCommentUpdate = (commentId, updatedComment) => {
        setComments(prevComments =>
            prevComments.map(comment =>
                comment.id === commentId
                    ? { ...comment, ...updatedComment }
                    : comment
            )
        );
    };

    const handleCommentDelete = (commentId) => {
        setComments(prevComments =>
            prevComments.filter(comment => comment.id !== commentId)
        );
    };

    const handleDeletePost = async () => {
        try {
            await axios.delete(route('posts.destroy', { id: post.id }));
            // Call the callback to remove the post from the parent state
            if (onPostDelete) {
                onPostDelete(post.id);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleImageDoubleTap = () => {
        if (likeButtonRef.current) {
            likeButtonRef.current.toggleLike();
        }
    };

    return (
        <div className="mb-6 p-6 border border-gray-300 rounded-lg shadow-sm">
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
                            {/* Link for Name */}
                            <Link href={route('profile.show', { id: post.user.id })} className="text-3xl font-bold"> 
                                {post.user.name}
                            </Link>
                        </div>
                        {post.user.id !== currentUserId && (
                                <FollowButton className="flex mb-5" userId={post.user.id} isFollowing={post.user.is_following} onFollowChange={onFollowChange} />
                            )}
                    </div>
                <div className="flex items-center space-x-4">
                    {post.user.id === currentUserId && (
                        <button
                            onClick={handleDeletePost}
                            className="text-red-600 hover:text-red-800 transition-colors"
                        >
                            <DeleteIcon className="w-6 h-6" />
                        </button>
                    )}
                    <DateTimeDisplay timestamp={post.created_at} />
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
                            maxWidth: '300px', // Limit the width to 300px
                            maxHeight: '1000px', // Limit the height to 1000px
                            objectFit: 'contain', // Maintain aspect ratio without stretching
                            width: 'auto', // Allow the width to adjust automatically
                            height: 'auto', // Allow the height to adjust automatically
                        }}
                        onDoubleClick={handleImageDoubleTap}
                    />
                )}
                <div className="ml-6 flex-1 relative">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold">{post.title}</h3>
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
                        <h4 className="text-lg font-semibold mt-4">Comments</h4>
                        {comments && comments.length > 0 ? (
                            comments.map((comment) => (
                                <Comment
                                    key={comment.id}
                                    comment={comment}
                                    canEdit={comment.user.id === currentUserId}
                                    canDelete={comment.user.id === currentUserId}
                                    onCommentUpdate={handleCommentUpdate}
                                    onCommentDelete={handleCommentDelete}
                                />
                            ))
                        ) : (
                            <p className="text-md text-gray-600">No comments available.</p>
                        )}
                        <form onSubmit={handleSubmitComment} className="mt-4 relative">
                            <textarea
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-md resize-none"
                                rows="3"
                                placeholder="Add a comment..."
                            ></textarea>
                            <button
                                type="submit"
                                disabled={processing}
                                className="absolute bottom-4 right-2 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-md font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2"
                            >
                                Post Comment
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}