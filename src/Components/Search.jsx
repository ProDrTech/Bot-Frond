import React, { useContext } from 'react';
import Search from '../assets/images/search.png';
import { HeaderSearch } from '../App';

const Header = () => {
    const { setHeaderSearch } = useContext(HeaderSearch);

    return (
        <div className="top-0 z-30 sticky bg-[#fff] dark:bg-[#121212] shadow-md p-3 rounded-b-[18px] select-none">
            <div className="flex items-center gap-2 bg-[#ededed] dark:bg-[#2C2F33] px-2 py-1 rounded-md">
                <img src={Search} alt="Search Icon" className="w-5 h-5" />
                <input
                    onChange={(e) => setHeaderSearch(e.target.value)}
                    type="text"
                    placeholder="Qidiruv..."
                    className="bg-[#ededed] dark:bg-[#2C2F33] w-full text-[16px] text-black dark:text-[#EDEDED] dark:placeholder:text-[#A3A3A3] placeholder:text-[#7D7D7D] outline-none"
                />
            </div>
        </div>
    );
};

export default React.memo(Header);
