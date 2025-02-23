import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import UserPosts from '@/Components/UserPosts';

const Show = ({ user, posts, auth }) => {
  console.log('User:', user);
  console.log('Posts:', posts);
  console.log('Auth:', auth);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-2xl font-semibold leading-tight text-gray-800">
          {user.name}'s Profile
        </h2>
      }
    >
      <Head title={`${user.name}'s Profile`} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <p>Email: {user.email}</p>
              <h2 className="mt-4 text-xl font-semibold">Posts</h2>
              <div>
                {posts && posts.length > 0 ? (
                  <UserPosts posts={posts} currentUserId={auth.user.id} />
                ) : (
                  <p className="text-lg">No posts available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Show;