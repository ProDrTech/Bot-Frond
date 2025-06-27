import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/logo.png';
import Moon from '../assets/images/icon/moon.svg';
import Sun from '../assets/images/icon/sun.svg';
import { ThemeContext } from '../App';

function Header() {
    const { theme, setTheme } = useContext(ThemeContext);

    function handleChangeTheme(e) {
        e.preventDefault();
        setTheme(theme === 'light' ? 'dark' : 'light');
    }

    return (
        <header
            className={`relative z-20 flex justify-between items-center py-2 px-6 shadow-md transition-all ${theme === 'light' ? 'bg-[#f8f9fa] text-[#343a40]' : 'bg-[#121212] text-[#e9ecef]'
                }`}
        >
            <Link to="/">
                <img
                    src={Logo}
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
