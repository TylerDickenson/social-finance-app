import React from 'react';
import Comment from './Comment';
import DateTimeDisplay from './DateTimeDisplay';
import { useForm } from '@inertiajs/react';

export default function UserPosts({ posts, currentUserId }) {
    return (
        <div>
            {posts.map(post => (
                <div key={post.id} className="mb-6 p-6 border border-gray-300 rounded-lg shadow-sm">
                    <div className="flex justify-between mb-4">
                        <div className="flex items-center">
                            <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full mr-2" />
                            <h4 className="text-2xl font-bold">{post.user.name}</h4>
                        </div>
                        <DateTimeDisplay timestamp={post.created_at} />
                        {post.user.id === currentUserId && (
                            <button
                                onClick={() => deletePost(post.id)}
                                className="text-red-600 hover:text-red-800"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 6h18v2H3V6zm2 2h14v14H5V8zm4-4h6v2H9V4z" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <hr className="my-4 border-gray-300" />
                    <div className="flex">
                        {post.image && (
                            <img src={post.image} alt={post.title} className="mb-4 max-w-full h-auto rounded-lg" style={{ maxWidth: '300px', objectFit: 'cover' }} />
                        )}
                        <div className="ml-6 flex-1">
                            <h3 className="text-xl font-bold">{post.title}</h3>
                            <p className="text-lg">{post.content}</p>
                            <hr className="my-4 border-gray-300" />
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">Comments</h4>
                                {post.comments.length > 0 ? (
                                    post.comments.map((comment) => (
                                        <Comment key={comment.id} comment={comment} canDelete={comment.user.id === currentUserId} />
                                    ))
                                ) : (
                                    <p className="text-md text-gray-600">No comments available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}