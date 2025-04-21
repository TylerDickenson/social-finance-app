import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import FileUpload from '@/Components/FileUpload';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        image: null, 
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        if (data.image) {
            formData.append('image', data.image);
        }
        post(route('posts.store'), {
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    };

    const handleFileChange = (file) => {
        setData('image', file);
    };

    return (
        <AuthenticatedLayout 
            user={auth.user}
            header="Create a new post"
        >
            <Head title="New Post" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white dark:bg-slate-800 dark:border-gray-700 transition-all duration-300">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Share your thoughts</h2>
                            
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="mb-5">
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Give your post a title"
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-slate-700/50 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.title && <div className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.title}</div>}
                                </div>
                                
                                <div className="mb-5">
                                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Content
                                    </label>
                                    <textarea
                                        name="content"
                                        id="content"
                                        rows="6"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        placeholder="What would you like to share? (Use $EXAMPLE to make a tag and $EXAMPLE?price for that tags price if its a stock or cryptocurrency)"
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-slate-700/50 dark:text-white resize-none focus:ring-blue-500 focus:border-blue-500"
                                    ></textarea>
                                    {errors.content && <div className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.content}</div>}
                                </div>
                                
                                <div className="mb-6">
                                    <FileUpload
                                        label="Add an image (optional)"
                                        name="image"
                                        value={data.image}
                                        onChange={handleFileChange}
                                        error={errors.image}
                                    />
                                    {errors.image && <div className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.image}</div>}
                                </div>
                                
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Create Post
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}