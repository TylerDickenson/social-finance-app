import React, { useState, useEffect, useRef} from 'react';
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
import LockOpenIcon from '@/Components/Icons/LockOpenIcon';


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
    const dropdownRef = useRef(null);

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
        
        router.delete(route('collections.destroy', { id: collection.id }), {
            onError: (errors) => {
                console.error('Error deleting collection:', errors);
                alert(errors.error || 'Failed to delete collection.');
            }
        });
        
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setCollectionDropdownOpen(false);
            }
        };
        
        if (collectionDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [collectionDropdownOpen]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="w-full flex justify-center items-center px-12">
                    <h1 className="text-3xl md:text-3xl font-bold">
                        <span className="text-gray-500 dark:text-white mr-2">Collection</span>
                        <span className="text-gray-900 dark:text-white">-</span>
                        <span className="text-blue-600 dark:text-white ml-2">{collection.name}</span>
                    </h1>
                </div>
            }
        >
            <Head title={collection.name} />
        
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-8 overflow-visible bg-white dark:bg-slate-800 shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="p-6 text-gray-900 dark:text-white relative">
                            {!isLikedPostsCollection && (
                                <div className="absolute top-6 right-6">
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={toggleCollectionDropdown}
                                            className="rounded-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                                            aria-label="Collection options"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none" 
                                                viewBox="0 0 24 24" 
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            </svg>
                                        </button>
                                        
                                        {collectionDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50">
                                                <ul className="rounded-md shadow-xs">
                                                    <li>
                                                        <button
                                                            onClick={startEditing}
                                                            className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 group"
                                                        >
                                                            <EditIcon className="w-4 h-4 mr-2 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400" />
                                                            Edit Collection
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            onClick={handleShareCollection}
                                                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 group"
                                                        >
                                                            <LinkIcon className="w-4 h-4 mr-2 text-gray-500 group-hover:text-green-600 dark:text-gray-400 dark:group-hover:text-green-400" />
                                                            Share Collection
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            onClick={handleDeleteCollection}
                                                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        >
                                                            <DeleteIcon className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
                                                            Delete Collection
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
    
                            {isEditing && !isLikedPostsCollection ? (
                                <form onSubmit={handleUpdateCollection} className="space-y-4 mr-16">
                                    <div>
                                        <label htmlFor="collectionName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                        <input
                                            id="collectionName"
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-1" />
                                    </div>
                                    <div>
                                        <label htmlFor="collectionDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                        <textarea
                                            id="collectionDescription"
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm p-2 resize-y focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                            placeholder="Enter collection description..."
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
                                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Make this collection private</span>
                                        </label>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">Only you will be able to see it.</p>
                                        <InputError message={errors.is_private} className="mt-1" />
                                    </div>
    
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={`px-4 py-2 text-white rounded-md transition-colors duration-200 ${processing ? 'bg-blue-400 dark:bg-blue-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'}`}
                                        >
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="mr-16">
                                    <p className="mt-1 text-gray-600 dark:text-gray-300 text-lg">
                                        {collection.description || <span className="italic text-gray-500 dark:text-gray-400">This Collection has no description.</span>}
                                    </p>
                                    {collection.is_private ? (
                                        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            <LockClosedIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                                            <span>This collection is private. Only you can see it.</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            <LockOpenIcon className="w-4 h-4 mr-1 mx-2" />
                                            <span>This collection is public. Anyone can see it.</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
    
                    {/* Posts Section - No heading */}
                    <div className="px-2 sm:px-0">
                        {posts.length > 0 ? (
                            <div className="space-y-6">
                                {posts.map((post) => (
                                    <Post
                                        key={post.id}
                                        post={post}
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
                            <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-8">
                                <p className="text-gray-500 dark:text-gray-400 text-center">No posts in this collection yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}