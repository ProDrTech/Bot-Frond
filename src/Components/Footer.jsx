import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Footer() {
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    axios.get('https://asadmaxmud.up.railway.app/api/v1/social/')
      .then(res => setSocialLinks(res.data))
      .catch(err => console.error("Ijtimoiy tarmoqlar yuklanmadi", err));
  }, []);

  return (
    <footer className='bottom-0 left-0 w-full flex flex-col items-center dark:border-[#1c1c1e] bg-white dark:bg-[#121212] px-2 py-4 border-t text-black text-center dark:text-white z-30'>
      <h3 className='mb-4 text-md'>Ijtimoiy Tarmoqlarda</h3>
      <ul className='flex items-center gap-4 mb-6'>
        {socialLinks.map(item => (
          <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer">
            <img src={item.icon} alt={item.name} className="w-10 h-10 object-contain" />
          </a>
        ))}
      </ul>
    </footer>
  );
}

export default React.memo(Footer);
