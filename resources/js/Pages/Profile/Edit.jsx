import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateAboutForm from './Partials/UpdateAboutForm';
import UpdateAvatarForm from './Partials/UpdateAvatarForm';

export default function Edit({ mustVerifyEmail, status, about, avatarUrl }) {
    return (
        <AuthenticatedLayout
            header="Edit your profile below"
            
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow-lg sm:rounded-3xl sm:p-8 border-2 border-gray-200 dark:border-gray-400 dark:bg-slate-700 dark:text-white">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow-lg sm:rounded-3xl sm:p-8 border-2 border-gray-200 dark:border-gray-400 dark:bg-slate-700 dark:text-white">
                        <UpdatePasswordForm />
                    </div>

                    <div className="bg-white p-4 shadow-lg sm:rounded-3xl sm:p-8 border-2 border-gray-200 dark:border-gray-400 dark:bg-slate-700 dark:text-white">
                        <UpdateAboutForm about={about} className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow-lg sm:rounded-3xl sm:p-8 border-2 border-gray-200 dark:border-gray-400 dark:bg-slate-700 dark:text-white">
                        <UpdateAvatarForm avatarUrl={avatarUrl} className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow-lg sm:rounded-3xl sm:p-8 border-2 border-gray-200 dark:border-gray-400 dark:bg-slate-700 dark:text-white">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}