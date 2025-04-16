import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Post from '@/Components/Post';
import DeleteIcon from '@/Components/Icons/DeleteIcon';
import EditIcon from '@/Components/Icons/EditIcon';
import axios from 'axios';
import Checkbox from '@/Components/Checkbox';

export default function CollectionPosts({ collection: initialCollection, posts: initialPosts, auth }) {

    const [collection, setCollection] = useState(initialCollection);
    const [posts, setPosts] = useState(initialPosts);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(collection.name);
    const [editDescription, setEditDescription] = useState(collection.description);
    const [editIsPrivate, setEditIsPrivate] = useState(collection.is_private); 
    const [processing, setProcessing] = useState(false);

    const handlePostRemove = async (postId) => {
        const originalPosts = [...posts];
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        try {
            await axios.post(route('collections.removePost'), {
                collection_id: collection.id,
                post_id: postId,
            });
        } catch (error) {
            console.error('Error removing post:', error);
            alert('Failed to remove post.');
            setPosts(originalPosts); 
        }
    };


    const handleUpdateCollection = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            await axios.patch(route('collections.update', { id: collection.id }), {
                name: editName,
                description: editDescription,
                is_private: editIsPrivate,
            });
            setCollection(prev => ({
                ...prev,
                name: editName,
                description: editDescription,
                is_private: editIsPrivate,
            }));

            setIsEditing(false);
        } catch (error) {
            console.error('Error updating collection:', error);
            alert('Failed to update collection.');
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteCollection = async () => {
        if (confirm('Are you sure you want to delete this collection? This cannot be undone.')) {
            router.delete(route('collections.destroy', { id: collection.id }), {
                onError: (errors) => {
                    console.error('Error deleting collection:', errors);
                    alert(errors.error || 'Failed to delete collection.');
                }
            });
        }
    };

    const cancelEdit = () => {
        setEditName(collection.name);
        setEditDescription(collection.description);
        setEditIsPrivate(collection.is_private);
        setIsEditing(false);
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={ `Collection - ${collection.name}`}
        >
            <Head title={collection.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 relative">
                            {/* Edit/Delete Buttons */}
                            <div className="absolute top-6 right-6 flex space-x-2">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100"
                                    aria-label={isEditing ? "Cancel Edit" : "Edit Collection"}
                                >
                                    <EditIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleDeleteCollection}
                                    className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
                                    aria-label="Delete Collection"
                                >
                                    <DeleteIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Collection Details */}
                            {isEditing ? (
                                <form onSubmit={handleUpdateCollection} className="space-y-4 mr-20"> {/* Added margin */}
                                    <div>
                                        <label htmlFor="collectionName" className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            id="collectionName"
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="collectionDescription" className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            id="collectionDescription"
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 resize-y focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Enter collection description..."
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    {/* Add Checkbox for is_private */}
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
                                    </div>
                                    {/* End Checkbox */}
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
                                <div className="mr-20"> 
                                    <p className="mt-1 text-gray-600">{collection.description || <i>No description provided.</i>}</p>
                                    {collection.is_private ? (
                                        <p className="mt-1 text-sm text-gray-500 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline-block" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                            Private Collection
                                        </p>
                                    ) : null}
                                </div>
                            )}

                            <h2 className="mt-8 mb-4 text-xl font-semibold border-t-2 pt-4">Posts in this Collection</h2>
                            <div className="space-y-6">
                                {posts.length > 0 ? (
                                    posts.map((post) => (
                                        <Post
                                            key={post.id}
                                            post={post}
                                            auth={auth}
                                            currentUserId={auth.user.id}
                                            onPostRemove={() => handlePostRemove(post.id)}
                                            collectionId={collection.id}
                                            collectionName={collection.name}
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-600">No posts in this collection yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}