import React, { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextArea(
    { className = '', isFocused = false, ...props },
    ref
) {
    const localRef = ref || useRef();

    useEffect(() => {
        if (isFocused) {
            localRef.current.focus();
        }
    }, []);

    return (
        <textarea
            {...props}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                className
            }
            ref={localRef}
        ></textarea>
    );
});