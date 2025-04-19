import { Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { createContext, useContext, useState, useRef, useEffect } from 'react';

const DropdownContext = createContext();

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
    return <div onClick={handleToggle}>{children}</div>;
};

Dropdown.Content = function Content({ children, className }) {
    const { isOpen } = useContext(DropdownContext);
    return (
        <Transition
            show={isOpen}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <div className={`absolute bottom-full mb-2 w-full text-right pr-8 ${className}`}>
                {children}
                <div className="vertical-line"></div>
            </div>
        </Transition>
    );
};

Dropdown.Link = function LinkComponent({ href, method, as, className, children, ...props }) {
    const { handleClose } = useContext(DropdownContext);
    return (
        <Link href={href} method={method} as={as} className={`block text-right text-lg font-medium pr-4 dropdown-item ${className}`} {...props} onClick={handleClose}>
            {children}
        </Link>
    );
};

export default Dropdown;