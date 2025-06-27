import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../request/axios';
import Search from '../Components/Search.jsx';
import NotFound from '../assets/images/notFound.png';
import { Puff } from 'react-loader-spinner';
import { HeaderSearch, ThemeContext } from '../App.jsx';
import ToCart from '../Components/ToCart.jsx';
import lBlack from '../assets/images/left_black.png'
import lWhite from '../assets/images/left_white.png'

function Product() {
  const { theme } = useContext(ThemeContext);
  const { headerSearch } = useContext(HeaderSearch);
  const [product, setProduct] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isAdult, setIsAdult] = useState(() => JSON.parse(localStorage.getItem('isAdult')));
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdult === null && !showModal) {
      const isAgeRestricted = product.some((prd) => prd.age_group === '18+');
      if (isAgeRestricted) {
        setShowModal(true);
      }
    }
  }, [isAdult, showModal, product]);
  
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`products/?category_name=${id}`)
      .then((response) => {
        if (response.status === 200) {
          setData(response.data.results);
          setProduct(response.data.results);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (headerSearch) {
      setProduct(
        data.filter((prd) =>
          prd.name.toLowerCase().includes(headerSearch.toLowerCase())
        )
      );
    } else {
      setProduct(data);
    }
  }, [headerSearch, data]);

  const handleAgeVerification = (answer) => {
    if (answer) {
      localStorage.setItem('isAdult', true);
      setIsAdult(true);
    } else {
      localStorage.setItem('isAdult', false);
      setIsAdult(false);
    }
    setShowModal(false);
  };

  function handleClickToDetail(id) {
    navigate(`/product/details/${id}`);
  }

  return (
    <div className="bg-white dark:bg-black">
      {showModal && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-[#1c1c1e] shadow-lg p-5 rounded-md text-center">
            <h2 className="mb-4 font-bold text-black text-lg dark:text-white">
              Siz 18 yoshdan kattamisiz?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleAgeVerification(true)}
                className="bg-green-500 px-4 py-1 rounded-md text-white"
              >
                Ha
              </button>
              <button
                onClick={() => handleAgeVerification(false)}
                className="bg-red-500 px-4 py-1 rounded-md text-white"
              >
                Yo'q
              </button>
            </div>
          </div>
        </div>
      )}
      <Search />
      <button onClick={() => { navigate('/') }} className='top-[60px] left-2 z-50 sticky flex items-center gap-1 bg-black dark:bg-white mt-1 mb-1 p-2 rounded-md text-sm text-white dark:text-black capitalize'><img src={theme == 'light' ? lWhite : lBlack} className='w-4' />ortga</button>
      <div
        className={`p-2.5 ${theme === 'light' ? 'bg-[#fbfafa] text-black' : 'text-white'
          }`}
      >
        {loading ? (
          <div className="flex justify-center items-center mb-10 pt-[200px] w-full h-full">
            <Puff
              visible={true}
              height="80"
              width="80"
              color="#fff"
              ariaLabel="puff-loading"
            />
          </div>
        ) : (
          <>
            <h1 className="mb-4 font-bold text-2xl">{id}</h1>
            {product.length > 0 ? (
              <div className="gap-4 grid grid-cols-2 sm:grid-cols-2 mb-10">
                {product.map((value, index) => (
                  <div
                    onClick={() => {
                      handleClickToDetail(value.id);
                    }}
                    key={index}
                    className={`relative ${theme === 'light'
                      ? 'bg-[#ffffff] shadow-[#6c6c6c]'
                      : 'bg-[#121212]'} 
                      shadow-md rounded-lg max-h-[320px] text-center overflow-hidden flex flex-col justify-between`}
                  >
                    <img
                      src={value.main_image}
                      alt="Product"
                      className={`w-full h-36 object-cover ${isAdult === false && value.age_group === '18+' ? 'blur-[6px]' : ''
                        }`}
                    />
                    <div className="flex flex-col items-start gap-2">
                      {value.promotion &&
                        value.promotion.map((promo, idx) => (
                          <div
                            key={promo.id || idx}
                            className="top-1 left-1 absolute bg-[#00C17B] rounded-md"
                            style={{
                              backgroundImage: `url(${promo.image})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            <p className="px-2 rounded-md text-[8px] text-white">{promo.name}</p>
                          </div>
                        ))}
                    </div>
                    <div className="p-2">
                      <h2 className="font-bold text-[16px] text-start tracking-wider">
                        {value.name}
                      </h2>
                      <div className="mt-2">
                        <div className="flex flex-col items-start mb-1">
                          <span className="font-bold text-[#00C17B] text-sm">
                            {value.discount_price}
                          </span>
                          <div>
                            <span className="ml-1 text-gray-500 text-xs line-through">
                              {value.price}
                            </span>
                            <span className="ml-1 text-[#00C17B] text-[10px]">
                              -{value.discount_percentage}%
                            </span>
                          </div>
                        </div>
                        <button
                          className="block z-40 bg-black dark:bg-white px-2 py-1 rounded w-full font-semibold text-center text-md text-white dark:text-black"
                        >
                          Savatga qo'shish
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center my-20">
                <img
                  className="mb-[8px] max-w-[150px]"
                  src={NotFound}
                  alt="Not Found"
                />
                <h3 className="text-black text-lg dark:text-white">
                  Qaysi mahsulotni qidiryapsiz?
                </h3>
              </div>
            )}
          </>
        )}
      </div>
      <ToCart />
    </div>
  );
}

export default React.memo(Product);
