import React, { useState, useEffect } from 'react';
import Folder from './Icons/Folder';

export default function FileUpload({ label, name, value, onChange, error, onImagePreviewUpdate }) {
    const [imagePreview, setImagePreview] = useState(value ? URL.createObjectURL(value) : null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        onChange(file);
        setImagePreview(URL.createObjectURL(file));
        if (onImagePreviewUpdate) {
            onImagePreviewUpdate();
        }
    };

    useEffect(() => {
        if (onImagePreviewUpdate) {
            onImagePreviewUpdate();
        }
    }, [imagePreview, onImagePreviewUpdate]);

    return (
        <div className="mt-4">
            <label htmlFor={name} className="block text-lg ml-2 mb-2 font-bold text-gray-700 dark:text-white">
                {label}
            </label>
            <div className="relative">
                <input
                    type="file"
                    name={name}
                    id={name}
                    onChange={handleFileChange}
                    className="custom-file-input"
                />
                <label className="custom-file-label dark:bg-gray-500 dark:text-white flex items-start gap-2" htmlFor={name}>
                    <Folder className="" />
                    {value ? value.name : 'Choose file'}
                </label>
            </div>
            {error && <div className="text-red-600">{error}</div>}
            {imagePreview && (
                <div className="mt-4">
                    <img src={imagePreview} alt="Image Preview" className="max-w-full h-auto rounded-md" />
                </div>
            )}
        </div>
    );
}