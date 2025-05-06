import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import SiteTheme from '@/Components/SiteTheme';
import MoonIcon from '@/Components/Icons/MoonIcon';
import SunIcon from '@/Components/Icons/SunIcon';

function CommunityRules() {
    const [expanded, setExpanded] = useState(false);
    
    const rules = [
        {
            title: "Be Respectful",
            description: "Treat everyone with respect. No personal attacks, harassment, or hate speech."
        },
        {
            title: "Financial Advice Disclaimer",
            description: "Posts are for informational purposes only. They do not constitute professional financial advice."
        },
        {
            title: "Protect Privacy",
            description: "Never share personal financial details or ask others for sensitive information."
        },
        {
            title: "No Spam",
            description: "Don't post promotional content without permission. No repetitive or off-topic posts."
        },
        {
            title: "Honest Discussions",
            description: "Share truthful experiences. Don't mislead others about investments or financial outcomes."
        }
    ];
    
    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Community Guidelines
                    </h2>
                    <button 
                        onClick={() => setExpanded(!expanded)} 
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                    >
                        {expanded ? "Show Less" : "Show All"}
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-5 w-5 ml-1 transition-transform ${expanded ? "rotate-180" : ""}`}
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
                
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    To ensure our community remains helpful and respectful, please follow these guidelines:
                </p>
                
                <div className={`mt-6 space-y-4 transition-all duration-300 ${expanded ? 'max-h-[1000px] opacity-100' : 'max-h-[100px] overflow-hidden opacity-90'}`}>
                    {rules.map((rule, index) => (
                        <div key={index} className="flex">
                            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mr-4">
                                {index + 1}
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{rule.title}</h3>
                                <p className="mt-1 text-gray-600 dark:text-gray-300">{rule.description}</p>
                            </div>
                        </div>
                    ))}
                    
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-300 italic">
                            By joining and participating in our community, you agree to follow these guidelines. Repeated violations may result in account restrictions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const { theme, toggleTheme } = SiteTheme('dark');
    
    return (
        <>
            <Head title="Welcome" />
            <div 
                className="min-h-screen flex bg-gray-50 dark:bg-slate-800"
                style={{ 
                    backgroundImage: 'url("/images/backgrounds/topography2.svg")', 
                    backgroundBlendMode: 'soft-light',
                    backgroundSize: '400px'
                }}
            >
                <nav className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 z-50 transform ${isNavbarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out lg:translate-x-0 flex flex-col shadow-lg`}>
                    <div className="px-6 flex items-center justify-center border-b border-gray-100 dark:border-gray-700">
                        <Link href="/discover" className="flex items-center">
                            <ApplicationLogo className="h-24 w-auto fill-current text-blue-600 dark:text-blue-400" />
                        </Link>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto px-6 py-8">
                        <div className="flex flex-col space-y-2">
                            
                            <div className="pb-2">
                                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">About FinSocial</p>
                            </div>

                            <Link
                                href="#features"
                                className="group flex items-center px-4 py-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                onClick={() => setIsNavbarOpen(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 group-hover:text-blue-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span className="text-base font-medium">Features</span>
                            </Link>

                            <Link
                                href="#preview"
                                className="group flex items-center px-4 py-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                onClick={() => setIsNavbarOpen(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 group-hover:text-blue-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-base font-medium">See What's Inside</span>
                            </Link>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                Log in to access more features
                            </p>
                            <div className="flex flex-col space-y-2">
                                <Link 
                                    href={route('login')}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors text-sm text-center dark:bg-blue-500 dark:hover:bg-blue-600"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-4 rounded-md transition-colors text-sm text-center"
                                >
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

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
                        className="fixed inset-0 bg-gray-600 dark:bg-gray-900 z-40 lg:hidden backdrop-blur-sm"
                        onClick={() => setIsNavbarOpen(false)}
                    ></div>
                </Transition>

                <div className="flex-1 flex flex-col lg:pl-72">
                    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 backdrop-blur-md">
                        <div className="relative py-7">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 lg:hidden z-10">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800"
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
                                    className="rounded-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                                >
                                    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                                </button>
                            </div>
                            
                            <div className="flex-1 flex justify-center max-w-7xl mx-auto px-4">
                                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome to FinSocial</h1>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1">
                        <div className="max-w-7xl mx-auto px-4 py-4">
                            <section className="my-8">
                                <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center border border-gray-200 dark:border-gray-700 transform transition-transform duration-500 hover:scale-[1.02]">
                                    <div className="text-center md:text-left">
                                        <h2 className="text-4xl font-bold text-gray-800 dark:text-white">Your Social Platform for Finance</h2>
                                        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Connect with like-minded individuals and discuss financial topics that matter to you.</p>
                                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                            <Link href={route('register')} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center dark:bg-blue-500 dark:hover:bg-blue-600">
                                                Create Account
                                            </Link>
                                            <Link href={route('login')} className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center">
                                                Sign In
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <img src="/images/TestImage3.png" alt="Feed Screenshot" className="rounded-lg shadow-lg" />
                                    </div>
                                </div>
                            </section>

                            <section id="features" className="my-12 scroll-mt-20 bg-white p-8 border dark:bg-slate-800 rounded-lg dark:border-gray-700 shadow-lg border-gray-200"  >
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">Why Choose FinSocial?</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-8 text-center transform transition-transform duration-500 hover:scale-105 hover:rotate-1 border border-gray-200 dark:border-gray-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                        </svg>
                                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Discuss Finance Topics</h2>
                                        <p className="mt-2 text-gray-600 dark:text-gray-300">Join discussions on various finance topics with other enthusiasts.</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-8 text-center transform transition-transform duration-500 hover:scale-105 hover:-rotate-1 border border-gray-200 dark:border-gray-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Connect with Others</h2>
                                        <p className="mt-2 text-gray-600 dark:text-gray-300">Build your network and connect with like-minded individuals.</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-8 text-center transform transition-transform duration-500 hover:scale-105 hover:rotate-1 border border-gray-200 dark:border-gray-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Stay Updated</h2>
                                        <p className="mt-2 text-gray-600 dark:text-gray-300">Get the latest updates and trends in the finance world.</p>
                                    </div>
                                </div>
                            </section>

                            <section id="preview" className="my-12 text-center scroll-mt-20">
                                <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-8 border border-gray-200 dark:border-gray-700">
                                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">See What's Inside</h2>
                                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Get a glimpse of our feed page and see what you can expect.</p>
                                    <img src="/images/TestImage2.png" alt="Feed Screenshot" className="mt-8 mx-auto rounded-lg shadow-lg" />
                                </div>
                            </section>

                            <section id="community-rules" className="my-12">
                                <CommunityRules />
                            </section>
                        </div>
                        
                        <footer className="py-8 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 dark:bg-slate-800">  
                            Built in Laravel By Tyler Dickenson
                        </footer>
                    </main>
                </div>
            </div>
        </>
    );
}