// filepath: /Users/tylerdickenson/Projects/finance-app-3.0/social-finance-app/resources/js/Components/Post.jsx
import React from 'react';
import Comment from './Comment';
import { useForm } from '@inertiajs/react';
import DateTimeDisplay from './DateTimeDisplay';

export default function Post({ post, currentUserId }) {
    const { data, setData, post: submit, processing, errors } = useForm({
        content: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        submit(route('comments.store', { post_id: post.id }), {
            preserveScroll: true,
            onSuccess: () => setData('content', ''),
        });
    };

    return (
        <div className="mb-6 p-6 border border-gray-300 rounded-lg shadow-sm">
            <div className="flex justify-between mb-4">
                <div className="flex items-center">
                    <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full mr-2" />
                    <h4 className="text-2xl font-bold">{post.user.name}</h4>
                </div>
                <DateTimeDisplay timestamp={post.created_at} />
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
                        <form onSubmit={handleSubmit} className="mt-4">
                            <textarea
                                name="content"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-md"
                                rows="3"
                                placeholder="Add a comment..."
                            ></textarea>
                            {errors.content && <div className="text-red-600">{errors.content}</div>}
                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-2 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-md font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Add Comment
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}