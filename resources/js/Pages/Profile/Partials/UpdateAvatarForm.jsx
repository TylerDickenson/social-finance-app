import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function UpdateAvatarForm({ avatarUrl }) {
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        avatar: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.updateAvatar'), {
            forceFormData: true,
        });
    };

    return (
        <section className="space-y-6">
            <header>
                <h2 className="text-lg font-medium text-gray-900">Avatar</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Update your profile's avatar.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                        Avatar
                    </label>
                    <img src={avatarUrl} alt="Current Avatar" className="w-20 h-20 rounded-full" />
                    <input
                        type="file"
                        id="avatar"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        onChange={(e) => setData('avatar', e.target.files[0])}
                    />
                    {errors.avatar && <div className="mt-2 text-sm text-red-600">{errors.avatar}</div>}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 bg-blue-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 active:bg-blue-600 disabled:opacity-25 transition"
                        disabled={processing}
                    >
                        Save
                    </button>

                    {recentlySuccessful && (
                        <p className="text-sm text-gray-600">Saved.</p>
                    )}
                </div>
            </form>
        </section>
    );
}