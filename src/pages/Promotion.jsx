import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../request/axios';
import { Puff } from 'react-loader-spinner';
import ToCart from '../Components/ToCart';
import { ThemeContext } from '../App';
import Header from '../Components/Header';
import lBlack from '../assets/images/left_black.png'
import lWhite from '../assets/images/left_white.png'

function Promotion() {
  const { id } = useParams();
  const [data, setData] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    setLoading(true);
    axiosInstance.get(`banner/${id}`)
      .then(response => {
        setData(response.data);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Header />
      <div className={`flex flex-col justify-between items-start h-[91vh] p-4 select-none ${theme === 'light' ? 'bg-[#fbfafa] text-black shadow-[#000] shadow-lg' : 'bg-black text-white shadow-lg shadow-[#fff]'}`}>
        {
          loading ? (
            <div className='flex justify-center items-center pt-[200px] w-full h-full max-h-[500px]'>
              <Puff visible={true} height="80" width="80" color="#fff" ariaLabel="puff-loading" wrapperStyle={{}} wrapperclassName="" />
            </div>
          ) : (
            <>
              <div className='mx-auto w-full max-w-[650px]'>
                <div className="rounded-lg overflow-hidden">
                  <img className="shadow-2xl shadow-black w-full h-[170px] object-cover" src={data.image} alt="Promotion Banner" />
                </div>
                <h1 className="mt-4 font-bold text-start text-xl">{data.name}</h1>
                <p className="mt-4 text-base text-start"> Marhamat yangilik </p>
              </div>
              <button onClick={() => { navigate(-1) }} className='flex items-center gap-1 bg-black dark:bg-white mb-1 p-2 rounded-md text-sm text-white dark:text-black capitalize'><img src={theme == 'light' ? lWhite : lBlack} className='w-4' />ortga</button>
            </>
          )
        }
        <ToCart />
      </div>
    </>
  );
}

export default React.memo(Promotion);
