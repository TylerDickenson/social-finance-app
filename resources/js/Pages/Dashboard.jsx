// filepath: /Users/tylerdickenson/Projects/finance-app-3.0/social-finance-app/resources/js/Pages/Dashboard.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Post from '@/Components/Post';

export default function Dashboard({ posts, auth }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-semibold leading-tight text-gray-800 ">
                    Explore new Content
                </h2>
            }
        >
            <Head title="Discover" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {posts && posts.length > 0 ? (
                                posts.map((post) => (
                                    <Post key={post.id} post={post} currentUserId={auth.user.id} />
                                ))
                            ) : (
                                <p className="text-lg">No posts available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}