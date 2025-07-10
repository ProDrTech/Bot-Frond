import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Footer() {
  const [socialLinks, setSocialLinks] = useState([]);
  const [footerText, setFooterText] = useState('');

  useEffect(() => {
    // Social links olish
    axios.get('https://asadmaxmud.up.railway.app/api/v1/social/')
      .then(res => setSocialLinks(res.data))
      .catch(err => console.error("Ijtimoiy tarmoqlar yuklanmadi", err));

    // Footer matn olish
    axios.get('https://asadmaxmud.up.railway.app/api/v1/footer/text/')
      .then(res => {
        const text = res.data.footer_text;
        const year = new Date().getFullYear();
        setFooterText(text.replace('{year}', year));  // Agar `{year}` ishlatilsa
      })
      .catch(err => console.error("Footer matni yuklanmadi", err));
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

      {/* Footer matn */}
      {footerText && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {footerText}
        </p>
      )}
    </footer>
  );
}

export default React.memo(Footer);
