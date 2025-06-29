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
    if (!userId) return;

    axiosInstance
      .get(`cart/${user}/`)
      .then((response) => {
        const cartItems = response.data;
        localStorage.setItem("count", JSON.stringify(cartItems));
        dispatch(setCart(cartItems));
      })
      .catch((err) => console.error("Cart fetch error:", err));
  }, [userId]);

  useEffect(() => {
    if (cart && Array.isArray(cart)) {
      let totalQty = 0;
      let totalAmount = 0;
      cart.forEach((item) => {
        const price = parseFloat(item.product?.price || 0);
        totalQty += item.quantity;
        totalAmount += item.quantity * price;
      });
      setTotal(totalQty);
      setTotalPrice(totalAmount);
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

  const handleIncrement = (item) => {
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    axiosInstance
      .put(`/cart/${user}/${item.id}/`, updatedItem)
      .then((res) => {
        dispatch(update(updatedItem));
      })
      .catch((err) => console.error(err));
  };

  const handleDecrement = (item) => {
    if (item.quantity <= 1) return;
    const updatedItem = { ...item, quantity: item.quantity - 1 };
    axiosInstance
      .put(`/cart/${user}/${item.id}/`, updatedItem)
      .then((res) => {
        dispatch(update(updatedItem));
      })
      .catch((err) => console.error(err));
  };

  const handleRemove = (item) => {
    setIsDisable(true);
    axiosInstance
      .delete(`cart/${user}/${item.id}/`)
      .then(() => {
        notify("Mahsulot o‘chirildi");
        return axiosInstance.get(`cart/${user}/`);
      })
      .then((res) => {
        dispatch(setCart(res.data));
      })
      .catch(() => notify("Xatolik yuz berdi", "error"))
      .finally(() => setIsDisable(false));
  };

  const handleClick = () => {
    if (!cart.length) {
      notify("Savat bo‘sh", "error");
      return;
    }
    navigate("/order");
  };

  return (
    <>
      <Header />
      <div className="bg-white dark:bg-black text-black dark:text-white max-w-[600px] mx-auto w-full h-[70vh] overflow-y-auto">
        <ToastContainer />
        <div className="flex justify-between p-4">
          <h2 className="text-2xl font-semibold">Savat</h2>
          <Link to="/" className="underline">Bosh sahifa</Link>
        </div>

        {cart && cart.length ? (
          <div className="p-4 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center border-b pb-4"
              >
                <img
                  src={item.product?.main_image}
                  alt={item.product?.name}
                  className="w-[75px] h-[75px] object-cover rounded shadow"
                />
                <div className="ml-4 flex-grow">
                  <h3 className="text-base font-medium">{item.product?.name}</h3>
                  <p>{item.product?.price} UZS</p>
                  <p>Hajmi: {item.size?.size_name}</p>
                  <p>Rangi: {item.color?.name}</p>
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
            <span>{Math.trunc(totalPrice + 40000)} UZS</span>
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
