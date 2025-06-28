import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCart, update } from "../store/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import Delete from '../assets/images/delete.png';
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from '../Components/Header';
import axiosInstance from "../request/axios";
import { ThemeContext, UserID } from "../App";

function Cart() {
  const navigate = useNavigate();
  const [isDisable, setIsDisable] = useState(false);
  const { userId, setUserId } = useContext(UserID);
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { cart } = useSelector(state => state.cart);
  const [total, setTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Telegram foydalanuvchisining userId sini olish
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user?.id) {
      setUserId(tg.initDataUnsafe.user.id);
    } else {
      setUserId('null');
    }
  }, []);

  // Cart ichidagi mahsulotlar soni va narxini hisoblash
  useEffect(() => {
    if (cart && Array.isArray(cart)) {
      let sum = 0;
      let tp = 0;
      cart.forEach((c) => {
        sum += c.quantity || 0;
        tp += (c.product.discount_price || 0) * (c.quantity || 0);
      });
      setTotal(sum);
      setTotalPrice(tp);
    }
  }, [cart]);

  // Dinamik userId orqali backenddan cartni olish
  useEffect(() => {
    if (!userId || userId === 'null') return;

    axiosInstance
      .get(`cart/${userId.toString()}`)
      .then((response) => {
        const fetchedProducts = response.data;
        const storedProducts = JSON.parse(localStorage.getItem("count")) || [];

        if (storedProducts.length === 0) {
          const filteredProducts = fetchedProducts.filter(p => p.quantity >= 1);
          localStorage.setItem("count", JSON.stringify(filteredProducts));
          dispatch(setCart(filteredProducts));
          return;
        }

        const updatedProducts = fetchedProducts.map((backendProduct) => {
          const storedMatch = storedProducts.find(storedProduct => storedProduct.id === backendProduct.id);
          if (!storedMatch && backendProduct.quantity >= 1) return backendProduct;
          if (storedMatch) {
            return backendProduct.quantity > storedMatch.quantity
              ? { ...backendProduct, quantity: backendProduct.quantity }
              : storedMatch;
          }
          return null;
        }).filter(Boolean);

        const nonMatchingStored = storedProducts.filter(
          stored => !fetchedProducts.some(backend => backend.id === stored.id)
        );

        const finalProducts = [...updatedProducts, ...nonMatchingStored];
        localStorage.setItem("count", JSON.stringify(finalProducts));
        dispatch(setCart(finalProducts));
      })
      .catch(err => console.error("Cart fetch error:", err?.response?.data || err.message));
  }, [userId]);

  const notify = (message, type = 'success', options = {}) => {
    const toastMethod = toast[type] || toast.success;
    toastMethod(message, {
      position: "top-center",
      autoClose: 3000,
      theme: theme === 'light' ? "dark" : 'light',
      transition: Bounce,
      className: 'custom-toast',
      ...options,
    });
  };

  function handleIncrement(item) {
    const key = "count";
    const stored = JSON.parse(localStorage.getItem(key)) || [];
    const updated = stored.map(storedItem =>
      storedItem.id === item.id && storedItem.color.id === item.color.id && storedItem.size.id === item.size.id
        ? { ...storedItem, quantity: storedItem.quantity + 1 }
        : storedItem
    );
    dispatch(update({ ...item, quantity: item.quantity + 1 }));
    localStorage.setItem(key, JSON.stringify(updated));
    setTotal(t => t + 1);
    setTotalPrice(p => p + item.product.discount_price);
  }

  function handleDecrement(item) {
    const key = "count";
    const stored = JSON.parse(localStorage.getItem(key)) || [];
    if (item.quantity > 1) {
      const updated = stored.map(storedItem =>
        storedItem.id === item.id && storedItem.color.id === item.color.id && storedItem.size.id === item.size.id
          ? { ...storedItem, quantity: storedItem.quantity - 1 }
          : storedItem
      );
      dispatch(update({ ...item, quantity: item.quantity - 1 }));
      localStorage.setItem(key, JSON.stringify(updated));
      setTotal(t => t - 1);
      setTotalPrice(p => p - item.product.discount_price);
    }
  }

  function handleRemove(item) {
    setIsDisable(true);
    const key = "count";
    const ConfirmToast = () => (
      <div>
        <p className="text-black">Mahsulotni o‘chirmoqchimisiz?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              axiosInstance
                .delete(`/cart/${userId}/${item.id}/`)
                .then(() => {
                  axiosInstance.get(`cart/${userId}`).then(res => {
                    dispatch(setCart(res.data));
                    const stored = JSON.parse(localStorage.getItem(key)) || [];
                    const filtered = stored.filter(
                      storedItem => storedItem.id !== item.id ||
                        storedItem.color.id !== item.color.id ||
                        storedItem.size.id !== item.size.id
                    );
                    localStorage.setItem(key, JSON.stringify(filtered));
                  });
                  toast.dismiss();
                  notify("O‘chirildi!");
                })
                .catch(() => {
                  toast.dismiss();
                  notify("Xatolik!", "error");
                })
                .finally(() => setIsDisable(false));
            }}
            className="bg-[#00C17B] px-3 py-1 rounded text-white"
          >Ha</button>
          <button onClick={() => toast.dismiss()} className="bg-red-500 px-3 py-1 rounded text-white">Yo‘q</button>
        </div>
      </div>
    );
    toast.info(<ConfirmToast />, { autoClose: false });
  }

  function handleClick() {
    if (cart.length === 0) {
      notify("Savat bo‘sh!", "error");
    } else {
      navigate("/order");
    }
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-start bg-white dark:bg-black mx-auto py-4 w-full max-w-[600px] h-[70vh] text-black dark:text-white overflow-y-auto select-none">
        <ToastContainer />
        <div className="flex justify-between items-center mb-4 px-4 w-full">
          <h2 className="font-semibold text-2xl dark:text-white">Savat</h2>
          <Link className="border-b capitalize dark:border-white" to='/'>bosh sahifaga</Link>
        </div>
        {cart.length === 0 ? (
          <p className="px-4 dark:text-white">Savat bo'sh.</p>
        ) : (
          <div className="flex flex-col border-t mb-20 p-4 w-full">
            {cart.map(item => (
              <div key={`${item.id}-${item.color.id}-${item.size.id}`} className="flex items-center border-b my-4 pb-4">
                <img src={item.product.main_image} alt={item.product.name} className="rounded-md w-[75px] h-[75px]" />
                <div className="flex-grow ml-4">
                  <div className="flex justify-between">
                    <h3 className="text-base font-medium">{item.product.name}</h3>
                    <p className="font-bold">{item.product.discount_price} UZS</p>
                  </div>
                  <p>Hajmi: <span>{item.size.size_name}</span> | Rangi: {item.color.name}</p>
                  <div className="flex mt-2">
                    <button onClick={() => handleDecrement(item)} className="bg-gray-300 px-2">-</button>
                    <span className="px-4">{item.quantity}</span>
                    <button onClick={() => handleIncrement(item)} className="bg-gray-300 px-2">+</button>
                  </div>
                </div>
                <button disabled={isDisable} onClick={() => handleRemove(item)} className="ml-2"><img src={Delete} alt="delete" className="w-6 h-6" /></button>
              </div>
            ))}
          </div>
        )}
        <div className="fixed bottom-0 bg-[#EDEDED] dark:bg-[#121212] p-4 w-full max-w-[600px] rounded-t-3xl">
          <div className="text-sm mb-4">
            <div className="flex justify-between"><span>Miqdori:</span><span>{total}</span></div>
            <div className="flex justify-between mt-2"><span>Yetkazib berish:</span><span>40,000 UZS</span></div>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Jami:</span><span>{isNaN(totalPrice) ? 0 : Math.trunc(totalPrice)} UZS</span>
          </div>
          <button onClick={handleClick} className="mt-4 w-full py-2 bg-black text-white dark:bg-white dark:text-black rounded">Qabul qilaman</button>
        </div>
      </div>
    </>
  );
}

export default React.memo(Cart);
