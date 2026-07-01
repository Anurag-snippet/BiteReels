import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/theme.css';
import '../../styles/createFood.css';

const CreateFood = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // Process file validation & preview creation
    const processFile = (file) => {
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            setMessage('Please select a valid video file.');
            setIsError(true);
            return;
        }

        setVideoFile(file);
        setIsError(false);
        setMessage('');
        
        // Create local object URL for instant preview
        const url = URL.createObjectURL(file);
        setVideoPreviewUrl(url);
    };

    // Handle drop event
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    // Handle standard file selection
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setVideoFile(null);
        if (videoPreviewUrl) {
            URL.revokeObjectURL(videoPreviewUrl);
            setVideoPreviewUrl(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setMessage('Dish name is required');
            setIsError(true);
            return;
        }

        if (!videoFile) {
            setMessage('Please upload a video file for this dish');
            setIsError(true);
            return;
        }

        setIsSubmitting(true);
        setMessage('Uploading your meal video... Please wait.');
        setIsError(false);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('video', videoFile);

        try {
            const response = await axios.post("http://localhost:3000/api/food", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            setMessage('Meal video uploaded successfully!');
            setIsError(false);

            // Fetch foodpartner ID from response and redirect after a short delay
            const foodpartnerId = response.data.foodItem?.foodpartner;
            setTimeout(() => {
                if (foodpartnerId) {
                    navigate(`/food-partner/profile/${foodpartnerId}`);
                } else {
                    navigate('/');
                }
            }, 1500);

        } catch (error) {
            console.error('Upload error:', error);
            setMessage(error.response?.data?.message || 'Failed to upload meal. Please try again.');
            setIsError(true);
            setIsSubmitting(false);

            // If unauthorized/mismatched session, redirect to partner login page
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                setTimeout(() => {
                    navigate('/food-partner/login');
                }, 2000);
            }
        }
    };

    return (
        <div className="create-food-page">
            <button 
                className="create-food-back-btn" 
                onClick={() => navigate('/')}
                disabled={isSubmitting}
            >
                ← Back to Home
            </button>

            <div className="create-food-card">
                <div className="create-food-badge">🏪 New Dish</div>
                <h1 className="create-food-title">Add to your Menu</h1>
                <p className="create-food-subtitle">
                    Upload a short video showcasing your delicious food item to feature it on the discovery reels feed.
                </p>

                <form className="create-food-form" onSubmit={handleSubmit}>
                    <div className="create-food-field">
                        <label htmlFor="food-name">Dish Name</label>
                        <input 
                            id="food-name" 
                            type="text" 
                            placeholder="e.g., Cheesy Margherita Pizza" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="create-food-field">
                        <label htmlFor="food-desc">Description (Optional)</label>
                        <textarea 
                            id="food-desc" 
                            placeholder="Describe the ingredients, taste, or any special offers..." 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="create-food-field">
                        <label>Dish Video Showcase</label>
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="video/*" 
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            disabled={isSubmitting}
                        />

                        {!videoFile ? (
                            <div 
                                className={`create-food-dropzone ${dragActive ? 'active' : ''}`}
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                onClick={triggerFileInput}
                            >
                                <span className="create-food-dropzone-icon">🎥</span>
                                <p className="create-food-dropzone-text">
                                    Drag & drop your video here, or <span style={{ color: 'var(--primary)', textDecoration: 'underline' }}>browse</span>
                                </p>
                                <p className="create-food-dropzone-subtext">Supports MP4, WebM or quick clips (Max 50MB)</p>
                            </div>
                        ) : (
                            <div className="create-food-preview-container">
                                {videoPreviewUrl && (
                                    <video 
                                        className="create-food-video-preview" 
                                        src={videoPreviewUrl} 
                                        controls 
                                        muted
                                    />
                                )}
                                <div className="create-food-file-info">
                                    <span className="create-food-file-name" title={videoFile.name}>
                                        📄 {videoFile.name}
                                    </span>
                                    <button 
                                        type="button" 
                                        className="create-food-remove-file"
                                        onClick={handleRemoveFile}
                                        disabled={isSubmitting}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {message && (
                        <div className={`create-food-status ${isError ? 'error' : 'success'}`}>
                            {message}
                        </div>
                    )}

                    <button 
                        className="create-food-btn" 
                        type="submit" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner-ring"></span>
                                <span>Uploading Clip...</span>
                            </>
                        ) : (
                            'Publish Dish Video 🚀'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateFood;