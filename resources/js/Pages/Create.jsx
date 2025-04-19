import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import FileUpload from '@/Components/FileUpload';

export default function Create() {
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
        <AuthenticatedLayout header="Create a new post below">
            <Head title="New Post" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg bg-neutral-50 border-gray-200 border-2 dark:bg-slate-700 dark:border-gray-400">
                        <div className="p-6 text-gray-900">
                            {/* Form for creating a post */}
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div>
                                    <label htmlFor="title" className="block text-lg ml-2 font-extrabold text-gray-700 dark:text-white">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-500 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.title && <div className="text-red-600 dark:text-red-500 mt-1">{errors.title}</div>}
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="content" className="block text-lg ml-2 font-extrabold text-gray-700 dark:text-white">
                                        Description
                                    </label>
                                    <textarea
                                        name="content"
                                        id="content"
                                        rows="4"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-500 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm resize-none"
                                        
                                    ></textarea>
                                    {errors.content && <div className="text-red-600 dark:text-red-500 mt-1">{errors.content}</div>}
                                </div>
                                <FileUpload
                                    label="Image"
                                    name="image"
                                    value={data.image}
                                    onChange={handleFileChange}
                                    error={errors.image}
                                />
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-600 dark:hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Create Post
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