import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateAboutForm from './Partials/UpdateAboutForm';
import UpdateAvatarForm from './Partials/UpdateAvatarForm';

export default function Edit({ auth, mustVerifyEmail, status, about, avatarUrl }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Edit Profile"
        >
            <Head title="Edit Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="overflow-hidden bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300">
                            <div className="p-6">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            </div>
                            
                            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                                <UpdatePasswordForm />
                            </div>
                            
                            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                                <UpdateAvatarForm 
                                    avatarUrl={avatarUrl} 
                                />
                            </div>
                            
                            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                                <UpdateAboutForm 
                                    about={about} 
                                />
                            </div>
                            
                            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                                <DeleteUserForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}