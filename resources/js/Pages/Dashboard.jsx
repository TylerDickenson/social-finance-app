import React, { useState, useEffect, useRef, useCallback } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Post from '@/Components/Post';
import axios from 'axios';

export default function Dashboard({ posts: paginatedPosts, auth }) {
    const [allPosts, setAllPosts] = useState(paginatedPosts.data);
    const [currentPage, setCurrentPage] = useState(paginatedPosts.current_page);
    const [lastPage, setLastPage] = useState(paginatedPosts.last_page);
    const [loading, setLoading] = useState(false);
    const observerRef = useRef(null);

    useEffect(() => {
        setLastPage(paginatedPosts.last_page);
    }, [paginatedPosts.last_page]);

    const handleLoadMore = async () => {
        if (loading || currentPage >= lastPage) return;

        setLoading(true);
        const nextPage = currentPage + 1;
        const url = `/discover?page=${nextPage}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                }
            });

            const newPostsData = response.data.posts;

            if (newPostsData && newPostsData.data && newPostsData.data.length > 0) {
                setAllPosts((prevPosts) => [...prevPosts, ...newPostsData.data]);
                setCurrentPage(newPostsData.current_page);
                setLastPage(newPostsData.last_page);
            } else {
                setCurrentPage(nextPage);
            }
        } catch (error) {
            console.error("Error loading more posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostDelete = (postId) => {
        setAllPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    };

    const lastPostRef = useCallback((node) => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        if (node && currentPage < lastPage && !loading) {
            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        handleLoadMore();
                    }
                },
                {
                    threshold: 0.5,
                    rootMargin: '100px',
                }
            );

            observerRef.current.observe(node);
        }
    }, [currentPage, lastPage, loading]);

    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    return (
        <AuthenticatedLayout user={auth.user} header="All Posts">
            <Head title="Discover" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidde shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {allPosts && allPosts.length > 0 ? (
                                <>
                                    {allPosts.map((post, index) => (
                                        <div
                                            key={post.id}
                                            ref={index === allPosts.length - 1 ? lastPostRef : null}
                                            className="mb-6"
                                        >
                                            <Post
                                                post={post}
                                                currentUserId={auth.user ? auth.user.id : null}
                                                onFollowChange={(userId, isFollowing) => {
                                                    setAllPosts((prevPosts) =>
                                                        prevPosts.map((p) =>
                                                            p.user && p.user.id === userId
                                                                ? { ...p, user: { ...p.user, is_following: isFollowing } }
                                                                : p
                                                        )
                                                    );
                                                }}
                                                onPostDelete={handlePostDelete}
                                            />
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="flex flex-col items-center justify-center p-4 mt-4">
                                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                                            <p className="mt-2 text-gray-600">Loading more posts...</p>
                                        </div>
                                    )}
                                    {!loading && currentPage >= lastPage && allPosts.length > 0 && (
                                         <div className="text-center text-gray-600 mt-4 py-4">
                                             You've reached the end!
                                         </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-lg text-center text-gray-600 py-8">No posts available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}