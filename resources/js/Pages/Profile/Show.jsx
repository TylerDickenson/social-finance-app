import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const Show = ({ user, posts }) => {
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
                  posts.map(post => (
                    <div key={post.id} className="mb-6 p-6 border border-gray-300 rounded-lg shadow-sm">
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center">
                          {post.user && post.user.avatar ? (
                            <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full mr-2" />
                          ) : (
                            <div className="w-10 h-10 rounded-full mr-2 bg-gray-300"></div>
                          )}
                          <h4 className="text-2xl font-bold">{post.user ? post.user.name : 'Unknown User'}</h4>
                        </div>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                      <hr className="my-4 border-gray-300" />
                      <div className="flex">
                        {post.image && (
                          <img src={post.image} alt={post.title} className="mb-4 max-w-full h-auto rounded-lg" style={{ maxWidth: '300px', objectFit: 'cover' }} />
                        )}
                        <div className="ml-6 flex-1">
                          <h3 className="text-xl font-bold">{post.title}</h3>
                          <p className="text-lg">{post.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
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