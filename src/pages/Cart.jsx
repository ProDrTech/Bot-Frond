// Cart.jsx
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCart, update } from "../store/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import Delete from "../assets/images/delete.png";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../Components/Header";
import axiosInstance from "../request/axios";
import { ThemeContext, UserID } from "../App";

function Cart() {
  const navigate = useNavigate();
  const [isDisable, setIsDisable] = useState(false);
  const { userId, setUserId } = useContext(UserID);
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const [total, setTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user?.id) {
      setUserId(tg.initDataUnsafe.user.id);
    } else {
      setUserId(null);
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
    }
  }, [cart]);

  const notify = (message, type = "success", options = {}) => {
    const toastMethod = toast[type] || toast.success;
    toastMethod(message, {
      position: "top-center",
      autoClose: 3000,
      theme: theme === "light" ? "dark" : "light",
      transition: Bounce,
      ...options,
    });
  };

  useEffect(() => {
    if (!userId) return;

    axiosInstance
      .get(`cart/${userId}/`)
      .then((response) => {
        const fetched = response.data;
        const stored = JSON.parse(localStorage.getItem("count")) || [];

        if (!stored.length) {
          const filtered = fetched.filter((p) => p.quantity >= 1);
          localStorage.setItem("count", JSON.stringify(filtered));
          dispatch(setCart(filtered));
          return;
        }

        const updated = fetched
          .map((backend) => {
            const localMatch = stored.find((s) => s.id === backend.id);
            if (!localMatch && backend.quantity >= 1) return backend;
            if (localMatch) {
              return backend.quantity > localMatch.quantity ? { ...backend } : localMatch;
            }
            return null;
          })
          .filter(Boolean);

        const remaining = stored.filter(
          (s) => !fetched.some((b) => b.id === s.id)
        );

        const final = [...updated, ...remaining];
        localStorage.setItem("count", JSON.stringify(final));
        dispatch(setCart(final));
      })
      .catch((err) => console.error("Cart fetch error:", err));
  }, [userId]);

  function handleIncrement(item) {
    const stored = JSON.parse(localStorage.getItem("count")) || [];
    const updated = stored.map((s) =>
      s.id === item.id && s.color.id === item.color.id && s.size.id === item.size.id
        ? { ...s, quantity: s.quantity + 1 }
        : s
    );
    dispatch(update({ ...item, quantity: item.quantity + 1 }));
    localStorage.setItem("count", JSON.stringify(updated));
    setTotal((prev) => prev + 1);
    setTotalPrice((prev) => prev + item.product.discount_price);
  }

  function handleDecrement(item) {
    const stored = JSON.parse(localStorage.getItem("count")) || [];
    if (item.quantity <= 1) return;

    const updated = stored.map((s) =>
      s.id === item.id && s.color.id === item.color.id && s.size.id === item.size.id
        ? { ...s, quantity: s.quantity - 1 }
        : s
    );
    dispatch(update({ ...item, quantity: item.quantity - 1 }));
    localStorage.setItem("count", JSON.stringify(updated));
    setTotal((prev) => prev - 1);
    setTotalPrice((prev) => prev - item.product.discount_price);
  }

  function handleRemove(item) {
    setIsDisable(true);
    const CustomConfirmToast = () => (
      <div>
        <p className="text-black">Mahsulotni o‘chirmoqchimisiz?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              axiosInstance
                .delete(`cart/${userId}/${item.id}/`)
                .then(() => {
                  return axiosInstance.get(`cart/${userId}/`);
                })
                .then((res) => {
                  const updatedCart = res.data;
                  dispatch(setCart(updatedCart));
                  const stored = JSON.parse(localStorage.getItem("count")) || [];
                  const filtered = stored.filter(
                    (s) =>
                      s.id !== item.id ||
                      s.color.id !== item.color.id ||
                      s.size.id !== item.size.id
                  );
                  localStorage.setItem("count", JSON.stringify(filtered));
                  notify("Mahsulot o‘chirildi");
                })
                .catch(() => notify("Xatolik yuz berdi", "error"))
                .finally(() => setIsDisable(false));
              toast.dismiss();
            }}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Ha
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Yo'q
          </button>
        </div>
      </div>
    );

    toast.info(<CustomConfirmToast />, { autoClose: false });
  }

  function handleClick() {
    if (!cart.length) {
      notify("Savat bo‘sh", "error");
      return;
    }
    navigate("/order");
  }

  return (
    <>
      <Header />
      <div className="bg-white dark:bg-black text-black dark:text-white max-w-[600px] mx-auto w-full h-[70vh] overflow-y-auto">
        <ToastContainer />
        <div className="flex justify-between p-4">
          <h2 className="text-2xl font-semibold">Savat</h2>
          <Link to="/" className="underline">
            Bosh sahifa
          </Link>
        </div>

        {cart && cart.length ? (
          <div className="p-4 space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.color.id}-${item.size.id}`}
                className="flex items-center border-b pb-4"
              >
                <img
                  src={item.product.main_image}
                  alt={item.product.name}
                  className="w-[75px] h-[75px] object-cover rounded shadow"
                />
                <div className="ml-4 flex-grow">
                  <h3 className="text-base font-medium">{item.product.name}</h3>
                  <p>{item.product.discount_price} UZS</p>
                  <p>Hajmi: {item.size.size_name}</p>
                  <p>Rangi: {item.color.name}</p>
                  <div className="flex mt-2">
                    <button onClick={() => handleDecrement(item)} className="bg-gray-300 px-2">-</button>
                    <span className="px-4">{item.quantity}</span>
                    <button onClick={() => handleIncrement(item)} className="bg-gray-300 px-2">+</button>
                  </div>
                </div>
                <button onClick={() => handleRemove(item)} disabled={isDisable}>
                  <img src={Delete} alt="delete" className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-4">Savat bo‘sh.</p>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-[#121212] p-4 rounded-t-xl max-w-[600px] mx-auto">
          <div className="flex justify-between">
            <span>Buyurtma miqdori:</span>
            <span>{total}</span>
          </div>
          <div className="flex justify-between">
            <span>Yetkazib berish:</span>
            <span className="text-green-500">40,000 UZS</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Jami:</span>
            <span>{Math.trunc(totalPrice)} UZS</span>
          </div>
          <button onClick={handleClick} className="mt-2 bg-black text-white w-full py-2 rounded">
            Qabul qilaman
          </button>
        </div>
      </div>
    </>
  );
}

export default React.memo(Cart);
