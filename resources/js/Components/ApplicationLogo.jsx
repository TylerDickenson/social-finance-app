import { useState, useEffect } from 'react';
import SiteTheme from './SiteTheme';

export default function ApplicationLogo(props) {
    const { theme } = SiteTheme();
    
    const [logoSrc, setLogoSrc] = useState(theme === 'dark' 
        ? "/images/backgrounds/FS_dark.png" 
        : "/images/backgrounds/FS.png");

    useEffect(() => {
        setLogoSrc(theme === 'dark' 
            ? "/images/backgrounds/FS_dark.png" 
            : "/images/backgrounds/FS.png");
    }, [theme]);

    useEffect(() => {
        const updateLogoSrc = () => {
            setTimeout(() => {
                const isDark = document.documentElement.classList.contains('dark');
                setLogoSrc(isDark 
                    ? "/images/backgrounds/FS_dark.png" 
                    : "/images/backgrounds/FS.png");
            }, 10);
        };

        window.addEventListener('theme-changed', updateLogoSrc);

        return () => {
            window.removeEventListener('theme-changed', updateLogoSrc);
        };
    }, []); 

    return (
        <img
            {...props}
            src={logoSrc}
            alt="Application Logo"
            key={theme} 
            onError={(e) => console.error("Failed to load logo:", e.target.src)}
        />
    );
}