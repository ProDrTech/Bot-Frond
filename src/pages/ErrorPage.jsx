import React from 'react'
import { useNavigate } from 'react-router-dom'

function ErrorPage() {
  const navigate = useNavigate()

  return (
    <div className='flex flex-col justify-center items-center bg-white dark:bg-black p-2.5 text-black dark:text-white'>
      <span className='mt-[90px] mb-2 text-3xl text-center'>(404)</span>
      <h1 className='mb-12 text-4xl text-center'>Sahifa Topilmadi</h1>
      <button onClick={() => navigate('/')} className='bg-[#21D46C] mb-20 p-4 rounded-md text-white text-xl dark:text-black' > Bosh Sahifa </button>
    </div>
  )
}

export default React.memo(ErrorPage);