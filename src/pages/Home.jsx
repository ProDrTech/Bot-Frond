import React, { useContext, useEffect, useState } from 'react';
import Search from '../Components/Search';
import Hero from '../Components/Hero';
import axiosInstance from '../request/axios';
import { Puff } from 'react-loader-spinner';
import { HeaderSearch, ThemeContext, UserID } from '../App';
import NotFound from '../assets/images/notFound.png';
import { Link, useNavigate } from 'react-router-dom';
import ToCart from '../Components/ToCart';
import Advertisement from '../Components/Advertisement';
import Logo from '../assets/images/logo.png';

const Home = () => {
    const { headerSearch } = useContext(HeaderSearch);
    const { theme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [showModal, setShowModal] = useState(true);
    const { userId, setUserId } = useContext(UserID)

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axiosInstance
            .get('/category')
            .then((response) => {
                if (response.status === 200) {
                    setData(response.data);
                    setFilteredData(response.data);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const tg = window.Telegram?.WebApp;

        if (tg && tg.initDataUnsafe?.user?.id) {
            setUserId(tg.initDataUnsafe.user.id);
        } else {
            setUserId('null');
        }
    }, []);

    useEffect(() => {
        if (headerSearch) {
            setFilteredData(
                data.filter((product) =>
                    product.name.toLowerCase().includes(headerSearch.toLowerCase())
                )
            );
        } else {
            setFilteredData(data);
        }
    }, [headerSearch, data]);

    useEffect(() => {
        const isFirstVisit = localStorage.getItem('isFirstVisit');
        if (!isFirstVisit) {
            setShowModal(true);
            localStorage.setItem('isFirstVisit', 'false');
        } else {
            setShowModal(false);
        }
    }, []);

    useEffect(() => {
        if (showModal) {
            const timer = setTimeout(() => {
                setShowModal(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showModal]);

    function handleRedirect(id) {
        navigate(`/product/${id}`);
    }

    return (
        <div
            className={`flex flex-col mx-auto ${theme === 'light'
                ? 'bg-[#fff] text-black shadow-md'
                : 'bg-black text-white shadow-lg'
                }`}
        >
            {showModal && (
                <div className="z-50 fixed inset-0 flex justify-center items-center bg-black">
                    <img src={Logo} alt="Logo" className="w-36 h-36 animate-pulse" />
                </div>
            )}
            {loading ? (
                <div className="flex justify-center items-center mb-20 pt-[200px] w-full h-full max-h-[500px]">
                    <Puff
                        visible={true}
                        height="80"
                        width="80"
                        color={theme === 'light' ? '#000' : '#fff'}
                        ariaLabel="puff-loading"
                        wrapperStyle={{}}
                        wrapperclassName=""
                    />
                </div>
            ) : (
                <>
                    <Advertisement />
                    <Search />
                    <Hero />
                    {filteredData.length > 0 ? (
                        <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 px-3 pb-6 text-white">
                            {filteredData.map((product, index) => (
                                <div onClick={() => { handleRedirect(product.name); }} key={index} className={`relative bg-cover rounded-lg w-full h-[120px] shadow-sm shadow-black dark:shadow-white md:h-[150px] lg:h-[180px] transition-transform duration-300`} style={{ backgroundImage: `url(${product.image})` }}>
                                    <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg"></div>
                                    <h3 className="bottom-[10px] left-[10px] z-10 absolute max-w-[130px] font-bold text-sm sm:text-md md:text-lg leading-[20px]">
                                        {product.name}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center my-10">
                            <img
                                className="opacity-80 mb-[8px] max-w-[150px]"
                                src={NotFound}
                                alt="Not Found"
                            />
                            <h3 className="font-semibold text-black text-lg dark:text-white">
                                Qaysi mahsulotni qidiryapsiz?
                            </h3>
                        </div>
                    )}
                </>
            )}
            <ToCart />
        </div>
    );
};
export default React.memo(Home);