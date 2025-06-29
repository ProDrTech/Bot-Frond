import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import axiosInstance from '../request/axios'
import { PatternFormat } from 'react-number-format';
import { UserID } from '../App';

function Order() {
  const [paymentMethod, setPaymentMethod] = useState('Naqt pul');
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [user, setUser] = useState('');
  const [number, setNumber] = useState('');
  const [address, setAddress] = useState('');
  const [selectedViloyat, setSelectedViloyat] = useState('Toshkent Shahar');
  const { userId, setUserId } = useContext(UserID)
  const navigate = useNavigate();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    // if (tg && tg.initDataUnsafe?.user?.id) {
    //   setUserId(tg.initDataUnsafe.user.id);
    // } else {
    //   setUserId('null');
    // }
    setUserId(7318128389)
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
      transition: Bounce,
      className: 'custom-toast',
      ...options,
    });
  };

  function validate() {
    if (!user.trim()) {
      notify('Ism Familiyani kiriting!', 'error');
      return false;
    }
    if (!number) {
      notify('Telefon raqami kiritilmagan!', 'error');
      return false;
    }
    if (!address) {
      notify('Iltimos manzilingizni kiriting!', 'error');
      return false;
    }
    return true;
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Bosildi!")
    const isValid = validate();
    if (!isValid) {
      return;
    }

    const storedItems = JSON.parse(localStorage.getItem('count'));

    const formattedOrderItems = storedItems.map(item => ({
      product: item.product.id,
      color: item.color.id,
      size: item.size.id,
      quantity: item.quantity,
      price: item.product.discount_price
    }));

    const orderData = {
      "user": userId,
      "delivery_type": deliveryMethod,
      "payment_method": paymentMethod,
      "name": user,
      "phone": number,
      "country": selectedViloyat,
      "address": address,
      "order_items": formattedOrderItems,
    }
    console.log(orderData)
    axiosInstance.post('/order/', orderData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        notify("Buyurtma muvaffaqiyatli yuborildi!", "success", {
          onClose: () => {
            navigate("/");
          },
        });
      })
      .catch((error) => {
        notify('Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.', 'error');
        console.error(error);
      })
      .finally(() => {
        localStorage.removeItem("count");
        setPaymentMethod("cash");
        setDeliveryMethod("pickup");
        setSelectedViloyat('');
        setUser("");
        setNumber("");
        setAddress("");
      });
  }

  useEffect(() => {
    const count = JSON.parse(localStorage.getItem('count'));
    if (!count || count.length === 0) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-black mx-auto p-2.5 max-w-[600px] text-black dark:text-white select-none">
      <ToastContainer />
      <h1 className="mt-1 font-semibold text-2xl text-center">Buyurtma berish</h1>
      <div className="bg-[#e7e7e7] dark:bg-[#1D2024] mt-3 mb-2 p-2.5 rounded-xl">
        <p className="mb-2 font-semibold">To'lov Usuli</p>
        <div className="flex flex-col gap-2">
          {/* <label className="flex items-center gap-2">
            <input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={(e) => { setPaymentMethod(e.target.value) }} className="hidden peer" />
            <span className="flex justify-center items-center border-2 dark:border-white peer-checked:border-[#00C17B] peer-checked:bg-[#00C17B] border-black rounded-full w-5 h-5">
              <span className="bg-black dark:bg-white rounded-full w-3 h-3"></span>
            </span>Onlayn transfer
          </label> */}
          <label className="flex items-center gap-2">
            <input type="radio" name="paymentMethod" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => { setPaymentMethod(e.target.value) }} className="hidden peer" />
            <span className="flex justify-center items-center border-2 dark:border-white peer-checked:border-[#00C17B] peer-checked:bg-[#00C17B] border-black rounded-full w-5 h-5">
              <span className="bg-black dark:bg-white rounded-full w-3 h-3"></span>
            </span>Kuryerga naqd pul
          </label>
        </div>
        <br />
        <hr className='bg-black dark:bg-white' />
        <p className="mt-4 mb-2 font-semibold">Yetkazib berish usuli</p>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input type="radio" name="deliveryMethod" value="delivery" checked={deliveryMethod === 'delivery'} onChange={(e) => { setDeliveryMethod(e.target.value) }} className="hidden peer" />
            <span className="flex justify-center items-center border-2 dark:border-white peer-checked:border-[#00C17B] peer-checked:bg-[#00C17B] border-black rounded-full w-5 h-5">
              <span className="bg-black dark:bg-white rounded-full w-3 h-3"></span>
            </span>Yetkazib berish
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="deliveryMethod" value="pickup" checked={deliveryMethod === 'pickup'} onChange={(e) => { setDeliveryMethod(e.target.value) }} className="hidden peer" />
            <span className="flex justify-center items-center border-2 dark:border-white peer-checked:border-[#00C17B] peer-checked:bg-[#00C17B] border-black rounded-full w-5 h-5">
              <span className="bg-black dark:bg-white rounded-full w-3 h-3"></span>
            </span>Olib ketish
          </label>
        </div>
      </div>
      <div className="bg-[#e7e7e7] dark:bg-[#1D2024] p-4 rounded-xl">
        <div className="mb-4">
          <label className="block mb-1 text-sm dark:text-gray-300">Ism</label>
          <input value={user} onChange={(e) => { setUser(e.target.value) }} type="text" placeholder="F.I.O" className="border-gray-500 dark:bg-[#1D2024] p-2.5 border rounded-md focus:ring-2 focus:ring-[#00C17B] w-full dark:text-gray-300 focus:outline-none placeholder-gray-500" />
          <p className="mt-1 text-gray-500 text-sm">Ismingizni kiriting</p>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm dark:text-gray-300">Телефон</label>
          <PatternFormat format="+998 (##) ### ## ##" value={number} onChange={(e) => { setNumber(e.target.value) }} type="text" placeholder="+998 (99) 999 99 99" className="border-gray-500 dark:bg-[#1D2024] p-2.5 border rounded-md focus:ring-2 focus:ring-[#00C17B] w-full dark:text-gray-300 focus:outline-none placeholder-gray-500" />
          <p className="mt-1 text-gray-500 text-sm">Telefon raqamingizni kiriting</p>
        </div>
        <div className="mx-auto mb-4 max-w-[600px]">
          <label htmlFor="viloyat" className="block mb-1 text-sm dark:text-gray-300">
            Viloyatingizni tanlang:
          </label>
          <select id="viloyat" value={selectedViloyat} onChange={(e) => setSelectedViloyat(e.target.value)} className="border-gray-500 bg-transparent bg-white dark:bg-[#1D2024] p-2.5 border rounded-lg focus:ring-2 focus:ring-[#00C17B] w-full text-[16px] dark:text-white focus:outline-none" >
            <option className='bg-white dark:bg-black text-black dark:text-white' value="Toshkent Shahar">Toshkentdan shahridan tashqariga: 40 ming so'm.</option>
            <option className='bg-white dark:bg-black text-black dark:text-white' value="Andijon">Andijon</option>
            <option className='bg-white dark:bg-black text-black dark:text-white' value="Buxoro">Buxoro</option>
            <option className='bg-white dark:bg-black text-black dark:text-white' value="Jizzax">Jizzax</option>
            <option className='bg-white dark:bg-black text-black dark:text-white' value="Qashqadaryo">Qashqadaryo</option>
            <option className='bg-white dark:bg-black text-black dark:text-white' value="Navoiy">Navoiy</option>
            <option className='bg-white dark:bg-black text-black dark:text-white' value="Namangan">Namangan</option>
            <option className='bg-white dark:bg-black text-black dark:text-white' value="Samarqand">Samarqand</option>
            <option className='bg-white dark:bg-black text-black dark:text-white' value="Sirdaryo">Sirdaryo</option>
            <option className='bg-white dark:bg-black text-black dark:text-white' value="Surxondaryo">Surxondaryo</option>
            <option className='bg-white dark:bg-black text-black dark:text-white' value="Toshkent viloyati">Toshkent viloyati</option>
            <option className='bg-white dark:bg-black text-black dark:text-white' value="Fergana">Fergana</option>
            <option className='bg-white dark:bg-black text-black dark:text-white' value="Xorazm">Xorazm</option>
            <option className='bg-white dark:bg-black text-black dark:text-white' value="Qoraqalpog'iston">Qoraqalpog'iston</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm dark:text-gray-300">Manzil</label>
          <textarea value={address} onChange={(e) => { setAddress(e.target.value) }} placeholder="Manzilni kiriting.." className="border-gray-500 dark:bg-[#1D2024] p-2.5 border rounded-md focus:ring-2 focus:ring-[#00C17B] w-full dark:text-gray-300 focus:outline-none placeholder-gray-500" rows="4" ></textarea>
          <p className="mt-1 text-gray-500 text-sm">Siz muhim deb hisoblagan ma'lumotlarni ko'rsating!</p>
        </div>
      </div>
      <button type="submit" className='bg-black dark:bg-white mt-4 mb-2 p-2.5 rounded-md w-full font-semibold text-[18px] text-white dark:text-black transition-[0.4s]'>
        Yuborish
      </button>
    </form>
  );
}

export default React.memo(Order);