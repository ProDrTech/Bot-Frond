import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Moon from '../assets/images/icon/moon.svg';
import Sun from '../assets/images/icon/sun.svg';
import Logo from '../assets/images/logo.png'; // default logo
import { ThemeContext } from '../App';

function Header() {
    const { theme, setTheme } = useContext(ThemeContext);
    const [logoUrl, setLogoUrl] = useState(null);

    function handleChangeTheme(e) {
        e.preventDefault();
        setTheme(theme === 'light' ? 'dark' : 'light');
    }

    useEffect(() => {
        fetch('https://asadmaxmud.up.railway.app/api/v1/settings/')
            .then(res => res.json())
            .then(data => {
                setLogoUrl(data.logo);
            })
            .catch(err => {
                console.error("Logo yuklanmadi:", err);
            });
    }, []);

    return (
        <header
            className={`relative z-20 flex justify-between items-center py-2 px-6 shadow-md transition-all ${
                theme === 'light' ? 'bg-[#f8f9fa] text-[#343a40]' : 'bg-[#121212] text-[#e9ecef]'
            }`}
        >
            <Link to="/">
                <img
                    src={logoUrl || Logo} // ✅ Agar API logo yo‘q bo‘lsa, lokal logo
                    className="w-10 transition-all"
                    alt="Logo"
                />
            </Link>
            <button
                className="flex items-center gap-1 hover:opacity-90 font-medium text-sm transition-opacity"
                onClick={handleChangeTheme}
            >
                <img
                    className="w-5 h-5"
                    src={theme === 'light' ? Moon : Sun}
                    alt="Theme Icon"
                />
                {theme === 'light' ? 'Tun' : 'Kun'}
            </button>
        </header>
    );
}

export default React.memo(Header);
