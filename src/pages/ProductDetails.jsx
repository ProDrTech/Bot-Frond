import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../request/axios";
import { ToastContainer, toast } from "react-toastify";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import PrevBlack from '../assets/images/left_black.png';
import PrevWhite from '../assets/images/left_white.png';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './detail.css';
import { ThemeContext, UserID } from "../App";

function ProductDetails() {
  const [data, setData] = useState(null);
  const [selectorColor, setSelectorColor] = useState(null);
  const [selectorSize, setSelectorSize] = useState(null);
  const [isDisable, setIsDisable] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { userId, setUserId } = useContext(UserID);
  const [isAdult, setIsAdult] = useState(() => JSON.parse(localStorage.getItem('isAdult')));

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready(); // WebApp to‘liq yuklanguncha kutamiz
      const id = tg.initDataUnsafe?.user?.id;
      if (id) {
        console.log("Telegramdan olingan foydalanuvchi ID:", id);
        setUserId(id);
      }
    }
  }, []);

  const notify = (message, type = 'success', options = {}) => {
    const toastMethod = toast[type] || toast.success;
    toastMethod(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: toast.Bounce,
      className: 'custom-toast',
      ...options,
    });
  };

  useEffect(() => {
    console.log(`Fetching product details for ID: ${id}`); // Log product ID being fetched
    axiosInstance
      .get(`product_detail/${id}`)
      .then((response) => {
        console.log("Product details fetched:", response.data); // Log successful response
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error); // Log error
        notify("Mahsulot ma'lumotlarini olishda xatolik yuz berdi.", "error");
      });
  }, [id]);

  const handleAddCart = () => {
    if (!userId || userId === 'null') {
      notify("Foydalanuvchi aniqlanmadi!", "error");
      return;
    }

    if (!selectorColor) {
      notify("Iltimos mahsulot rangini tanlang!", "error");
      return;
    }

    if (!selectorSize) {
      notify("Iltimos mahsulot o'lchamini tanlang!", "error");
      return;
    }

    const payload = {
      product: data.id,
      color: selectorColor[0],
      size: selectorSize[0],
      user: userId,
      quantity: 1
    };

    axiosInstance.post('/cart/', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        notify("Mahsulot savatchaga qo'shildi!", "success", {
          onClose: () => navigate(-1)
        });
      })
      .catch(err => {
        console.error("Xatolik:", err.response?.data || err.message);
        notify("Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.", "error");
      });
  };


  return (
    <div className="bg-white dark:bg-black mx-auto max-w-[600px] min-h-dvh text-black dark:text-white">
      <ToastContainer />
      {data && (
        <>
          <div className="m-auto w-full overflow-hidden">
            <div className="relative flex items-center overflow-x-auto overflow-y-hidden">
              <Swiper
                spaceBetween={30}
                centeredSlides={false}
                pagination={{ clickable: true }}
                modules={[Autoplay, Pagination, Navigation]}
                className="shadow-md mb-2 detail mySwiper"
              >
                {
                  data.product_images.length > 0 ?
                    data.product_images.map((value, idx) => (
                      <SwiperSlide
                        key={idx}
                        className="relative z-50 rounded-b-lg w-full h-96 object-center"
                      >
                        <img
                          className={`rounded-b-lg w-full h-96 object-center ${isAdult === false && data.age_group === '18+' ? 'blur-[6px]' : ''}`}
                          src={value.image}
                          alt="Mahsulot rasmi"
                        />
                      </SwiperSlide>
                    )) :
                    <SwiperSlide className="relative z-50 rounded-b-lg w-full h-96 object-center">
                      <img
                        className={`rounded-b-lg w-full h-96 object-center ${isAdult === false && data.age_group === '18+' ? 'blur-[6px]' : ''}`}
                        src={data.category.image}
                        alt="Mahsulot rasmi"
                      />
                    </SwiperSlide>
                }
              </Swiper>
              <button
                onClick={() => { navigate(-1) }}
                className="top-2 left-2 z-50 absolute bg-black dark:bg-white p-2 rounded-lg"
              >
                <img
                  src={theme === 'light' ? PrevWhite : PrevBlack}
                  className="w-6"
                  alt="Orqaga"
                />
              </button>
              {data.promotion?.map((promo, idx) => (
                <div
                  key={promo.id || idx}
                  className="top-3 left-16 z-30 absolute bg-[#00C17B] rounded-md"
                  style={{ backgroundImage: `url(${promo.image})` }}
                >
                  <p className="px-2 rounded-md text-[12px] text-white">{promo.name}</p>
                </div>
              ))}
            </div>
            <div className="p-4">
              <h3 className="mb-2 font-semibold text-[22px]">{data.name}</h3>
              <p className="text-gray-400 text-sm">{data.description}</p>
              <div className="flex flex-col items-start bg-[#e7e7e7] dark:bg-[#1D2024] mt-5 mb-4 px-4 py-5 rounded-lg">
                <span className="font-bold text-[#00C17B] text-2xl">{data.discount_price}</span>
                <div className="flex justify-start items-center gap-3">
                  <span className="text-gray-500 line-through">{data.price}</span>
                  <span className="font-bold text-[#00C17B]">-{data.discount_percentage}%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-0 fixed bg-white dark:bg-[#2F3135] px-5 py-3 rounded-tl-xl rounded-tr-xl w-full max-w-[600px]">
            <button
              disabled={isDisable}
              onClick={handleAddCart}
              className="bg-black dark:bg-white disabled:opacity-70 py-2 rounded w-full font-semibold text-white dark:text-black disabled:cursor-not-allowed"
            >
              Savatga qo'shish
            </button>
          </div>
          <div className="bg-[#e7e7e7] dark:bg-[#1D2024] mx-auto mb-14 p-4 w-full max-h-[300px]">
            <h3 className="mb-2 font-semibold text-lg">
              Rang: {selectorColor?.[1] || <span className="text-[#fe2c30]">yoq</span>}
            </h3>
            <div className="flex justify-start space-x-4">
              {data.color?.map((color) => (
                <div
                  key={color.id}
                  onClick={() => {
                    console.log(`Color selected: ${color.name}`); // Log color selection
                    setSelectorColor([color.id, color.name]);
                  }}
                  className={`rounded-lg w-16 h-20 cursor-pointer border-black border-opacity-70 border dark:border-white ${selectorColor?.[0] === color.id ? "border-2 dark:border-gray-300 border-gray-800" : ""
                    }`}
                  style={{
                    backgroundImage: `url(${color.image || data.category.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <span className="sr-only">{color.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <h3 className="mb-2 font-semibold text-lg">
                O'lchami: {selectorSize?.[1] ? <span className="uppercase">{selectorSize[1]}</span> : <span className="text-[#fe2c30]">yoq</span>}
              </h3>
              <div className="flex justify-start space-x-2 mb-2">
                {data.size?.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => {
                      console.log(`Size selected: ${size.size_name}`); // Log size selection
                      setSelectorSize([size.id, size.size_name]);
                    }}
                    className={`dark:bg-gray-600 bg-gray-300 text-gray-600 border-black border-opacity-70 border dark:border-white dark:text-gray-200 rounded-lg w-12 h-14 font-medium text-sm ${selectorSize?.[0] === size.id ? "border-2 border-gray-800 dark:border-gray-300" : ""
                      }`}
                  >
                    {size.size_name.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default React.memo(ProductDetails);
