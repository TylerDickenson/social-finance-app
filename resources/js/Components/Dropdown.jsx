import { Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { createContext, useContext, useState } from 'react';

const DropdownContext = createContext();

function Dropdown({ children }) {
    const [open, setOpen] = useState(false);

    const toggle = () => setOpen(!open);

    return (
        <DropdownContext.Provider value={{ open, toggle }}>
            <div className="relative">
                {children}
            </div>
        </DropdownContext.Provider>
    );
}

function Trigger({ children }) {
    const { toggle } = useContext(DropdownContext);

    return (
        <div onClick={toggle}>
            {children}
        </div>
    );
}

function Content({ children, className = '' }) {
    const { open } = useContext(DropdownContext);

    return (
        <Transition
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 translate-y-4"
            enterTo="transform opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 translate-y-0"
            leaveTo="transform opacity-0 translate-y-4"
            className={`absolute bottom-full mb-2 ${className}`}
        >
            <div className="bg-white shadow-lg rounded-md overflow-hidden">
                {children}
            </div>
        </Transition>
    );
}

function LinkItem({ href, method = 'get', as = 'a', children }) {
    return (
        <Link href={href} method={method} as={as} className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100">
            {children}
        </Link>
    );
}

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = LinkItem;

export default Dropdown;