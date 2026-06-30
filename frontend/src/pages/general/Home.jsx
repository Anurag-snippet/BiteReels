import React, { useState, useRef, useEffect } from 'react';
import '../../styles/reels.css';
import axios from 'axios';
import { useNavigate , Link} from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const videoRefs = useRef([]);
    const [loadedVideos, setLoadedVideos] = useState({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target.querySelector('video');
                    if (video) {
                        if (entry.isIntersecting) {
                            video.play().catch((error) => {
                                console.log('Autoplay prevented:', error);
                            });
                        } else {
                            video.pause();
                        }
                    }
                });
            },
            { threshold: 0.8 }
        );

        videoRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            videoRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [videos]);

    useEffect(() => {
        axios.get('http://localhost:3000/api/food',{withCredentials: true})
            .then(response => {
                setVideos(response.data.foodItems);
            })
            .catch(error => {
                console.error('Error fetching videos:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/user/login');
                }
            });
    }, [navigate]);

    const handleVideoLoad = (videoId) => {
        setLoadedVideos((prev) => ({ ...prev, [videoId]: true }));
    };

    const handleVisitStore = (storeId) => {
        console.log('Visiting store:', storeId);
        navigate(`/food-partner/profile/${storeId}`);
    };

    return (
        <div className="reels-container">
            {videos.map((video, index) => {
                const videoId = video._id || video.id;
                const videoSrc = video.video || video.url;
                const storeId = video.foodpartner || video.foodPartner || video.storeId;
                return (
                    <div
                        key={videoId}
                        className="reel-item"
                        ref={(el) => (videoRefs.current[index] = el)}
                    >
                        {!loadedVideos[videoId] && (
                            <div className="video-placeholder">
                                <p>Loading video...</p>
                            </div>
                        )}
                        <video
                            className="reel-video"
                            src={videoSrc}
                            controls={false}
                            muted
                            loop
                            playsInline
                            preload="auto"
                            onLoadedData={() => handleVideoLoad(videoId)}
                            onError={(e) => console.log('Error loading video:', videoSrc, e)}
                        />
                        <div className="reel-overlay">
                            <div className="reel-content">
                                <p className="reel-description">{video.description}</p>
                                {storeId && (
                                    <button
                                        className="visit-store-btn"
                                        onClick={() => handleVisitStore(storeId)}
                                    >
                                        Visit Store
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Home;