import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import CollectionIcon from '@/Components/Icons/CollectionIcon';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a2.25 2.25 0 0 0-2.25 2.25 2.25 2.25 0 0 0 2.25 2.25 2.25 2.25 0 0 0 2.25-2.25A2.25 2.25 0 0 0 12 12Z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
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

    // Effect to apply theme class and save preference
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

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-slate-800" 
             style={{ 
                 backgroundImage: 'url("/images/Backgrounds/topography2.svg")', 
                 backgroundBlendMode: 'soft-light',
                 backgroundSize: '400px'
             }}>
            <nav className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 z-50 transform ${isNavbarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out lg:translate-x-0 flex flex-col shadow-lg`}>
                <div className="px-6 py-7 flex items-center justify-center border-b border-gray-100 dark:border-gray-700">
                    <Link href="/" className="flex items-center gap-3">
                        <ApplicationLogo className="h-10 w-auto fill-current text-blue-600 dark:text-blue-400" />
                        <span className="text-xl font-bold text-gray-900 dark:text-white">FinSocial</span>
                    </Link>
                </div>
                
                <div className="flex-1 overflow-y-auto px-6 py-8">
                    <div className="flex flex-col space-y-2">
                        <NavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                            className={({ isActive }) => `group flex items-center px-4 py-4 ${
                                isActive 
                                    ? 'bg-blue-50/40 text-blue-600 dark:bg-inherit dark:text-blue-400' 
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50/40 dark:hover:bg-slate-700/20'
                            }`}
                            onClick={handleNavLinkClick}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                            <span className="text-base font-medium">Discover</span>
                        </NavLink>
                        
                        <NavLink
                            href={route('following')}
                            active={route().current('following')}
                            className={({ isActive }) => `group flex items-center px-4 py-4 ${
                                isActive 
                                    ? 'bg-blue-50/40 text-blue-600 dark:inherit dark:text-blue-400' 
                                    : 'text-gray-700 dark:text-gray-300 dark:hover:bg-slate-700/20'
                            }`}
                            onClick={handleNavLinkClick}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 group-hover:text-blue-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="text-base font-medium">Following</span>
                        </NavLink>
                        
                        <NavLink
                            href={route('posts.create')}
                            active={route().current('posts.create')}
                            className={({ isActive }) => `group flex items-center px-4 py-4 ${
                                isActive 
                                    ? 'bg-blue-50/40 text-blue-600 dark:bg-inherit dark:text-blue-400' 
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50/40 dark:hover:bg-slate-700/20'
                            }`}
                            onClick={handleNavLinkClick}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-base font-medium">Create Post</span>
                        </NavLink>
                        <NavLink
                            href={route('posts.create')}
                            active={route().current('posts.create')}
                            className={({ isActive }) => `group flex items-center px-4 py-4 ${
                                isActive 
                                    ? 'bg-blue-50/40 text-blue-600 dark:bg-inherit dark:text-blue-400' 
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50/40 dark:hover:bg-slate-700/20'
                            }`}
                            onClick={handleNavLinkClick}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-5 w-5 mr-3 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400 transition-colors duration-200">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                            </svg>

                            <span className="text-base font-medium">Discussions</span>
                        </NavLink>
                    </div>
                </div>

                {/* User Profile Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button type="button" className="w-full flex items-center p-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200">
                                <img 
                                    src={user.avatar_url} 
                                    alt={`${user.name}'s avatar`} 
                                    className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-600" 
                                />
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">View account</p>
                                </div>
                                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="top" width="72" contentClasses="w-72 rounded-md shadow-lg py-1 bg-slate-400 dark:bg-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Dropdown.Link 
                                href={route('profile.show', { id: user.id })} 
                                className="group flex items-center py-2 text-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                My Account
                            </Dropdown.Link>

                            <Dropdown.Link 
                                href={route('collections.index')} 
                                className="group flex items-center py-2 text-sm"
                            >
                                <CollectionIcon className=""></CollectionIcon>
                                My Collections
                            </Dropdown.Link>
                            
                            <Dropdown.Link 
                                href={route('profile.edit')} 
                                className="group flex items-center py-2 text-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Profile
                            </Dropdown.Link>
                            
                           
                            
                            <div className="border-t border-gray-100 dark:border-gray-600 mt-1"></div>
                            
                            <Dropdown.Link 
                                href={route('logout')} 
                                method="post" 
                                as="button"
                                className="group flex w-full items-center border-t border-gray-500 mb-0 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </nav>

            {/* Mobile nav backdrop */}
            <Transition
                show={isNavbarOpen}
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div 
                    className="fixed inset-0 bg-gray-600/75 dark:bg-gray-900/80 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsNavbarOpen(false)}
                ></div>
            </Transition>

            <div className="flex-1 flex flex-col lg:pl-72">
                {typeof header === 'string' ? (
                    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 backdrop-blur-md bg-white/90 dark:bg-slate-800/90">
                        <div className="relative pt-7 pb-8">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 lg:hidden z-10">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
                                    onClick={() => setIsNavbarOpen(true)}
                                >
                                    <span className="sr-only">Open menu</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                                <button
                                    onClick={toggleTheme}
                                    className="rounded-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                                >
                                    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                                </button>
                            </div>
                            
                            <div className="flex-1 flex justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{header}</h1>
                            </div>
                        </div>
                    </header>
                    ) : (
                        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 backdrop-blur-md bg-white/90 dark:bg-slate-800/90">
                            <div className="relative pt-7 pb-8">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 lg:hidden z-10">
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
                                        onClick={() => setIsNavbarOpen(true)}
                                    >
                                        <span className="sr-only">Open menu</span>
                                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                                    <button
                                        onClick={toggleTheme}
                                        className="rounded-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                                    >
                                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                                    </button>
                                </div>
                                
                                {header}
                            </div>
                        </header>
                    )}

                <main className="flex-1 pb-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}