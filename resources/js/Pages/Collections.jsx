import React, { useState, useMemo } from 'react'; // Added useMemo
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react'; // Added router
import DeleteIcon from '@/Components/Icons/DeleteIcon';
import LockClosedIcon from '@/Components/Icons/LockClosedIcon'; // Assuming this exists now
import Checkbox from '@/Components/Checkbox'; // Assuming this exists
import InputLabel from '@/Components/InputLabel'; // Assuming this exists
import TextInput from '@/Components/TextInput'; // Assuming this exists
import TextArea from '@/Components/TextArea'; // Assuming this exists
import PrimaryButton from '@/Components/PrimaryButton'; // Assuming this exists
import Modal from '@/Components/Modal'; // Assuming this exists
import InputError from '@/Components/InputError'; // Assuming this exists
import axios from 'axios';

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
        return [...initialCollections].sort((a, b) => {
            if (a.name === 'Liked Posts') return -1;
            if (b.name === 'Liked Posts') return 1;
            return (a.name || '').localeCompare(b.name || '');
        });
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

    const handleDeleteCollection = (id) => {
        if (confirm('Are you sure you want to delete this collection? This cannot be undone.')) {
            router.delete(route('collections.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    console.log(`Collection ${id} deleted`);
                },
                onError: (errors) => {
                    console.error("Error deleting collection:", errors);
                    alert('Failed to delete collection.');
                }
            });
        }
    };


    return (
        // Pass user prop if AuthenticatedLayout requires it
        <AuthenticatedLayout user={auth?.user} header="My Collections">
            <Head title="Collections" />

            <div className="py-12">
                <div className="relative mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-bold mb-6">Your Collections</h2>

                            <div className="relative">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {sortedCollections.map((collection) => (
                                        <div
                                            key={collection.id}
                                            className={`relative p-4 border ${
                                                collection.name === 'Liked Posts'
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-300'
                                            } rounded-lg shadow hover:shadow-md transition-shadow flex flex-col justify-between`} // Use flex column
                                        >
                                            <div> {/* Content wrapper */}
                                                {collection.name !== 'Liked Posts' && (
                                                    <button
                                                        onClick={() => handleDeleteCollection(collection.id)}
                                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                                                        aria-label="Delete collection"
                                                    >
                                                        <DeleteIcon className="w-5 h-5" />
                                                    </button>
                                                )}

                                                <Link
                                                    href={route('collections.show', { id: collection.id })}
                                                    className="flex items-center text-lg font-semibold text-blue-600 hover:text-blue-800 mb-1"
                                                >
                                                    {collection.name}
                                                    {collection.is_private ? (
                                                        <LockClosedIcon className="w-4 h-4 ml-2 text-gray-500 flex-shrink-0" />
                                                    ) : null}
                                                </Link>
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                    {collection.description || <i>No description</i>}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-auto pt-2">
                                                {collection.posts_count} {collection.posts_count === 1 ? 'post' : 'posts'}
                                            </p>
                                        </div>
                                    ))}
                                    {/* Add New Collection Button - Using dashed style */}
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition h-32"
                                    >
                                        <div className="flex flex-col items-center">
                                            <p className="text-lg font-semibold text-gray-500 mt-2">
                                                Create New Collection
                                            </p>
                                            <span className="text-5xl text-gray-500 -mt-2">+</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Use Modal Component */}
                    <Modal show={isModalOpen} onClose={closeModal}>
                        <form onSubmit={handleSubmit} className="p-6">
                            <h2 className="text-lg font-medium text-gray-900">
                                Create New Collection
                            </h2>
                            <div className="mt-4">
                                <InputLabel htmlFor="name" value="Name" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="off"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="description" value="Description (Optional)" />
                                <TextArea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>
                            <div className="block mt-4">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="is_private"
                                        checked={data.is_private}
                                        onChange={(e) => setData('is_private', e.target.checked)}
                                    />
                                    <span className="ms-2 text-sm text-gray-600">Make this collection private</span>
                                </label>
                                <p className="text-xs text-gray-500 ml-6">Only you will be able to see it.</p>
                                <InputError message={errors.is_private} className="mt-2" />
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button type="button" onClick={closeModal} className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Cancel
                                </button>
                                <PrimaryButton disabled={processing}>
                                    Create Collection
                                </PrimaryButton>
                            </div>
                        </form>
                    </Modal>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}