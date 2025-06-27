import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../request/axios.js';

function Advertisement() {
    const [data, setData] = useState([]);
    const videoRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        axiosInstance.get('/advertising')
            .then(response => {
                if (response.status === 200) {
                    setData(response.data);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        if (data.length > 0 && videoRef.current) {
            const video = videoRef.current;
            video.src = data[currentIndex]?.video;
            video.load();
            video.play().catch(err => console.log('Playback error:', err));
        }
    }, [data, currentIndex]);

    const handleMediaEnd = () => {
        if (data.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
        } else if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(err => console.log('Playback error:', err));
        }
    };

    return (
        <>
            {
                data.length ? (
                    <div className="relative z-10 w-full [80px] h">
                        {
                            data.length > 0 && (
                                <a target='_blank' href={data[currentIndex]?.video_link}>
                                    <video ref={videoRef} autoPlay muted className="w-full h-[80px] cursor-pointer object-cover" onEnded={handleMediaEnd} />
                                </a>
                            )
                        }
                    </div>
                ) : ''
            }
        </>
    );
}

export default React.memo(Advertisement);