export default function ApplicationLogo(props) {
    const { theme } = SiteTheme();
    const [logoSrc, setLogoSrc] = useState(theme === 'dark' 
        ? `${window.location.protocol}//${window.location.host}/images/backgrounds/FS_dark.png` 
        : `${window.location.protocol}//${window.location.host}/images/backgrounds/FS.png`);

    useEffect(() => {
        setLogoSrc(theme === 'dark' 
            ? `${window.location.protocol}//${window.location.host}/images/backgrounds/FS_dark.png` 
            : `${window.location.protocol}//${window.location.host}/images/backgrounds/FS.png`);
    }, [theme]);

    useEffect(() => {
        const updateLogoSrc = () => {
            setTimeout(() => {
                const isDark = document.documentElement.classList.contains('dark');
                setLogoSrc(isDark 
                    ? `${window.location.protocol}//${window.location.host}/images/backgrounds/FS_dark.png` 
                    : `${window.location.protocol}//${window.location.host}/images/backgrounds/FS.png`);
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
        />
    );
}