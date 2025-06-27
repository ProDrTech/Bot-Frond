import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './styles.css';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../request/axios';

function Hero() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    useEffect(() => {
        axiosInstance.get('/banner')
            .then(response => {
                setData(response.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    function handleRedirect(id) {
        navigate(`/promotion/${id}`)
    }

    return (
        <>
            {
                data.length > 0 ? <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="shadow-lg mt-2 mb-4 mySwiper"
                >
                    {
                        data.length > 0 && data.map((value, index) => (
                            <SwiperSlide onClick={() => { handleRedirect(value.id) }} key={index} className='rounded-lg w-full h-full object-cover'>
                                <img src={value.image} className='px-1 rounded-xl w-full h-full object-center object-cover' />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
                    : ''
            }
        </>
    );
}

export default React.memo(Hero);