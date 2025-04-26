import { useState, useEffect } from 'react';

export default function SiteTheme(defaultTheme = 'dark') {
    const [theme, setTheme] = useState(() => {
        if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme');
        }
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return defaultTheme;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } 
        else {
            root.classList.remove('dark');
        }
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('theme', theme);
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return { theme, toggleTheme };
}