import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a2.25 2.25 0 0 0-2.25 2.25 2.25 2.25 0 0 0 2.25 2.25 2.25 2.25 0 0 0 2.25-2.25A2.25 2.25 0 0 0 12 12Z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
);

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const handleNavLinkClick = () => {
        setIsNavbarOpen(false);
    };

    

    const [theme, setTheme] = useState(() => {
        // Check localStorage first, then system preference, then default to 'light'
        if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme');
        }
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    // --- Effect to apply theme class and save preference ---
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        // Save preference to localStorage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('theme', theme);
        }
    }, [theme]);

    // --- Toggle Function ---
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };




    return (
        <div className="min-h-screen flex dark:text-gray-100 bg-slate-50 dark:bg-slate-700" style={{ backgroundImage: 'url("/images/Backgrounds/topography2.svg")' }}>
            <nav className={`fixed inset-y-0 left-0 w-96 bg-white border-r  border-gray-100 z-50 dark:bg-slate-600 dark:border-gray-300 transform ${isNavbarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col`}>
                <div className="h-48 flex items-center justify-center">
                    <Link href="/">
                        <ApplicationLogo className="block h-40 w-auto fill-current text-gray-800" />
                    </Link>
                </div>
                <div className="flex flex-col items-center px-8 py-4 space-y-4 flex-grow dark:text-white">
                    <NavLink
                        href={route('dashboard')}
                        active={route().current('dashboard')}
                        className="text-2xl block dark:text-white hover:dark:text-blue-300 py-6 pt-10"
                        style={{ fontSize: '2rem' }}
                        onClick={handleNavLinkClick}
                    >
                        Discover
                    </NavLink>
                    <div className="py-4"></div>
                    <NavLink
                        href={route('following')}
                        active={route().current('following')}
                        className="text-2xl block dark:text-white hover:dark:text-blue-300 py-6"
                        style={{ fontSize: '2rem' }}
                        onClick={handleNavLinkClick}
                    >
                        Following
                    </NavLink>
                    <div className="py-4"></div>
                    <NavLink
                        href={route('posts.create')}
                        active={route().current('posts.create')}
                        className="text-2xl block dark:text-white hover:dark:text-blue-300 py-6"
                        style={{ fontSize: '2rem' }}
                        onClick={handleNavLinkClick}
                    >
                        Make a New Post
                    </NavLink>
                </div>


                <div className="px-8 py-4">
                     <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-700 dark:focus:text-gray-200 transition duration-150 ease-in-out"
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        <span className="ml-2">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>
                </div>


                <div className="mt-auto px-8 py-4 dark:text-gray-50">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md w-full">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-between w-full rounded-md border border-transparent dark:bg-slate-600 px-3 py-4 text-2xl font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                >
                                    <img
                                        src={user.avatar_url}
                                        alt="User Avatar"
                                        className="h-10 w-10 rounded-full me-1" 
                                    />
                                    <span className="truncate max-w-xs dark:text-gray-50" style={{ lineHeight: '2rem' }}>{user.name}</span>
                                    <svg
                                        className="-me-0.5 ms-2 h-8 w-8 dark:text-gray-50"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 01.707 1.707l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
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
                            <Dropdown.Link href={route('collections.index')} className="text-xl block py-4 dropdown-item font-semibold" index={2}> {/* Added font-semibold */}
                                Collections
                            </Dropdown.Link>
                            <Dropdown.Link href={route('profile.edit')} className="text-xl block py-4 dropdown-item font-semibold" index={3}> {/* Added font-semibold */}
                                Edit Details
                            </Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button" className="text-xl block py-4 dropdown-item font-semibold text-right w-full" index={4}> {/* Added font-semibold */}
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
                <header className="fixed top-0 left-0 right-0 bg-white/50 dark:bg-slate-600/75 shadow flex items-center justify-between lg:justify-start z-50 lg:ml-96 backdrop-blur-md">
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