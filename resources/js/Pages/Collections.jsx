import React, { useState, useMemo } from 'react'; // Added useMemo
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react'; // Added router
import LockClosedIcon from '@/Components/Icons/LockClosedIcon'; // Assuming this exists now
import Checkbox from '@/Components/Checkbox'; // Assuming this exists
import InputLabel from '@/Components/InputLabel'; // Assuming this exists
import TextInput from '@/Components/TextInput'; // Assuming this exists
import TextArea from '@/Components/TextArea'; // Assuming this exists
import PrimaryButton from '@/Components/PrimaryButton'; // Assuming this exists
import Modal from '@/Components/Modal'; // Assuming this exists
import InputError from '@/Components/InputError'; // Assuming this exists

export default function Collections({ auth, collections: initialCollections }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        description: '',
        is_private: false, 
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const sortedCollections = useMemo(() => {
        if (!Array.isArray(initialCollections)) {
            console.warn("Collections prop is not an array:", initialCollections);
            return [];
        }
        return [...initialCollections].sort((a, b) => {
            if (a.name === 'Liked Posts') return -1;
            if (b.name === 'Liked Posts') return 1;
            return (a.name || '').localeCompare(b.name || '');
        });
    }, [initialCollections]);


    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('collections.store'), {
            onSuccess: () => { 
                reset();
                setIsModalOpen(false);
            },
            onError: (errs) => {
                console.error("Error creating collection:", errs);
            }
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    return (
        <AuthenticatedLayout user={auth?.user} header="My Collections">
            <Head title="Collections" />

            <div className="py-8">
                <div className="relative mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-6 text-gray-900 dark:text-white" >
                        <div className="relative">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sortedCollections.map((collection) => (
                                    <div
                                        key={collection.id}
                                        className={`relative p-4 border-2 bg-white border-gray-400 dark:bg-slate-700 ${
                                            collection.name === 'Liked Posts'
                                                ? 'border-blue-500 bg-blue-300'
                                                : 'border-gray-300'
                                        } rounded-3xl shadow hover:shadow-md transition-shadow flex flex-col justify-between`} // Use flex column
                                    >
                                        <div> {/* Content wrapper */}
                                            <Link
                                                href={route('collections.show', { id: collection.id })}
                                                className="flex items-center text-lg font-semibold text-blue-500 dark:hover:text-blue-400 hover:text-blue-600 mb-1"
                                            >
                                                {collection.name}
                                                {collection.is_private ? (
                                                    <LockClosedIcon className=" absolute top-4 right-4 w-6 h-6 ml-2 text-gray-500 dark:text-gray-300 flex-shrink-0" />
                                                ) : null}
                                            </Link>
                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2 dark:text-gray-100">
                                                {collection.description || <i>No description</i>}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-auto pt-2">
                                            {collection.posts_count} {collection.posts_count === 1 ? 'post' : 'posts'}
                                        </p>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center justify-center p-4 border-2 border-dashed bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-400 rounded-3xl text-gray-500 hover:text-gray-700 hover:border-gray-400 dark:hover:border-gray-300 transition h-32"
                                >
                                    <div className="flex flex-col items-center">
                                        <p className="text-lg font-semibold text-gray-500  dark:text-white mt-2 bg-inherit">
                                            Create New Collection
                                        </p>
                                        <span className="text-5xl text-gray-500 dark:text-gray-200 -mt-2">+</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Use Modal Component */}
                <Modal show={isModalOpen} onClose={closeModal}>
                    <form onSubmit={handleSubmit} className="p-6 dark:bg-slate-700 border-2 rounded-3xl">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                            Create New Collection
                        </h2>
                        <div className="mt-4">
                            <InputLabel htmlFor="name" value="Name" className="dark:text-white" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block border-2 w-full dark:bg-gray-500 dark:text-white"
                                autoComplete="off"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="description" value="Description (Optional)" className="dark:text-white"/>
                            <TextArea
                                id="description"
                                name="description"
                                value={data.description}
                                className="mt-1 block border-2 w-full dark:bg-gray-500 dark:text-white"
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>
                        <div className="block mt-4">
                            <label className="flex items-center">
                                <Checkbox
                                    name="is_private"
                                    checked={data.is_private}
                                    onChange={(e) => setData('is_private', e.target.checked)}
                                />
                                <span className="ms-2 text-sm text-gray-600 dark:text-gray-200">Make this collection private</span>
                            </label>
                            <p className="text-xs text-gray-500 ml-6 dark:text-gray-300">Only you will be able to see it.</p>
                            <InputError message={errors.is_private} className="mt-2" />
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button type="button" onClick={closeModal} className="mr-3 inline-flex justify-center rounded-md border border-transparent bg-gray-500 py-2 px-4 text-md font-medium text-white shadow-sm hover:bg-gray-600 dark:hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 w-20">
                                Cancel
                            </button>
                            <PrimaryButton disabled={processing} className="bg-blue-500 dark:bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                Create Collection
                            </PrimaryButton>
                        </div>
                    </form>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}