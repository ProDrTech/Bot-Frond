import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import axiosInstance from '../request/axios';
import { PatternFormat } from 'react-number-format';
import { UserID } from '../App';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


function Order() {
  const [paymentMethod, setPaymentMethod] = useState('Naqt pul');
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [user, setUser] = useState('');
  const [number, setNumber] = useState('');
  const [address, setAddress] = useState('');
  const [selectedViloyat, setSelectedViloyat] = useState('Toshkent Shahar');
  const { userId, setUserId } = useContext(UserID);
  const navigate = useNavigate();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initDataUnsafe?.user?.id) {
      setUserId(tg.initDataUnsafe.user.id);
    } else {
      setUserId('null');
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
    if (!number || number.length < 10 || !number.startsWith('+')) {
      notify('Telefon raqami noto‘g‘ri!', 'error');
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
    const isValid = validate();
    if (!isValid) return;

    const storedItems = JSON.parse(localStorage.getItem('count')) || [];

    const formattedOrderItems = storedItems
      .filter(item => item.product && item.color && item.size)
      .map(item => ({
        product: item.product.id,
        color: item.color.id,
        size: item.size.id,
        quantity: item.quantity,
        price: item.product.discount_price
      }));

    if (formattedOrderItems.length === 0) {
      notify("Buyurtma uchun mahsulotlar topilmadi!", "error");
      return;
    }

  const orderData = {
    user: userId,
    delivery_type: deliveryMethod,
    payment_method: paymentMethod,
    name: user,
    phone: number, // bu yerga react-phone-input-2 dan kelgan raqam
    country: selectedViloyat,
    address: address,
    order_items: formattedOrderItems,
  };

    axiosInstance.post('/order/', orderData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        notify("Buyurtma muvaffaqiyatli yuborildi!", "success", {
          onClose: () => navigate("/"),
        });
      })
      .catch((error) => {
        notify('Buyurtma yuborishda xatolik!', 'error');
        console.error(error);
      })
      .finally(() => {
        localStorage.removeItem("count");
        setPaymentMethod("Naqt pul");
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
    <form onSubmit={handleSubmit} className="bg-white dark:bg-black mx-auto p-4 md:p-6 max-w-[600px] text-black dark:text-white rounded-xl shadow-md select-none">
      <ToastContainer />

      {/* Ortga tugmasi */}
      <button
        type="button"
        onClick={() => navigate('/cart')}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#00C17B] transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Ortga (Savatga qaytish)
      </button>

      <h1 className="text-3xl font-bold text-center mb-4">Buyurtma berish</h1>

      {/* To'lov usuli */}
      <div className="bg-[#f1f1f1] dark:bg-[#1D2024] p-4 rounded-xl mb-6">
        <p className="text-lg font-semibold mb-3">To‘lov usuli</p>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col items-start gap-2 p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm">
            <input
              type="radio"
              name="paymentMethod"
              value="Naqt pul"
              checked={paymentMethod === 'Naqt pul'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="hidden peer"
            />
            <div className="flex items-center gap-3">
              <span className="flex justify-center items-center border-2 dark:border-white peer-checked:border-[#00C17B] peer-checked:bg-[#00C17B] border-black rounded-full w-5 h-5">
                <span className="bg-black dark:bg-white rounded-full w-3 h-3"></span>
              </span>
              <span className="font-medium text-base text-gray-800 dark:text-white">Payme orqali</span>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
              <strong>Muhim eslatma:</strong> buyurtmadagi tovar uchun <span className="text-[#00C17B] font-semibold">oldindan to‘lov</span> qilinadi. To‘lovni amalga oshirish uchun <span className="font-semibold text-gray-800 dark:text-white">botdagi “Buyurtmalarim”</span> tugmasini bosing va <span className="font-semibold text-[#00C17B]">Payme</span> orqali to‘lovni amalga oshiring.
            </p>
          </label>
        </div>
      </div>

      {/* Yetkazib berish usuli */}
      <div className="mb-6">
        <p className="text-lg font-semibold mb-3">Yetkazib berish usuli</p>
        <div className="flex flex-col gap-3">
          {["delivery", "pickup"].map((type, index) => (
            <label key={index} className="flex items-center gap-2">
              <input
                type="radio"
                name="deliveryMethod"
                value={type}
                checked={deliveryMethod === type}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                className="hidden peer"
              />
              <span className="flex justify-center items-center border-2 dark:border-white peer-checked:border-[#00C17B] peer-checked:bg-[#00C17B] border-black rounded-full w-5 h-5">
                <span className="bg-black dark:bg-white rounded-full w-3 h-3"></span>
              </span>
              {type === "delivery" ? "Yetkazib berish" : "Olib ketish"}
            </label>
          ))}
        </div>
      </div>

      {/* Shaxsiy ma'lumotlar */}
      <div className="bg-[#f1f1f1] dark:bg-[#1D2024] p-4 rounded-xl">
        {/* Ism */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium dark:text-gray-300">Ism</label>
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            type="text"
            placeholder="F.I.O"
            className="w-full p-2.5 border border-gray-500 dark:bg-[#2A2D32] dark:text-white rounded-md focus:ring-2 focus:ring-[#00C17B] focus:outline-none placeholder-gray-500"
          />
          <p className="mt-1 text-gray-500 text-sm">Ismingizni kiriting</p>
        </div>

        {/* Telefon */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium dark:text-gray-300">Telefon</label>
          <PhoneInput
            country={'uz'}
            value={number}
            onChange={(phone) => setNumber(`+${phone}`)}
            inputProps={{
              name: 'phone',
              required: true,
              autoFocus: true
            }}
            inputStyle={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid gray',
              backgroundColor: theme === 'dark' ? '#2A2D32' : '#fff',
              color: theme === 'dark' ? '#fff' : '#000'
            }}
            containerStyle={{ width: '100%' }}
            buttonStyle={{
              borderRight: '1px solid gray',
              backgroundColor: theme === 'dark' ? '#2A2D32' : '#fff',
            }}
          />
          <p className="mt-1 text-gray-500 text-sm">Telefon raqamingizni to‘liq kiriting (masalan: +998901234567 yoki +79689128274)</p>
        </div>


        {/* Viloyat */}
        <div className="mb-4">
          <label htmlFor="viloyat" className="block mb-1 text-sm font-medium dark:text-gray-300">Viloyatingizni tanlang</label>
          <select
            id="viloyat"
            value={selectedViloyat}
            onChange={(e) => setSelectedViloyat(e.target.value)}
            className="w-full p-2.5 border border-gray-500 rounded-lg bg-white dark:bg-[#2A2D32] dark:text-white focus:ring-2 focus:ring-[#00C17B] focus:outline-none text-[16px]"
          >
            {[
              "Toshkent Shahar", "Andijon", "Buxoro", "Jizzax", "Qashqadaryo",
              "Navoiy", "Namangan", "Samarqand", "Sirdaryo", "Surxondaryo",
              "Toshkent viloyati", "Fergana", "Xorazm", "Qoraqalpog'iston"
            ].map((viloyat, i) => (
              <option key={i} value={viloyat} className="bg-white dark:bg-black text-black dark:text-white">
                {viloyat}
              </option>
            ))}
          </select>
        </div>

        {/* Manzil */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium dark:text-gray-300">Manzil</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Manzilni kiriting..."
            rows="4"
            className="w-full p-2.5 border border-gray-500 dark:bg-[#2A2D32] dark:text-white rounded-md focus:ring-2 focus:ring-[#00C17B] focus:outline-none placeholder-gray-500"
          ></textarea>
          <p className="mt-1 text-gray-500 text-sm">Siz muhim deb hisoblagan ma’lumotlarni yozing</p>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="mt-6 bg-black dark:bg-white text-white dark:text-black w-full p-3 rounded-md text-lg font-semibold hover:opacity-90 transition"
      >
        Yuborish
      </button>
    </form>
  );
}

export default React.memo(Order);
