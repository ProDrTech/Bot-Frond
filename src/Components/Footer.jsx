import React from 'react'
import TikTok from '../assets/images/tik-tok.png'
import Insta from '../assets/images/icon/insta.svg'
import Tg from '../assets/images/icon/tg.svg'
import YouTube from '../assets/images/icon/you-tube.svg'

function Footer() {
    return (
        <footer className='sticky flex flex-col items-center dark:border-[#1c1c1e] bg-white dark:bg-[#121212] px-2 py-4 border-t text-black text-center dark:text-white'>
            <h3 className='mb-4 text-md'>Ijtimoiy Tarmoqlarda</h3>
            <ul className='flex items-center gap-4 mb-6'>
                <a target='_blank' href="https://www.instagram.com/asadmaxmud?igsh=a2pmaHBoYjZxNTQy"> <img className='w-10' src={Insta} /> </a>
                <a target='_blank' href="https://t.me/asadmaxmud_aloqa"> <img className='w-10' src={Tg} /> </a>
                <a target='_blank' href="https://www.tiktok.com/@asadmaxmud?_r=1&_d=eembgm1371h129&sec_uid=MS4wLjABAAAAlr0imM_SULxMf4WIv4hVDl1D8P7Ua5FAV85aRVv_d_LzPEumvkaPibq2efHCZJMf&share_author_id=7384456153256559622&sharer_language=uz&source=h5_m&u_code=eem4856efg63f4&timestamp=1735553786&user_id=7384456153256559622&sec_user_id=MS4wLjABAAAAlr0imM_SULxMf4WIv4hVDl1D8P7Ua5FAV85aRVv_d_LzPEumvkaPibq2efHCZJMf&utm_source=copy&utm_campaign=client_share&utm_medium=android&share_iid=7445146964641433352&share_link_id=a3b5037c-6bcf-4ab7-8f46-7b1ee1f3fb0f&share_app_id=1233&ugbiz_name=ACCOUNT&ug_btm=b8727%2Cb0229&social_share_type=5&enable_checksum=1"> <img src={TikTok} className='w-10' /> </a>
                <a target='_blank' href="https://youtube.com/@asadmaxmud?si=q9gSY1UzFEebH1YE"> <img className='w-10' src={YouTube} /> </a>
            </ul>
            <p className='font-medium text-[14px]'>Maxfiylik kelishuvi</p>
            <p className='font-medium text-[14px]'>Foydalanuvchi kelishuvi</p>
            <p className='mt-2 text-[10px] text-gray-400'>«2025© XK MCHJ «ASADMAXMUD». Barcha huquqlar himoyalangan»</p>
        </footer>
    )
}

export default React.memo(Footer);