import React, { useContext, useState, useEffect } from 'react';
import Cart from '../assets/images/cart.png';
import CartWhite from '../assets/images/cart_white.png';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';

function ToCart() {
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    return (
        <div onClick={() => { navigate('/cart'); }} className={`right-3 z-40 bottom-3 fixed flex justify-center items-center bg-black dark:bg-white shadow-lg p-2 rounded-[20px] cursor-pointer`} >
            <img src={theme === 'light' ? CartWhite : Cart} alt="Cart" className="w-10 h-10" />
        </div>
    );
}

export default React.memo(ToCart);
