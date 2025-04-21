import { Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { createContext, useContext, useState, useRef, useEffect } from 'react';

const DropdownContext = createContext();

const HoverArrowIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="w-4 h-4 inline-block ml-2 transition-all duration-200 ease-in-out transform -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);


function Dropdown({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                handleClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);


    return (
        <DropdownContext.Provider value={{ isOpen, handleToggle, handleClose }}>
            <div className="relative" ref={dropdownRef}>
                {children}
            </div>
        </DropdownContext.Provider>
    );
}

Dropdown.Trigger = function Trigger({ children }) {
    const { handleToggle } = useContext(DropdownContext);
    return <div onClick={handleToggle} className="cursor-pointer">{children}</div>;
};

Dropdown.Content = function Content({ children, className = '' }) {
    const { isOpen } = useContext(DropdownContext);
    return (
        <Transition
            show={isOpen}
            enter="transition ease-out duration-150" 
            enterFrom="transform opacity-0 scale-y-90 origin-bottom" 
            enterTo="transform opacity-100 scale-y-100 origin-bottom"
            leave="transition ease-in duration-100" 
            leaveFrom="transform opacity-100 scale-y-100 origin-bottom"
            leaveTo="transform opacity-0 scale-y-90 origin-bottom"
        >
            <div
                className={`absolute bottom-full w-full rounded-md bg-white dark:bg-slate-600 z-50 overflow-hidden ${className}`} // Match dark bg, rounded-t-md, removed mb-2
            >
                {children}
            </div>
        </Transition>
    );
};

// --- Link Component ---
Dropdown.Link = function LinkComponent({ href, method = 'get', as = 'a', className = '', children, ...props }) {
    const { handleClose } = useContext(DropdownContext);

    return (
        <Link
            href={href}
            method={method}
            as={as}
            // Ensure text colors work on the new background
            className={`group flex items-center justify-end w-full py-2 px-1 text-lg font-medium text-gray-700 dark:text-gray-50 hover:text-gray-900 dark:hover:text-white transition duration-150 ease-in-out ${className}`} // Adjusted dark text color
            {...props}
            onClick={handleClose}
        >
            {children}
            <HoverArrowIcon />
        </Link>
    );
};

export default Dropdown;