import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import Post from '@/Components/Post';
import UserModal from '@/Components/UserModal';

const Show = ({ user, posts }) => {
    const { auth } = usePage().props;
    const currentUserId = auth.user.id;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const openModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalType('');
        setSearchQuery('');
    };

    const list = modalType === 'followers' ? user.followers : user.following;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-8 py-2">
                    <img src={user.avatar_url} alt="User Avatar" className="w-48 h-48 ml-2 rounded-full" />
                    <div className="flex flex-col">
                        <h1 className="text-4xl font-bold leading-tight text-gray-800">
                            {user.name}
                        </h1>
                        <p className="mt-2 text-xl text-gray-600">{user.about}</p>
                        <div className="flex items-center space-x-12 mt-4">
                            <p className="text-xl font-semibold text-gray-600">
                                Posts | {posts ? posts.length : 0}
                            </p>
                            <p
                                className="text-xl font-semibold text-gray-600 cursor-pointer hover:underline"
                                onClick={() => openModal('followers')}
                            >
                                Followers | {user.followers ? user.followers.length : 0}
                            </p>
                            <p
                                className="text-xl font-semibold text-gray-600 cursor-pointer hover:underline"
                                onClick={() => openModal('following')}
                            >
                                Following | {user.following ? user.following.length : 0}
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`${user.name}`} />

            <div className="py-48">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-10 text-gray-900">
                            <h2 className="mt-4 text-2xl font-semibold">Posts</h2>
                            <div className="mt-6 space-y-6">
                                {posts && posts.length > 0 ? (
                                    posts.map((post) => (
                                        <Post key={post.id} post={post} currentUserId={currentUserId} />
                                    ))
                                ) : (
                                    <p className="text-lg">No posts available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <UserModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                modalType={modalType}
                list={list}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
        </AuthenticatedLayout>
    );
};

export default Show;