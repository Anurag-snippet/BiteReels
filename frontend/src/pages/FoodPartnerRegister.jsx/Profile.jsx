import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/theme.css';
import '../../styles/profile.css';

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [partner, setPartner] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:3000/api/food/partner/${id}`, { withCredentials: true })
            .then(response => {
                setPartner(response.data.partner);
                setVideos(response.data.foodItems || []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching partner profile:', error);
                setError(error.response?.data?.message || 'Failed to load partner profile');
                setLoading(false);
            });
    }, [id]);

    const handleMouseEnter = (e) => {
        const video = e.currentTarget.querySelector('video');
        if (video) {
            video.play().catch((err) => {
                console.log('Autoplay prevented on hover:', err);
            });
        }
    };

    const handleMouseLeave = (e) => {
        const video = e.currentTarget.querySelector('video');
        if (video) {
            video.pause();
        }
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-loading">
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !partner) {
        return (
            <div className="profile-page">
                <div className="profile-container">
                    <button className="profile-back-btn" onClick={() => navigate('/')}>
                        ← Back to Home
                    </button>
                    <div className="profile-header-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <p style={{ color: 'var(--primary-strong)', fontSize: '1.2rem', fontWeight: '600', margin: '0 0 16px 0' }}>
                            {error || 'Partner not found'}
                        </p>
                        <button 
                            className="profile-back-btn" 
                            style={{ margin: '0 auto', display: 'block' }}
                            onClick={() => navigate('/')}
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Fallback for avatar character
    const avatarChar = partner.name ? partner.name.charAt(0) : 'S';

    return (
        <div className="profile-page">
            <div className="profile-container">
                <button className="profile-back-btn" onClick={() => navigate('/')}>
                    ← Back to Home
                </button>

                <div className="profile-header-card">
                    <div className="profile-header-top">
                        <div className="profile-avatar-wrapper">
                            <div className="profile-avatar">
                                {avatarChar}
                            </div>
                        </div>
                        <div className="profile-details">
                            <div className="profile-badge business">
                                🏬 {partner.name || 'Business Name'}
                            </div>
                            <div className="profile-badge address">
                                📍 {partner.address || 'Address'}
                            </div>
                        </div>
                    </div>

                    <div className="profile-stats-row">
                        <div className="profile-stat-box">
                            <span className="profile-stat-label">total meals</span>
                            <span className="profile-stat-val">{videos.length}</span>
                        </div>
                        <div className="profile-stat-box">
                            <span className="profile-stat-label">customer serve</span>
                            <span className="profile-stat-val">15K</span>
                        </div>
                    </div>
                </div>

                <hr className="profile-divider" />

                <h2 className="profile-grid-title">
                    🎥 Store Videos
                </h2>

                <div className="profile-videos-grid">
                    {videos.length > 0 ? (
                        videos.map((video) => (
                            <div 
                                key={video._id} 
                                className="profile-video-card"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <video 
                                    src={video.video} 
                                    muted 
                                    loop 
                                    playsInline
                                    preload="metadata"
                                />
                                <div className="profile-play-indicator">
                                    ▶
                                </div>
                                <div className="profile-video-overlay">
                                    <h3 className="profile-video-name">{video.name}</h3>
                                    {video.description && (
                                        <p className="profile-video-desc">{video.description}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="profile-empty-state">
                            <div className="profile-empty-icon">🍽️</div>
                            <h3 className="profile-empty-text">No meals uploaded yet</h3>
                            <p className="profile-empty-sub">This partner hasn't posted any videos of their meals.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
