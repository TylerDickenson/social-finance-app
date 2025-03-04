import React from 'react';
import Comment from './Comment';
import DateTimeDisplay from './DateTimeDisplay';
import { useForm } from '@inertiajs/react';

export default function Post({ post, currentUserId }) {
    const { data, setData, post: postComment, delete: deletePost, processing } = useForm({
        content: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        postComment(route('comments.store', { postId: post.id }), {
            preserveScroll: true,
            onSuccess: () => setData('content', ''),
        });
    };

    const handleDeletePost = () => {
        deletePost(route('posts.destroy', { id: post.id }), {
            preserveScroll: true,
        });
    };

    return (
        <div className="mb-6 p-6 border border-gray-300 rounded-lg shadow-sm">
            <div className="flex justify-between mb-4">
                <div className="flex items-center">
                    <img src={post.user.avatar_url} alt={post.user.name} className="w-16 h-16 rounded-full mr-2" />
                    <h4 className="text-3xl font-bold pl-2">{post.user.name}</h4>
                </div>
                <DateTimeDisplay timestamp={post.created_at} />
            </div>
            <hr className="my-4 border-gray-300" />
            <div className="flex">
                {post.image && (
                    <img src={post.image} alt={post.title} className="mb-4 max-w-full h-auto rounded-lg" style={{ maxWidth: '300px', objectFit: 'cover' }} />
                )}
                <div className="ml-6 flex-1 relative">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold">{post.title}</h3>
                            <p className="text-lg">{post.content}</p>
                        </div>
                        {post.user.id === currentUserId && (
                            <button
                                onClick={handleDeletePost}
                                className="text-red-600 hover:text-red-800 ml-4 self-end"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 6h18v2H3V6zm2 2h14v14H5V8zm4-4h6v2H9V4z" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <hr className="my-4 border-gray-300" />
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold">Comments</h4>
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment) => (
                                <Comment key={comment.id} comment={comment} canDelete={comment.user.id === currentUserId} />
                            ))
                        ) : (
                            <p className="text-md text-gray-600">No comments available.</p>
                        )}
                        <form onSubmit={handleSubmit} className="mt-4 relative">
                            <textarea
                                name="content"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-md resize-none"
                                rows="3"
                                placeholder="Add a comment..."
                            ></textarea>
                            <button
                                type="submit"
                                disabled={processing}
                                className="absolute bottom-4 right-2 inline-flex justify-center rounded-md border border-transparent bg-blue-400 py-2 px-4 text-md font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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