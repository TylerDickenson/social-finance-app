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

    const formattedDate = new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });


    const list = modalType === 'followers' ? user.followers : user.following;

    return (
        <AuthenticatedLayout
    header={
        <div className="flex justify-center items-center w-full relative">
            <div className="w-full max-w-3xl px-4 lg:transform lg:translate-x-[-2.25rem]">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <img 
                            src={user.avatar_url} 
                            alt={`${user.name}'s Avatar`} 
                            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md" 
                        />
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                            {user.name}
                        </h1>
                        
                        {user.about && (
                            <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                                {user.about}
                            </p>
                        )}
                        
                        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Member since {formattedDate}
                        </p>
                        
                        {/* Stats Row */}
                        <div className="flex items-center justify-center md:justify-start mt-4 space-x-8 border-t border-gray-100 dark:border-gray-700 pt-4">
                            <div className="flex flex-col items-center">
                                <span className="font-semibold text-gray-900 dark:text-white text-lg">{posts ? posts.length : 0}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Posts</span>
                            </div>
                            
                            <div 
                                className="flex flex-col items-center cursor-pointer group"
                                onClick={() => openModal('followers')}
                            >
                                <span className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{user.followers ? user.followers.length : 0}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Followers</span>
                            </div>
                            
                            <div 
                                className="flex flex-col items-center cursor-pointer group"
                                onClick={() => openModal('following')}
                            >
                                <span className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{user.following ? user.following.length : 0}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Following</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    


    }
        >
            <Head title={`${user.name}`} />

            <div className="mt-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden  ===">
                        <div className="px-6 text-gray-900">
                            <div className="mt-6 space-y-6">
                                {posts && posts.length > 0 ? (
                                    posts.map((post) => (
                                        <Post
                                            key={post.id}
                                            post={post}
                                            currentUserId={currentUserId}
                                        />
                                    ))
                                ) : (
                                    <p className="text-2xl dark:text-white ">No posts available.</p>
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