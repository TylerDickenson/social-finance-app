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
            <nav className={`fixed inset-y-0 left-0 w-64 bg-white border-r-4  border-gray-300 z-50 dark:bg-slate-600 dark:border-gray-400 transform ${isNavbarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col`}>
                <div className="h-48 flex items-center justify-center">
                    <Link href="/">
                        <ApplicationLogo className="block h-40 w-auto fill-current text-gray-800" />
                    </Link>
                </div>
                <div className="flex flex-col items-center px-8 py-2 space-y-4 flex-grow dark:text-white">
                    <NavLink
                        href={route('dashboard')}
                        active={route().current('dashboard')}
                        className="text-xl block dark:text-white hover:dark:text-blue-300 py-4 pt-4"
                        style={{ fontSize: '2rem' }}
                        onClick={handleNavLinkClick}
                    >
                        Discover
                    </NavLink>
                    <div className="py-2"></div>
                    <NavLink
                        href={route('following')}
                        active={route().current('following')}
                        className="text-xl block dark:text-white hover:dark:text-blue-300 py-4"
                        style={{ fontSize: '2rem' }}
                        onClick={handleNavLinkClick}
                    >
                        Following
                    </NavLink>
                    <div className="py-2"></div>
                    <NavLink
                        href={route('posts.create')}
                        active={route().current('posts.create')}
                        className="text-xl block dark:text-white hover:dark:text-blue-300 py-4"
                        style={{ fontSize: '2rem' }}
                        onClick={handleNavLinkClick}
                    >
                        Create Post
                    </NavLink>
                </div>

                <div className="mt-auto py-2 dark:text-gray-50">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md w-full">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-between w-full rounded-md border border-transparent dark:bg-slate-600 px-3 py-4 text-lg font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                >
                                    <img
                                        src={user.avatar_url}
                                        alt="User Avatar"
                                        className="h-10 w-10 rounded-full me-1" 
                                    />
                                    <span className="truncate max-w-xs dark:text-gray-50" style={{ lineHeight: '2rem' }}>{user.name}</span>
                                    <svg
                                        className="-me-0.5 ms-2 h-8 w-8 dark:text-gray-50"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                    
                                </button>
                            </span>
                        </Dropdown.Trigger>
                        <Dropdown.Content className="w-full text-right text-gray-700 dark:text-white"> {/* Added padding-right */}
                            <Dropdown.Link href={route('profile.show', { id: user.id })} className="text-xl block py-2 dropdown-item font-semibold" index={1}> 
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6 mr-2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                My Account
                            </Dropdown.Link>
                            <Dropdown.Link href={route('collections.index')} className="text-xl block py-2 dropdown-item font-semibold" index={2}> {/* Added font-semibold */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="size-6 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
                                </svg>
                                Collections
                            </Dropdown.Link>
                            <Dropdown.Link href={route('profile.edit')} className="text-xl block py-2 dropdown-item font-semibold" index={3}> {/* Added font-semibold */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                                Edit Details
                            </Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button" className="text-xl block py-2 dropdown-item font-semibold text-right w-full" index={4}> {/* Added font-semibold */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 mr-2 hover:fill-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                </svg>
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

            <div className="flex-1 flex flex-col lg:ml-64">
                <header className="fixed top-0 left-0 right-0 border-b-4 border-gray-400 bg-white/50 dark:bg-slate-600/75 shadow flex items-center justify-between lg:justify-start z-50 lg:ml-64 backdrop-blur-md">
                    <button
                        onClick={() => setIsNavbarOpen(!isNavbarOpen)}
                        className="p-4 focus:outline-none lg:hidden"
                    >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-bold text-gray-700 dark:text-gray-200">{header}</h1>
                    </div>


                    <div className="pr-4 sm:pr-6 lg:pr-8">
                         <button
                            onClick={toggleTheme}
                            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-700 dark:focus:text-gray-200 transition duration-150 ease-in-out"
                            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>
                    </div>
                    
                    
                </header>

                <main className="flex-1 p-4 mt-24 lg:mt-32">
                    {children}
                </main>
            </div>
        </div>
    );
}