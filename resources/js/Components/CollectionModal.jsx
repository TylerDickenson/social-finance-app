import React from 'react';
import { Link } from '@inertiajs/react';
import CollectionIcon from './Icons/CollectionIcon';

export default function CollectionModal({ 
    isOpen, 
    onClose, 
    collections, 
    postId, 
    onAddToCollection, 
    onRemoveFromCollection,
    isPostInCollection 
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div 
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" 
                    aria-hidden="true" 
                    onClick={onClose}
                ></div>
                
                {/* Modal seciton*/}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start ">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">

                            <div className="mt-2 flex items-center">
                                <CollectionIcon className="w-8 h-8 mr-2 text-gray-500 dark:text-gray-400" />
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                                    Save to Collection
                                </h3>
                            </div>

                                <div className="mt-4 w-full">
                                    {Array.isArray(collections) && collections.length > 0 ? (
                                        <ul className="divide-y divide-gray-200 dark:divide-gray-700 -mx-4">
                                            {collections
                                                .filter((collection) => collection.name !== 'Liked Posts')
                                                .map((collection) => {
                                                    const isInCollection = isPostInCollection(collection);
                                                    return (
                                                        <li key={collection.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                                            <button 
                                                                onClick={() => {
                                                                    if (isInCollection) {
                                                                        // Only remove from this specific collection on platform
                                                                        onRemoveFromCollection(collection.id, postId);
                                                                    } else {
                                                                        onAddToCollection(collection.id, postId);
                                                                    }
                                                                }} 
                                                                className="w-full flex items-center justify-between"
                                                            >
                                                                <span className="font-medium text-gray-900 dark:text-white">{collection.name}</span>
                                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                                    isInCollection 
                                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' 
                                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                                }`}>
                                                                    {isInCollection ? 'Remove' : 'Add'}
                                                                </span>
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                        </ul>
                                    ) : (
                                        <div className="text-center py-6">
                                            <p className="text-gray-500 dark:text-gray-400">
                                                You don't have any collections yet.
                                            </p>
                                            <Link 
                                                href={route('collections.create')}
                                                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Create Collection
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}