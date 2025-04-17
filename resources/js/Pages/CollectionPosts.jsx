import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import Post from '@/Components/Post';
import DeleteIcon from '@/Components/Icons/DeleteIcon'; 
import EditIcon from '@/Components/Icons/EditIcon'; 
import LockClosedIcon from '@/Components/Icons/LockClosedIcon';
import LinkIcon from '@/Components/Icons/LinkIcon';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import axios from 'axios';

export default function CollectionPosts({ collection: initialCollection, posts: initialPosts, auth }) {
    const { errors } = usePage().props;

    const [collection, setCollection] = useState(initialCollection);
    const [posts, setPosts] = useState(initialPosts);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(collection.name);
    const [editDescription, setEditDescription] = useState(collection.description);
    const [editIsPrivate, setEditIsPrivate] = useState(collection.is_private);
    const [processing, setProcessing] = useState(false);
    const [collectionDropdownOpen, setCollectionDropdownOpen] = useState(false);

    const isLikedPostsCollection = collection.name === 'Liked Posts';

    useEffect(() => {
        setCollection(initialCollection);
        setPosts(initialPosts);
        setEditName(initialCollection.name);
        setEditDescription(initialCollection.description);
        setEditIsPrivate(initialCollection.is_private);
        if (isLikedPostsCollection) {
            setIsEditing(false);
            setCollectionDropdownOpen(false);
        }
    }, [initialCollection, initialPosts, isLikedPostsCollection]);

    const handlePostRemove = async (postId) => {
        if (isLikedPostsCollection) {
            alert('Posts cannot be manually removed from the "Liked Posts" collection.');
            return;
        }

        if (confirm('Are you sure you want to remove this post from the collection?')) {
            const originalPosts = [...posts];
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
            try {
                await axios.post(route('collections.removePost'), {
                    collection_id: collection.id,
                    post_id: postId,
                });
            } catch (error) {
                console.error('Error removing post:', error);
                alert('Failed to remove post. Please try again.');
                setPosts(originalPosts);
            }
        }
    };

    const handleUpdateCollection = (e) => {
        e.preventDefault();
        if (isLikedPostsCollection) {
            alert('The "Liked Posts" collection cannot be modified.');
            return;
        }
        setProcessing(true);

        const updateData = {
            name: editName,
            description: editDescription,
            is_private: editIsPrivate,
        };

        router.patch(route('collections.update', { id: collection.id }), updateData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
            },
            onError: (errs) => {
                console.error('Error updating collection:', errs);
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    const handleDeleteCollection = async () => {
        if (isLikedPostsCollection) {
            alert('The "Liked Posts" collection cannot be deleted.');
            return;
        }
        if (confirm('Are you sure you want to delete this collection? This cannot be undone.')) {
            router.delete(route('collections.destroy', { id: collection.id }), {
                onError: (errors) => {
                    console.error('Error deleting collection:', errors);
                    alert(errors.error || 'Failed to delete collection.');
                }
            });
        }
        setCollectionDropdownOpen(false);
    };

    const startEditing = () => {
        setIsEditing(true);
        setCollectionDropdownOpen(false);
    };

    const cancelEdit = () => {
        setEditName(initialCollection.name);
        setEditDescription(initialCollection.description);
        setEditIsPrivate(initialCollection.is_private);
        setIsEditing(false);
    };

    const toggleCollectionDropdown = () => {
        setCollectionDropdownOpen((prev) => !prev);
    };

    const handleShareCollection = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url)
            .then(() => {
                alert('Collection link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy link: ', err);
                alert('Failed to copy link. Please try again.');
            });
        setCollectionDropdownOpen(false);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    {`Collection | ${collection.name}`}
                </div>
            }
        >
            <Head title={collection.name} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 relative">

                            {!isLikedPostsCollection && (
                                <div className="absolute top-6 right-6">
                                    <div className="relative">
                                        <button
                                            onClick={toggleCollectionDropdown}
                                            className="text-gray-600 hover:text-gray-800 focus:outline-none p-1 rounded-full hover:bg-gray-100"
                                            aria-label="Collection options"
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
                                        {collectionDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                                <ul className="py-1">
                                                    <li>
                                                        <button
                                                            onClick={startEditing}
                                                            className="flex items-center w-full text-left px-4 py-2 text-sm text-blue-500 hover:bg-blue-100"
                                                        >
                                                            <EditIcon className="w-4 h-4 mr-2" />
                                                            Edit Collection
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            onClick={handleDeleteCollection}
                                                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                                                        >
                                                            <DeleteIcon className="w-4 h-4 mr-2" />
                                                            Delete Collection
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                             onClick={handleShareCollection}
                                                            className="flex items-center w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-100"
                                                        >
                                                            <LinkIcon className="w-4 h-4 mr-2" />
                                                            Share Collection
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="mb-6 pb-6 border-b border-gray-200">
                                {isEditing && !isLikedPostsCollection ? (
                                    <form onSubmit={handleUpdateCollection} className="space-y-4 mr-16">
                                        <div>
                                            <label htmlFor="collectionName" className="block text-sm font-medium text-gray-700">Name</label>
                                            <input
                                                id="collectionName"
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500'
                                                required
                                            />
                                            <InputError message={errors.name} className="mt-1" />
                                        </div>
                                        <div>
                                            <label htmlFor="collectionDescription" className="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea
                                                id="collectionDescription"
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 resize-y focus:ring-indigo-500 focus:border-indigo-500'
                                                placeholder='Enter collection description...'
                                                rows="3"
                                            ></textarea>
                                            <InputError message={errors.description} className="mt-1" />
                                        </div>

                                        <div className="block">
                                            <label className="flex items-center">
                                                <Checkbox
                                                    name="is_private"
                                                    checked={editIsPrivate}
                                                    onChange={(e) => setEditIsPrivate(e.target.checked)}
                                                />
                                                <span className="ms-2 text-sm text-gray-600">Make this collection private</span>
                                            </label>
                                            <p className="text-xs text-gray-500 ml-6">Only you will be able to see it.</p>
                                            <InputError message={errors.is_private} className="mt-1" />
                                        </div>

                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={cancelEdit}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 border border-gray-300"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className={`px-4 py-2 text-white rounded-md ${processing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                            >
                                                {processing ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="mr-16">
                                        <p className="mt-1 text-gray-600 text-xl">{collection.description || <i>No description provided.</i>}</p>
                                        {collection.is_private ? (
                                            <div className="flex items-center text-medium text-gray-500">
                                                <LockClosedIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                                                <span>This collection is private. Only you can see it.</span>
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>

                            <h2 className="mb-4 text-xl font-semibold">Posts in this Collection</h2>
                            {posts.length > 0 ? (
                                <div className="space-y-6">
                                    {posts.map((post) => (
                                        <Post
                                            key={post.id}
                                            post={post}
                                            auth={auth}
                                            currentUserId={auth.user.id}
                                            collectionId={collection.id}
                                            collectionName={collection.name}
                                            onPostRemove={!isLikedPostsCollection ? () => handlePostRemove(post.id) : undefined}
                                            onFollowChange={() => {}}
                                            onPostDelete={() => {}}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No posts in this collection yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}