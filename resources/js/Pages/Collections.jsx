import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import LockClosedIcon from '@/Components/Icons/LockClosedIcon';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';

export default function Collections({ auth, collections: initialCollections }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        description: '',
        is_private: false, 
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const sortedCollections = useMemo(() => {
        if (!Array.isArray(initialCollections)) {
            console.warn("Collections prop is not an array:", initialCollections);
            return [];
        }
        const result = [...initialCollections];
        result.sort(function(a, b) {
            if(a.name === 'Liked Posts') return -1;
            if(b.name === 'Liked Posts') return 1;
            if(a.name < b.name) return -1;
            if(a.name > b.name) return 1;
            return 0;
        });
        return result;
    }, [initialCollections]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('collections.store'), {
            onSuccess: () => { 
                reset();
                setIsModalOpen(false);
            },
            onError: (errs) => {
                console.error("Error creating collection:", errs);
            }
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    return (
        <AuthenticatedLayout user={auth?.user} header="My Collections">
            <Head title="Collections" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Add New Collection Card */}
                        <div 
                            onClick={() => setIsModalOpen(true)}
                            className="relative h-full bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-dashed border-gray-300 dark:border-gray-700 cursor-pointer group"
                        >
                            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 group-hover:bg-blue-500 dark:group-hover:bg-gray-400 transition-colors"></div>
                            
                            <div className="p-5 flex flex-col items-center justify-center text-center">
                                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-gray-400/75 flex items-center justify-center mb-4">      
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-gray-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">
                                    Create A New Collection
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                                    Group your favorite posts into a collection
                                </p>
                            </div>
                        </div>

                        {/* Collection Cards */}
                        {sortedCollections.map((collection) => (
                            <Link
                                key={collection.id}
                                href={route('collections.show', { id: collection.id })}
                                className="group"
                            >
                                <div className={`relative h-full bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md group-hover:shadow-lg transition-all duration-300 overflow-hidden border ${
                                    collection.name === 'Liked Posts'
                                        ? 'border-blue-300 dark:border-blue-700'
                                        : 'border-gray-200 dark:border-gray-700'
                                }`}
                                >
                                    <div className={`h-2 w-full ${
                                        collection.name === 'Liked Posts'
                                            ? 'bg-blue-500 dark:group-hover:bg-blue-200'
                                            : 'bg-gray-200 dark:bg-gray-700 group-hover:bg-blue-500 dark:group-hover:bg-gray-400'
                                    } transition-colors`}></div>
                                    
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {collection.name}
                                            </h3>
                                            {collection.is_private ? (
                                                <LockClosedIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                            ) : null}
                                        </div>
                                        
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 min-h-[40px]">
                                            {collection.description || "No description"}
                                        </p>
                                        
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-auto">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            <span>
                                                {collection.posts_count} {collection.posts_count === 1 ? 'post' : 'posts'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    
                </div>

                <Modal show={isModalOpen} onClose={closeModal}>
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Create A New Collection
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <InputLabel htmlFor="name" value="Collection Name" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-slate-700/50 focus:border-blue-500 focus:ring-blue-500 dark:text-white"
                                    placeholder="e.g. Investment Tips"
                                    autoFocus
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div className="mb-5">
                                <InputLabel htmlFor="description" value="Description (Optional)" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" />
                                <TextArea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-slate-700/50 focus:border-blue-500 focus:ring-blue-500 dark:text-white"
                                    placeholder="Give this collection a description."
                                    rows={3}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} className="mt-1" />
                            </div>

                            <div className="mb-6">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="is_private"
                                        checked={data.is_private}
                                        onChange={(e) => setData('is_private', e.target.checked)}
                                        className="text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <div className="ml-3 text-sm">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Make this collection private</span>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Only you will be able to see this collection.</p>
                                    </div>
                                </label>
                                <InputError message={errors.is_private} className="mt-1" />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 "
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Creating...' : 'Create Collection'}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}