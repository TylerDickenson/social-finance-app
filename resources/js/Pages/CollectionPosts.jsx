import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react'; // Import router
import Post from '@/Components/Post';
import DeleteIcon from '@/Components/Icons/DeleteIcon';
import EditIcon from '@/Components/Icons/EditIcon';
import axios from 'axios';

export default function CollectionPosts({ collection: initialCollection, posts: initialPosts, auth }) {
    // Use state for collection data to allow updates
    const [collection, setCollection] = useState(initialCollection);
    const [posts, setPosts] = useState(initialPosts);
    const [isEditing, setIsEditing] = useState(false);
    // Keep separate state for the form inputs during editing
    const [editName, setEditName] = useState(collection.name);
    const [editDescription, setEditDescription] = useState(collection.description);
    const [processing, setProcessing] = useState(false);

    const handlePostRemove = async (postId) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        try {
            await axios.post(route('collections.removePost'), {
                collection_id: collection.id,
                post_id: postId,
            });
        } catch (error) {
            console.error('Error removing post:', error);
            setPosts(initialPosts.filter(p => p.collections.some(c => c.id === collection.id))); 
        }
    };


    const handleUpdateCollection = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            await axios.patch(route('collections.update', { id: collection.id }), {
                name: editName,
                description: editDescription,
            });

            router.reload({
                only: ['collection', 'posts'], 
                onSuccess: (page) => {
                    setCollection(page.props.collection);
                    setPosts(page.props.posts);
                    setEditName(page.props.collection.name);
                    setEditDescription(page.props.collection.description);
                }
            });

            setIsEditing(false);
        } catch (error) {
            console.error('Error updating collection:', error);
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteCollection = async () => {
        if (confirm('Are you sure you want to delete this collection?')) {
            router.delete(route('collections.destroy', { id: collection.id }), {
                onSuccess: () => {
                },
                onError: (errors) => {
                    console.error('Error deleting collection:', errors);
                }
            });
        }
    };

    const cancelEdit = () => {
        setEditName(collection.name);
        setEditDescription(collection.description);
        setIsEditing(false);
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={collection.name}
        >
            <Head title={collection.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 relative">
                            {/* Edit/Delete Buttons */}
                            <div className="absolute top-4 right-4 flex space-x-2">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="text-blue-600 hover:text-blue-800"
                                    aria-label={isEditing ? "Cancel Edit" : "Edit Collection"}
                                >
                                    <EditIcon />
                                </button>
                                <button
                                    onClick={handleDeleteCollection}
                                    className="text-red-600 hover:text-red-800"
                                    aria-label="Delete Collection"
                                >
                                    <DeleteIcon />
                                </button>
                            </div>

                            {/* Collection Details */}
                            {isEditing ? (
                                <form onSubmit={handleUpdateCollection} className="flex flex-col space-y-4">
                                    <div className="flex">
                                        <div className="flex-1">
                                            <label htmlFor="collectionName" className="sr-only">Collection Name</label>
                                            <input
                                                id="collectionName"
                                                type="text"
                                                value={editName} 
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="w-full text-2xl font-bold border border-gray-300 rounded-md p-2 mb-2"
                                                required
                                            />
                                            <label htmlFor="collectionDescription" className="sr-only">Collection Description</label>
                                            <textarea
                                                id="collectionDescription"
                                                value={editDescription} 
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                className="w-full h-24 text-gray-600 border border-gray-300 rounded-md p-2 resize-none"
                                                placeholder="Enter collection description..."
                                            ></textarea>
                                        </div>
                                        <div className="flex flex-col justify-end space-y-2 w-20 ml-6 mb-2">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className={`px-4 py-2 mb-1 text-white rounded-md w-full ${processing ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                                            >
                                                {processing ? 'Saving...' : 'Save'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelEdit} 
                                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 w-full"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    {/* Display collection data from state */}
                                    <h1 className="text-2xl font-bold">{collection.name}</h1>
                                    <p className="mt-2 text-gray-600">{collection.description || 'No description provided.'}</p>
                                </>
                            )}

                            <h2 className="mt-6 text-xl font-semibold">Posts</h2>
                            <div className="mt-4">
                                {posts.length > 0 ? (
                                    posts.map((post) => (
                                        <Post
                                            key={post.id}
                                            post={post}
                                            auth={auth}
                                            currentUserId={auth.user.id}
                                            onPostRemove={() => handlePostRemove(post.id)}
                                            collectionId={collection.id} 
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-600">No posts in this collection.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}