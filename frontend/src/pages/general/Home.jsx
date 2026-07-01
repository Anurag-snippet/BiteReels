import React, { useState, useRef, useEffect } from 'react';
import '../../styles/reels.css';
import '../../styles/navigation.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    
    // Session state
    const [session, setSession] = useState({ loggedIn: false, role: null, user: null, partner: null });
    const [authPrompt, setAuthPrompt] = useState({ isOpen: false, action: '' });

    // Tabs: 'home' (general feed) or 'saved' (only saved reels)
    const [activeTab, setActiveTab] = useState('home');
    const [videos, setVideos] = useState([]);
    const videoRefs = useRef([]);
    const [loadedVideos, setLoadedVideos] = useState({});

    // Comment Drawer State
    const [selectedVideoComments, setSelectedVideoComments] = useState(null); // holds video object or null
    const [commentsList, setCommentsList] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isPostingComment, setIsPostingComment] = useState(false);

    // Fetch user session on mount
    useEffect(() => {
        axios.get('http://localhost:3000/api/auth/me', { withCredentials: true })
            .then(response => {
                if (response.data.loggedIn) {
                    setSession(response.data);
                } else {
                    setSession({ loggedIn: false, role: null, user: null, partner: null });
                }
            })
            .catch(() => {
                setSession({ loggedIn: false, role: null, user: null, partner: null });
            });
    }, []);

    // Fetch feed or saved items
    const fetchVideos = (tab) => {
        const endpoint = tab === 'home' 
            ? 'http://localhost:3000/api/food' 
            : 'http://localhost:3000/api/save/items';

        axios.get(endpoint, { withCredentials: true })
            .then(response => {
                setVideos(response.data.foodItems || []);
            })
            .catch(error => {
                console.error(`Error fetching videos for ${tab}:`, error);
                if (tab === 'saved' && error.response && error.response.status === 401) {
                    navigate('/user/login');
                }
            });
    };

    useEffect(() => {
        fetchVideos(activeTab);
    }, [activeTab, navigate]);

    // Intersection observer to auto-play/pause videos on scroll
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

    const handleVideoLoad = (videoId) => {
        setLoadedVideos((prev) => ({ ...prev, [videoId]: true }));
    };

    const handleVisitStore = (storeId) => {
        console.log('Visiting store:', storeId);
        navigate(`/food-partner/profile/${storeId}`);
    };

    const checkAuthAndRun = (action, roleRequired = 'user') => {
        if (!session.loggedIn) {
            setAuthPrompt({
                isOpen: true,
                action: action
            });
            return false;
        }
        if (roleRequired && session.role !== roleRequired) {
            alert(`This action is restricted to consumer Users. You are signed in as a ${session.role}.`);
            return false;
        }
        return true;
    };

    // Toggle Like Action
    const handleLikeToggle = async (videoId, index) => {
        if (!checkAuthAndRun('like this dish', 'user')) return;
        try {
            const response = await axios.post(`http://localhost:3000/api/likes/toggle/${videoId}`, {}, { withCredentials: true });
            const { isLiked, likeCount } = response.data;
            
            // Update video item in state locally
            setVideos(prev => prev.map((v, i) => i === index ? { ...v, isLiked, likeCount } : v));
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    // Toggle Save Action
    const handleSaveToggle = async (videoId, index) => {
        if (!checkAuthAndRun('save this dish', 'user')) return;
        try {
            const response = await axios.post(`http://localhost:3000/api/save/toggle/${videoId}`, {}, { withCredentials: true });
            const { isSaved } = response.data;

            // Update video item in state locally
            setVideos(prev => prev.map((v, i) => i === index ? { ...v, isSaved } : v));
            
            // If on saved tab, remove the item since it's unsaved
            if (activeTab === 'saved' && !isSaved) {
                setVideos(prev => prev.filter((_, i) => i !== index));
            }
        } catch (error) {
            console.error('Error toggling save:', error);
        }
    };

    // Open Comments Drawer
    const handleOpenComments = async (video) => {
        setSelectedVideoComments(video);
        setIsLoadingComments(true);
        setCommentsList([]);
        
        try {
            const response = await axios.get(`http://localhost:3000/api/comment/${video._id || video.id}`, { withCredentials: true });
            setCommentsList(response.data.comments || []);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setIsLoadingComments(false);
        }
    };

    // Submit a Comment
    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newCommentText.trim() || !selectedVideoComments) return;
        if (!checkAuthAndRun('post comments', 'user')) return;

        setIsPostingComment(true);
        const videoId = selectedVideoComments._id || selectedVideoComments.id;

        try {
            const response = await axios.post(`http://localhost:3000/api/comment/${videoId}`, {
                text: newCommentText
            }, { withCredentials: true });

            const newComment = response.data.comment;
            setCommentsList(prev => [newComment, ...prev]);
            setNewCommentText('');

            // Locally increment comment count on the video item
            setVideos(prev => prev.map(v => (v._id === videoId || v.id === videoId) 
                ? { ...v, commentCount: (v.commentCount || 0) + 1 } 
                : v
            ));
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setIsPostingComment(false);
        }
    };

    const handleLogout = async () => {
        try {
            const logoutUrl = session.role === 'partner' 
                ? 'http://localhost:3000/api/auth/food-partner/logout'
                : 'http://localhost:3000/api/auth/user/logout';
                
            await axios.post(logoutUrl, {}, { withCredentials: true });
            setSession({ loggedIn: false, role: null, user: null, partner: null });
            setActiveTab('home');
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            // Fallback clear state and redirect
            setSession({ loggedIn: false, role: null, user: null, partner: null });
            navigate('/');
        }
    };

    const handleTabClick = (tab) => {
        if (activeTab === tab) {
            setVideos([]);
            fetchVideos(tab);
        } else {
            setVideos([]);
            setActiveTab(tab);
        }
    };

    return (
        <div className="main-layout-container">
            {/* LEFT SIDEBAR NAVIGATION (Desktop & Tablet) */}
            <aside className="app-navigation-sidebar">
                <div className="nav-brand" onClick={() => handleTabClick('home')}>
                    <span>🍔</span>
                    <span className="nav-brand-text">FoodView</span>
                </div>
                
                <div className="nav-items-group">
                    <button 
                        className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
                        onClick={() => handleTabClick('home')}
                    >
                        <span className="nav-item-icon">🏠</span>
                        <span className="nav-item-text">Home Feed</span>
                    </button>

                    {session.loggedIn && session.role === 'user' && (
                        <button 
                            className={`nav-item ${activeTab === 'saved' ? 'active' : ''}`}
                            onClick={() => handleTabClick('saved')}
                        >
                            <span className="nav-item-icon">🔖</span>
                            <span className="nav-item-text">Saved Videos</span>
                        </button>
                    )}

                    {session.loggedIn && session.role === 'partner' && (
                        <>
                            <Link className="nav-item" to={`/food-partner/profile/${session.partner?.id}`}>
                                <span className="nav-item-icon">🏬</span>
                                <span className="nav-item-text">My Store</span>
                            </Link>
                            <Link className="nav-item" to="/create-food">
                                <span className="nav-item-icon">➕</span>
                                <span className="nav-item-text">Add Dish</span>
                            </Link>
                        </>
                    )}

                    {!session.loggedIn && (
                        <>
                            <Link className="nav-item" to="/user/login">
                                <span className="nav-item-icon">👤</span>
                                <span className="nav-item-text">Login as User</span>
                            </Link>
                            <Link className="nav-item" to="/food-partner/login">
                                <span className="nav-item-icon">🏪</span>
                                <span className="nav-item-text">Login as Partner</span>
                            </Link>
                        </>
                    )}
                </div>

                {session.loggedIn && (
                    <button className="nav-item logout" onClick={handleLogout} style={{ marginTop: 'auto' }}>
                        <span className="nav-item-icon">🚪</span>
                        <span className="nav-item-text">Logout</span>
                    </button>
                )}
            </aside>

            {/* BOTTOM NAVIGATION BAR (Mobile) */}
            <nav className="app-navigation-bottom">
                <button 
                    className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
                    onClick={() => handleTabClick('home')}
                >
                    <span className="nav-item-icon">🏠</span>
                </button>

                {session.loggedIn && session.role === 'user' && (
                    <button 
                        className={`nav-item ${activeTab === 'saved' ? 'active' : ''}`}
                        onClick={() => handleTabClick('saved')}
                    >
                        <span className="nav-item-icon">🔖</span>
                    </button>
                )}

                {session.loggedIn && session.role === 'partner' && (
                    <>
                        <Link className="nav-item" to={`/food-partner/profile/${session.partner?.id}`}>
                            <span className="nav-item-icon">🏬</span>
                        </Link>
                        <Link className="nav-item" to="/create-food">
                            <span className="nav-item-icon">➕</span>
                        </Link>
                    </>
                )}

                {!session.loggedIn && (
                    <>
                        <Link className="nav-item" to="/user/login" title="Login as User">
                            <span className="nav-item-icon">👤</span>
                        </Link>
                        <Link className="nav-item" to="/food-partner/login" title="Login as Partner">
                            <span className="nav-item-icon">🏪</span>
                        </Link>
                    </>
                )}

                {session.loggedIn && (
                    <button className="nav-item" onClick={handleLogout}>
                        <span className="nav-item-icon">🚪</span>
                    </button>
                )}
            </nav>

            {/* MAIN CONTENT AREA */}
            <main className="main-layout-content">
                <div className="reels-container">
                    {!session.loggedIn && (
                        <div className="guest-top-banner">
                            <p className="guest-banner-text">🍽️ Join FoodView today!</p>
                            <div className="guest-banner-buttons">
                                <Link className="guest-banner-link" to="/user/login">User Login</Link>
                                <Link className="guest-banner-link partner" to="/food-partner/login">Partner Login</Link>
                            </div>
                        </div>
                    )}

                    {videos.length > 0 ? (
                        videos.map((video, index) => {
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
                                    
                                    {/* INSTAGRAM ACTION BUTTONS (Right Side Overlay) */}
                                    <div className="reel-actions-panel">
                                        <div className="action-btn-wrapper">
                                            <button 
                                                className={`reel-action-btn ${video.isLiked ? 'liked' : ''}`}
                                                onClick={() => handleLikeToggle(videoId, index)}
                                            >
                                                ❤️
                                            </button>
                                            <span className="action-count">{video.likeCount || 0}</span>
                                        </div>

                                        <div className="action-btn-wrapper">
                                            <button 
                                                className="reel-action-btn"
                                                onClick={() => handleOpenComments(video)}
                                            >
                                                💬
                                            </button>
                                            <span className="action-count">{video.commentCount || 0}</span>
                                        </div>

                                        <div className="action-btn-wrapper">
                                            <button 
                                                className={`reel-action-btn ${video.isSaved ? 'saved' : ''}`}
                                                onClick={() => handleSaveToggle(videoId, index)}
                                            >
                                                🔖
                                            </button>
                                        </div>
                                    </div>

                                    {/* DESCRIPTION & STORE OVERLAY (Left Side bottom) */}
                                    <div className="reel-overlay">
                                        <div className="reel-content" style={{ paddingRight: '80px' }}>
                                            <h3 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '1.1rem', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                                                {video.name || 'Delicious Meal'}
                                            </h3>
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
                        })
                    ) : (
                        <div className="reel-item" style={{ flexDirection: 'column', color: 'white', gap: '12px', textAlign: 'center', padding: '20px' }}>
                            <span style={{ fontSize: '3rem' }}>🍽️</span>
                            <h3>{activeTab === 'saved' ? 'No saved items yet' : 'No reels to display'}</h3>
                            <p style={{ color: '#aaa', fontSize: '0.9rem', maxWidth: '300px' }}>
                                {activeTab === 'saved' 
                                    ? 'Bookmarked food items will appear here so you can view them anytime.' 
                                    : 'Start uploading food video clips to see them here!'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* INSTAGRAM-STYLE SLIDE-UP COMMENTS DRAWER */}
            {selectedVideoComments && (
                <div className="comment-drawer-backdrop" onClick={() => setSelectedVideoComments(null)}>
                    <div className="comment-drawer" onClick={(e) => e.stopPropagation()}>
                        <div className="comment-drawer-header">
                            <h3 className="comment-drawer-title">Comments</h3>
                            <button 
                                className="comment-drawer-close"
                                onClick={() => setSelectedVideoComments(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="comment-list-container">
                            {isLoadingComments ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading comments...</p>
                            ) : commentsList.length > 0 ? (
                                commentsList.map((comment) => {
                                    const userInitials = comment.user?.fullName ? comment.user.fullName.charAt(0) : 'U';
                                    return (
                                        <div key={comment._id} className="comment-item">
                                            <div className="comment-avatar">
                                                {userInitials}
                                            </div>
                                            <div className="comment-bubble">
                                                <span className="comment-user-name">
                                                    {comment.user?.fullName || 'User'}
                                                </span>
                                                <p className="comment-text">{comment.text}</p>
                                                <span className="comment-time">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="comment-empty-state">
                                    <div className="comment-empty-icon">💬</div>
                                    <p>No comments yet. Be the first to say something!</p>
                                </div>
                            )}
                        </div>

                        <form className="comment-input-area" onSubmit={handlePostComment}>
                            <input 
                                type="text"
                                placeholder="Add a comment..."
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                disabled={isPostingComment}
                                required
                            />
                            <button 
                                className="comment-post-btn" 
                                type="submit"
                                disabled={isPostingComment || !newCommentText.trim()}
                            >
                                {isPostingComment ? 'Posting...' : 'Post'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* GUEST AUTHENTICATION ACTION MODAL PROMPT */}
            {authPrompt.isOpen && (
                <div className="auth-prompt-backdrop" onClick={() => setAuthPrompt({ isOpen: false, action: '' })}>
                    <div className="auth-prompt-modal" onClick={(e) => e.stopPropagation()}>
                        <span className="auth-prompt-icon">🔒</span>
                        <h3 className="auth-prompt-title">Sign in Required</h3>
                        <p className="auth-prompt-message">
                            To {authPrompt.action || 'perform this action'}, please sign in to your consumer account or register as a partner.
                        </p>
                        <div className="auth-prompt-actions">
                            <Link 
                                className="auth-prompt-btn primary" 
                                to="/user/login"
                                onClick={() => setAuthPrompt({ isOpen: false, action: '' })}
                            >
                                Sign in as User 👤
                            </Link>
                            <Link 
                                className="auth-prompt-btn secondary" 
                                to="/food-partner/login"
                                onClick={() => setAuthPrompt({ isOpen: false, action: '' })}
                            >
                                Partner Dashboard 🏬
                            </Link>
                            <button 
                                className="auth-prompt-btn close-btn" 
                                onClick={() => setAuthPrompt({ isOpen: false, action: '' })}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;