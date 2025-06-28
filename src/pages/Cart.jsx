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
  const { theme } = useContext(ThemeContext)
  const dispatch = useDispatch();
  const { cart } = useSelector(state => state.cart)
  const [total, setTotal] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initDataUnsafe?.user?.id) {
      setUserId(tg.initDataUnsafe.user.id);
    } else {
      setUserId('null');
    }
  }, []);

  useEffect(() => {
    if (cart && Array.isArray(cart)) {
      let tp = 0;
      let sum = 0;
      cart.forEach((c) => {
        sum += c.quantity || 0;
        tp += (c.product.discount_price || 0) * (c.quantity || 0);
      });
      setTotal(sum);
      setTotalPrice(tp);
    } else {
      console.error("Cart data is not valid:", cart);
    }
  }, [cart]);

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
      theme: theme == 'light' ? "dark" : 'light',
      transition: Bounce,
      className: 'custom-toast',
      ...options,
    });
  };

  useEffect(() => {
    axiosInstance
      .get(`cart/${5765144405}`)
      .then((response) => {
        const fetchedProducts = response.data;
        const storedProducts = JSON.parse(localStorage.getItem("count")) || [];
        if (storedProducts.length === 0) {
          const filteredProducts = fetchedProducts.filter(
            (product) => product.quantity >= 1
          );
          localStorage.setItem("count", JSON.stringify(filteredProducts));
          dispatch(setCart(filteredProducts));
          return;
        }
        const updatedProducts = fetchedProducts.map((backendProduct) => {
          const isInLocalStorage = storedProducts.some(
            (storedProduct) => storedProduct.id === backendProduct.id
          );
          if (!isInLocalStorage && backendProduct.quantity >= 1) {
            return backendProduct;
          }
          const matchingStoredProduct = storedProducts.find(
            (storedProduct) => storedProduct.id === backendProduct.id
          );
          if (matchingStoredProduct) {
            if (backendProduct.quantity > matchingStoredProduct.quantity) {
              return {
                ...backendProduct,
                quantity: backendProduct.quantity,
              };
            }
            return matchingStoredProduct;
          }
          return null;
        }).filter(Boolean);
        const nonMatchingStoredProducts = storedProducts.filter(
          (storedProduct) =>
            !fetchedProducts.some(
              (backendProduct) => backendProduct.id === storedProduct.id
            )
        );
        const finalProducts = [...updatedProducts, ...nonMatchingStoredProducts];
        localStorage.setItem("count", JSON.stringify(finalProducts));
        dispatch(setCart(finalProducts));
      })
      .catch((err) => {
        console.error(err);
      });
  }, [userId]);


  function handleIncrement(item) {
    const localStorageKey = "count";
    const storedItems = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    const updatedItems = storedItems.map((storedItem) =>
      storedItem.id === item.id && storedItem.color.id === item.color.id && storedItem.size.id === item.size.id
        ? { ...storedItem, quantity: storedItem.quantity + 1 }
        : storedItem
    );
    dispatch(update({ ...item, quantity: item.quantity + 1 }));
    localStorage.setItem(localStorageKey, JSON.stringify(updatedItems));
    setTotal((prev) => prev + 1);
    setTotalPrice((prev) => prev + item.product.discount_price);
  }

  function handleDecrement(item) {
    const localStorageKey = "count";
    const storedItems = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    if (item.quantity > 1) {
      const updatedItems = storedItems.map((storedItem) =>
        storedItem.id === item.id && storedItem.color.id === item.color.id && storedItem.size.id === item.size.id
          ? { ...storedItem, quantity: storedItem.quantity - 1 }
          : storedItem
      );
      dispatch(update({ ...item, quantity: item.quantity - 1 }));
      localStorage.setItem(localStorageKey, JSON.stringify(updatedItems));
      setTotal((prev) => prev - 1);
      setTotalPrice((prev) => prev - item.product.discount_price);
    } else {
      console.warn("Cannot decrement. Quantity is already at the minimum value of 1.");
    }
  }

  function handleRemove(item) {
    setIsDisable(true);
    const localStorageKey = "count";
    const CustomConfirmToast = () => (
      <div>
        <p className="text-black">Mahsulotni savatdan o‘chirishni istaysizmi?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              axiosInstance
                .delete(`/cart/${userId}/${item.id}/`)
                .then((res) => {
                  axiosInstance
                    .get(`cart/${userId}`)
                    .then((response) => {
                      const updatedCart = response.data;
                      dispatch(setCart(updatedCart));
                      const storedItems = JSON.parse(localStorage.getItem(localStorageKey)) || [];
                      const filteredItems = storedItems.filter(
                        (storedItem) => storedItem.id !== item.id || storedItem.color.id !== item.color.id || storedItem.size.id !== item.size.id
                      );
                      localStorage.setItem(localStorageKey, JSON.stringify(filteredItems));
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                  toast.dismiss();
                  notify("Mahsulot o‘chirildi!", "success");
                })
                .catch((err) => {
                  console.error(err);
                  toast.dismiss();
                  notify("Xatolik yuz berdi!", "error");
                })
                .finally(() => {
                  setIsDisable(false);
                });
            }}
            className="bg-[#00C17B] px-3 py-1 rounded text-white"
          >
            Ha
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-red-500 px-3 py-1 rounded text-white"
          >
            Yo'q
          </button>
        </div>
      </div>
    );

    toast.info(<CustomConfirmToast />, { autoClose: false, closeOnClick: false });
  }

  function handleClick() {
    if (cart.length === 0) {
      notify("Buyurtma berish uchun avval savatga mahsulot qo'shing!", 'error');
      return;
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
          <h2 className="font-semibold text-2xl text-start dark:text-white">Savat</h2>
          <Link className="border-b border-b-black dark:border-b-white capitalize" to='/'>bosh sahifaga</Link>
        </div>
        {cart && cart.length === 0 ? (
          <p className="px-4 dark:text-white">Savat bo'sh.</p>
        ) : (
          <div className="flex flex-col justify-center border-[#c1c6cf] dark:border-[#484A4E] mb-20 p-4 border-t-[1px] w-full">
            {cart.length && Array.isArray(cart) && cart.map((item) => (
              <div key={`${item.id}-${item.color.id}-${item.size.id}`} className="flex items-center border-[#c1c6cf] dark:border-gray-700 my-4 mb-4 pb-4 border-b">
                <img src={item.product.main_image} alt={item.product.name} className="shadow-md rounded-md w-[75px] h-[75px] object-cover" />
                <div className="flex justify-between items-start w-full">
                  <div className="flex-grow ml-4">
                    <div className="flex gap-4 w-full">
                      <h3 className="font-medium text-base dark:text-white">{item.product.name}</h3>
                      <p className="font-bold text-4 dark:text-white">{item.product.discount_price} UZS</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p>Hajmi: <span className="uppercase">{item.size.size_name}</span></p>
                      <p className="flex items-center gap-1">Rangi: {item.color.name}</p>
                    </div>
                    <div className="flex items-center mt-2">
                      <button onClick={() => handleDecrement(item, item.id)} className="flex justify-center items-center bg-[#e7e7e7] dark:bg-gray-700 rounded-l w-5 h-5 text-sm dark:text-white"> - </button>
                      <span className="flex justify-center items-center bg-[#cdcdcd] dark:bg-gray-600 w-14 h-5 text-[12px] dark:text-white">{item.quantity} dona</span>
                      <button onClick={() => handleIncrement(item)} className="flex justify-center items-center bg-[#e7e7e7] dark:bg-gray-700 rounded-r w-5 h-5 text-sm dark:text-white"> + </button>
                    </div>
                  </div>
                  <button disabled={isDisable} onClick={() => handleRemove(item)} className="bg-white mt-2 rounded-full underline"> <img src={Delete} className="w-6 h-6" alt="delete" /> </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="bottom-0 fixed bg-[#EDEDED] dark:bg-[#121212] mx-auto p-4 rounded-tl-[30px] rounded-tr-[30px] w-full max-w-[600px]">
          <div className="mb-4 text-sm dark:text-gray-300">
            <div className="flex justify-between mb-4">
              <span>Buyurtma miqdori</span>
              <p>{total}</p>
            </div>
            <hr className="border-[#484A4E]" />
            <div className="flex justify-between mt-2">
              <span>Yetkazib berish</span>
              <span className="text-[#00C17B]">Toshkent tashqarisi: 40.000 UZS</span>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4 font-medium text-lg dark:text-white">
            <span>Jami</span>
            <p>{isNaN(totalPrice) ? 0 : Math.trunc(totalPrice)} UZS</p>
          </div>
          <button
            onClick={handleClick}
            className="bg-black dark:bg-white py-2 rounded w-full font-medium text-center text-white dark:text-black transition"
          >
            Qabul qilaman
          </button>
        </div>
      </div >
    </>
  );
}

export default React.memo(Cart);