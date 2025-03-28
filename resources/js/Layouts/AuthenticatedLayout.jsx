import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const handleNavLinkClick = () => {
        setIsNavbarOpen(false);
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            <nav className={`fixed inset-y-0 left-0 w-96 bg-white border-r border-gray-100 z-50 transform ${isNavbarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col`}>
                <div className="h-48 flex items-center justify-center">
                    <Link href="/">
                        <ApplicationLogo className="block h-40 w-auto fill-current text-gray-800" />
                    </Link>
                </div>
                <div className="flex flex-col items-center px-8 py-4 space-y-4 flex-grow">
                    <NavLink
                        href={route('dashboard')}
                        active={route().current('dashboard')}
                        className="text-2xl block py-6 pt-10"
                        style={{ fontSize: '2rem' }}
                        onClick={handleNavLinkClick}
                    >
                        Discover
                    </NavLink>
                    <div className="py-4"></div>
                    <NavLink
                        href={route('following')}
                        active={route().current('following')}
                        className="text-2xl block py-6"
                        style={{ fontSize: '2rem' }}
                        onClick={handleNavLinkClick}
                    >
                        Following
                    </NavLink>
                    <div className="py-4"></div>
                    <NavLink
                        href={route('posts.create')}
                        active={route().current('posts.create')}
                        className="text-2xl block py-6"
                        style={{ fontSize: '2rem' }}
                        onClick={handleNavLinkClick}
                    >
                        Make a New Post
                    </NavLink>
                </div>
                <div className="mt-auto px-8 py-4">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md w-full">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-between w-full rounded-md border border-transparent bg-white px-3 py-4 text-2xl font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                >
                                    <img
                                        src={user.avatar_url} // Ensure the correct property name for the avatar URL
                                        alt="User Avatar"
                                        className="h-10 w-10 rounded-full me-1" // Reduced margin
                                    />
                                    <span className="truncate max-w-xs" style={{ lineHeight: '2rem' }}>{user.name}</span>
                                    <svg
                                        className="-me-0.5 ms-2 h-8 w-8" // Increased size
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </span>
                        </Dropdown.Trigger>
                        <Dropdown.Content className="w-full text-right pr-4"> {/* Added padding-right */}
                            <Dropdown.Link href={route('profile.show', { id: user.id })} className="text-xl block py-4 dropdown-item font-semibold" index={1}> {/* Added font-semibold */}
                                My Account
                            </Dropdown.Link>
                            <Dropdown.Link href={route('profile.edit')} className="text-xl block py-4 dropdown-item font-semibold" index={2}> {/* Added font-semibold */}
                                Edit Details
                            </Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button" className="text-xl block py-4 dropdown-item font-semibold text-right w-full" index={3}> {/* Added font-semibold */}
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </nav>

            {isNavbarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
                    onClick={() => setIsNavbarOpen(false)}
                ></div>
            )}

            <div className="flex-1 flex flex-col lg:ml-96">
                <header className="fixed top-0 left-0 right-0 bg-white/50 shadow flex items-center justify-between lg:justify-start z-50 lg:ml-96 backdrop-blur-md">
                    <button
                        onClick={() => setIsNavbarOpen(!isNavbarOpen)}
                        className="p-4 focus:outline-none lg:hidden"
                    >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-bold">{header}</h1>
                    </div>
                </header>

                <main className="flex-1 p-4 mt-24 lg:mt-32">
                    {children}
                </main>
            </div>
        </div>
    );
}