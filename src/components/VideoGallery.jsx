import React, { useState, useEffect, useMemo } from 'react';
import { PlayCircle, Video, X, MessageCircle, Clock, Smartphone, MonitorPlay, Sparkles } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { mainContact } from '../data/branchesData';

const initialVideos = [
  {
    id: "1792311185526",
    title: "ACM promotion",
    titleEn: "ACM promotion",
    titleMr: "ACM प्रमोशन रील",
    category: "Field Demo",
    videoUrl: "https://res.cloudinary.com/bthbndrq/video/upload/v1792311185/padmashri_videos/1792311185526.mp4",
    url: "https://res.cloudinary.com/bthbndrq/video/upload/v1792311185/padmashri_videos/1792311185526.mp4",
    thumbnailUrl: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167238/padmashri-agro/products/reversible_plough_1.jpg",
    thumbnail: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167238/padmashri-agro/products/reversible_plough_1.jpg",
    duration: "01:12",
    orientation: "vertical",
    videoType: "upload"
  },
  {
    id: "v2",
    title: "Reversible MB Plough 3-Bottom Live Furrow Test",
    titleEn: "Reversible MB Plough 3-Bottom Live Furrow Test",
    titleMr: "हायड्रॉलिक पलटी नांगर (MB Plough) थेट शेतात काम करताना",
    category: "ploughs",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167238/padmashri-agro/products/reversible_plough_1.jpg",
    thumbnail: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167238/padmashri-agro/products/reversible_plough_1.jpg",
    duration: "02:20",
    orientation: "horizontal",
    videoType: "youtube"
  },
  {
    id: "v3",
    title: "Sugarcane Inter-Row Ridger Live Operation",
    titleEn: "Sugarcane Inter-Row Ridger Live Operation",
    titleMr: "ऊस बांधणी व आंतरमशागत रिजर प्रात्यक्षिक",
    category: "tillage",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167578/padmashri-agro/gallery/sugarcane-ridger-field-operation-gallery-01.jpg",
    thumbnail: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167578/padmashri-agro/gallery/sugarcane-ridger-field-operation-gallery-01.jpg",
    duration: "04:15",
    orientation: "horizontal",
    videoType: "youtube"
  }
];

// Helper to extract YouTube video ID (supports watch?v=, youtu.be/, shorts/, embed/)
function extractYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Convert video URL to proper iframe embed URL
function getEmbedUrl(url) {
  if (!url) return '';
  const ytid = extractYouTubeId(url);
  if (ytid) {
    return `https://www.youtube-nocookie.com/embed/${ytid}?autoplay=1&rel=0`;
  }
  return url;
}

// Helper to detect if a video is an uploaded direct video file
function isDirectVideo(video) {
  if (!video) return false;
  if (video.videoType === 'upload') return true;
  const url = (video.url || video.videoUrl || '').toLowerCase();
  if (url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') || url.includes('.mkv')) return true;
  if (url.includes('cloudinary') && url.includes('/video/upload/')) return true;
  return false;
}

export default function VideoGallery({ lang }) {
  const [activeVideo, setActiveVideo] = useState(null);
  const [demoVideos, setDemoVideos] = useState(initialVideos);
  const [selectedAspectFilter, setSelectedAspectFilter] = useState('all'); // 'all' | 'horizontal' | 'vertical'

  useEffect(() => {
    const q = query(collection(db, 'videos'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => {
          const raw = doc.data();
          const vUrl = raw.videoUrl || raw.url || '';
          const ytid = extractYouTubeId(vUrl);
          const autoThumb = ytid ? `https://img.youtube.com/vi/${ytid}/hqdefault.jpg` : '';
          
          // Detect orientation: from raw data or if YouTube Shorts URL
          const rawOrientation = (raw.orientation || '').toLowerCase();
          const isShorts = vUrl.includes('/shorts/');
          const orientation = rawOrientation === 'vertical' || isShorts ? 'vertical' : 'horizontal';

          // Detect video type
          const isUpload = raw.videoType === 'upload' || isDirectVideo({ ...raw, url: vUrl });
          const videoType = isUpload ? 'upload' : 'youtube';

          return {
            id: doc.id,
            ...raw,
            title: raw.title || raw.titleEn || 'Machinery Demonstration',
            titleEn: raw.titleEn || raw.title || 'Machinery Demonstration',
            titleMr: raw.titleMr || raw.title || 'मशिनरी प्रात्यक्षिक',
            thumbnail: raw.thumbnailUrl || raw.thumbnail || autoThumb || 'https://res.cloudinary.com/bthbndrq/image/upload/v1786167228/padmashri-agro/products/hydraulic_trailer_1.jpg',
            url: vUrl,
            duration: raw.duration || (orientation === 'vertical' ? '00:59' : '02:30'),
            orientation,
            videoType
          };
        });

        if (data.length > 0) {
          setDemoVideos(data);
        }
      }
    }, (error) => {
      console.warn("Real-time videos listener fallback:", error);
    });

    return () => unsubscribe();
  }, []);

  const filteredVideos = useMemo(() => {
    if (selectedAspectFilter === 'all') return demoVideos;
    return demoVideos.filter(v => v.orientation === selectedAspectFilter);
  }, [demoVideos, selectedAspectFilter]);

  const counts = useMemo(() => {
    return {
      all: demoVideos.length,
      horizontal: demoVideos.filter(v => v.orientation !== 'vertical').length,
      vertical: demoVideos.filter(v => v.orientation === 'vertical').length
    };
  }, [demoVideos]);

  const getWhatsAppVideoUrl = (video) => {
    if (!video) return `https://wa.me/${mainContact.whatsapp}`;
    const title = lang === 'mr' ? (video.titleMr || video.title) : (video.titleEn || video.title);
    const text = lang === 'mr'
      ? `नमस्कार पद्मश्री ॲग्रो, मी "${title}" हा व्हिडिओ पाहिला असून मला या अवजाराविषयी अधिक माहिती व दर हवे आहेत.`
      : `Hello Padmashri Agro, I watched the demonstration for "${title}" and would like to request official specs and pricing.`;
    return `https://wa.me/${mainContact.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="videos" className="gallery-section" style={{ background: 'var(--bg-card)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-subtitle">
            <Video size={16} style={{ display: 'inline', marginRight: '6px' }} />
            {lang === 'mr' ? 'थेट शेती प्रात्यक्षिक व रील्स व्हिडिओ' : 'Live Field Operation Videos & Reels'}
          </span>
          <h2 className="section-title">
            {lang === 'mr' ? (
              <span>मशिनरी <span>व्हिडिओ गॅलरी</span> ({demoVideos.length} Videos)</span>
            ) : (
              <span>Machinery <span>Video Gallery</span> ({demoVideos.length} Videos)</span>
            )}
          </h2>
          <p className="section-desc">
            {lang === 'mr'
              ? 'आमच्या शेती अवजारांचे थेट शेतातील काम, यूट्यूब प्रात्यक्षिके व इन्स्टाग्राम रील्स पहा.'
              : 'Watch heavy-duty agriculture equipment live in action — full YouTube field demos and vertical Reels.'}
          </p>
        </div>

        {/* Category & Orientation Filter Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.6rem',
          margin: '1.5rem 0 2.2rem 0',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setSelectedAspectFilter('all')}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: '999px',
              border: selectedAspectFilter === 'all' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              background: selectedAspectFilter === 'all' ? 'var(--primary)' : 'var(--bg-main)',
              color: selectedAspectFilter === 'all' ? '#ffffff' : 'var(--text-main)',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: selectedAspectFilter === 'all' ? '0 4px 12px rgba(22, 101, 52, 0.25)' : 'none'
            }}
          >
            <Sparkles size={14} />
            <span>{lang === 'mr' ? 'सर्व व्हिडिओ' : 'All Videos'} ({counts.all})</span>
          </button>

          <button
            onClick={() => setSelectedAspectFilter('vertical')}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: '999px',
              border: selectedAspectFilter === 'vertical' ? '2px solid #e11d48' : '1px solid var(--border-color)',
              background: selectedAspectFilter === 'vertical' ? '#e11d48' : 'var(--bg-main)',
              color: selectedAspectFilter === 'vertical' ? '#ffffff' : 'var(--text-main)',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: selectedAspectFilter === 'vertical' ? '0 4px 12px rgba(225, 29, 72, 0.3)' : 'none'
            }}
          >
            <Smartphone size={15} />
            <span>{lang === 'mr' ? '📱 9:16 रील्स (Shorts)' : '📱 9:16 Vertical (Reels / Shorts)'} ({counts.vertical})</span>
          </button>

          <button
            onClick={() => setSelectedAspectFilter('horizontal')}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: '999px',
              border: selectedAspectFilter === 'horizontal' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              background: selectedAspectFilter === 'horizontal' ? 'var(--primary)' : 'var(--bg-main)',
              color: selectedAspectFilter === 'horizontal' ? '#ffffff' : 'var(--text-main)',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: selectedAspectFilter === 'horizontal' ? '0 4px 12px rgba(22, 101, 52, 0.25)' : 'none'
            }}
          >
            <MonitorPlay size={15} />
            <span>{lang === 'mr' ? '📺 16:9 लँडस्केप (YouTube)' : '📺 16:9 Landscape (YouTube)'} ({counts.horizontal})</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TIER 1: UPSIDE - 9:16 VERTICAL REELS & SHORTS                  */}
        {/* ============================================================== */}
        {(selectedAspectFilter === 'all' || selectedAspectFilter === 'vertical') && counts.vertical > 0 && (
          <div style={{ marginBottom: selectedAspectFilter === 'all' && counts.horizontal > 0 ? '3rem' : '1rem' }}>
            {/* Upside Section Subheading */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.2rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
              borderBottom: '1.5px solid rgba(225, 29, 72, 0.15)',
              paddingBottom: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  background: 'linear-gradient(135deg, #e11d48, #be123c)',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 3px 10px rgba(225, 29, 72, 0.25)'
                }}>
                  <Smartphone size={13} /> 9:16 Reels
                </span>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.18rem',
                  fontWeight: '800',
                  color: 'var(--text-main)',
                  letterSpacing: '-0.2px'
                }}>
                  {lang === 'mr' ? '📱 शेती रील्स व शॉर्ट्स' : '📱 Farm Reels & Short Videos'}
                </h3>
                <span style={{
                  fontSize: '0.8rem',
                  color: '#e11d48',
                  fontWeight: '700',
                  background: 'rgba(225, 29, 72, 0.08)',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  {counts.vertical} {lang === 'mr' ? 'रील्स' : 'Reels'}
                </span>
              </div>
              <p style={{
                margin: 0,
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                fontWeight: '500'
              }}>
                {lang === 'mr' ? 'मोबाईलवर पाहण्यासाठी उभे रील्स (Full Screen Reels)' : 'Mobile-friendly portrait reels & field highlights'}
              </p>
            </div>

            {/* Reels Grid (Tailored ~230px-260px portrait cards) */}
            <div className="reels-video-grid">
              {demoVideos.filter(v => v.orientation === 'vertical').map(video => (
                <div
                  key={video.id}
                  className="reel-card"
                  onClick={() => setActiveVideo(video)}
                  style={{
                    background: 'var(--bg-main)',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.06)',
                    border: '1.5px solid rgba(225, 29, 72, 0.28)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 16px 32px -8px rgba(225, 29, 72, 0.35)';
                    e.currentTarget.style.borderColor = '#e11d48';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.28)';
                  }}
                >
                  {/* Portrait 9:16 Aspect Thumbnail Container */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '9/15',
                    backgroundColor: '#0f172a',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={video.thumbnail}
                      alt={lang === 'mr' ? video.titleMr : video.titleEn}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                      onError={(e) => {
                        e.currentTarget.src = 'https://res.cloudinary.com/bthbndrq/image/upload/v1786167228/padmashri-agro/products/hydraulic_trailer_1.jpg';
                      }}
                    />

                    {/* Gradient overlay */}
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.85) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {/* Play Button */}
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #e11d48, #be123c)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(225, 29, 72, 0.5)'
                      }}>
                        <PlayCircle color="#ffffff" size={30} strokeWidth={2.2} />
                      </div>
                    </div>

                    {/* Top Badges */}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      right: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pointerEvents: 'none'
                    }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #f43f5e, #be123c)',
                        backdropFilter: 'blur(4px)',
                        color: '#fff',
                        padding: '3px 8px',
                        borderRadius: '14px',
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        letterSpacing: '0.3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                      }}>
                        <Smartphone size={10} /> 9:16 Reel
                      </span>

                      {video.videoType === 'upload' ? (
                        <span style={{
                          background: 'rgba(16, 185, 129, 0.92)',
                          backdropFilter: 'blur(4px)',
                          color: '#fff',
                          padding: '3px 8px',
                          borderRadius: '14px',
                          fontSize: '0.68rem',
                          fontWeight: '700'
                        }}>
                          ☁️ Direct
                        </span>
                      ) : (
                        <span style={{
                          background: 'rgba(220, 38, 38, 0.92)',
                          backdropFilter: 'blur(4px)',
                          color: '#fff',
                          padding: '3px 8px',
                          borderRadius: '14px',
                          fontSize: '0.68rem',
                          fontWeight: '700'
                        }}>
                          ▶ YouTube
                        </span>
                      )}
                    </div>

                    {/* Bottom Duration Badge */}
                    {video.duration && (
                      <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        background: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(4px)',
                        color: '#fff',
                        padding: '3px 7px',
                        borderRadius: '6px',
                        fontSize: '0.68rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Clock size={10} /> <span>{video.duration}</span>
                      </div>
                    )}
                  </div>

                  {/* Reel Card Footer */}
                  <div style={{
                    padding: '0.85rem 0.95rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    background: 'var(--bg-main)'
                  }}>
                    <h4 style={{
                      fontSize: '0.92rem',
                      fontWeight: '700',
                      color: 'var(--text-main)',
                      margin: 0,
                      lineHeight: '1.35',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {lang === 'mr' ? video.titleMr : video.titleEn}
                    </h4>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      color: '#e11d48'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <PlayCircle size={14} />
                        <span>{lang === 'mr' ? 'रील पहा' : 'Watch Reel'}</span>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        fontWeight: '600'
                      }}>
                        {video.category || 'Demo'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TIER 2: DOWNSIDE - 16:9 WIDESCREEN FIELD DEMONSTRATIONS         */}
        {/* ============================================================== */}
        {(selectedAspectFilter === 'all' || selectedAspectFilter === 'horizontal') && counts.horizontal > 0 && (
          <div>
            {/* Downside Section Subheading */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.2rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
              borderBottom: '1.5px solid rgba(22, 101, 52, 0.18)',
              paddingBottom: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  background: 'var(--primary)',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 3px 10px rgba(22, 101, 52, 0.25)'
                }}>
                  <MonitorPlay size={13} /> 16:9 HD
                </span>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.18rem',
                  fontWeight: '800',
                  color: 'var(--text-main)',
                  letterSpacing: '-0.2px'
                }}>
                  {lang === 'mr' ? '📺 संपूर्ण शेती प्रात्यक्षिक व्हिडिओ' : '📺 Full Field Operation Demonstrations'}
                </h3>
                <span style={{
                  fontSize: '0.8rem',
                  color: 'var(--primary)',
                  fontWeight: '700',
                  background: 'rgba(22, 101, 52, 0.08)',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  {counts.horizontal} {lang === 'mr' ? 'व्हिडिओ' : 'Videos'}
                </span>
              </div>
              <p style={{
                margin: 0,
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                fontWeight: '500'
              }}>
                {lang === 'mr' ? 'ट्रॅक्टर व अवजारांचे थेट शेतातील सविस्तर काम (16:9 Widescreen)' : 'In-depth machinery operation & field performance testing'}
              </p>
            </div>

            {/* Widescreen 16:9 Grid */}
            <div className="widescreen-video-grid">
              {demoVideos.filter(v => v.orientation !== 'vertical').map(video => (
                <div
                  key={video.id}
                  className="video-card"
                  onClick={() => setActiveVideo(video)}
                  style={{
                    background: 'var(--bg-main)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 16px 30px -10px rgba(0,0,0,0.18)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  {/* 16:9 Aspect Thumbnail */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16/9',
                    backgroundColor: '#0f172a',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={video.thumbnail}
                      alt={lang === 'mr' ? video.titleMr : video.titleEn}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                      onError={(e) => {
                        e.currentTarget.src = 'https://res.cloudinary.com/bthbndrq/image/upload/v1786167228/padmashri-agro/products/hydraulic_trailer_1.jpg';
                      }}
                    />

                    {/* Dark overlay */}
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      background: 'rgba(0,0,0,0.32)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.3s ease'
                    }}>
                      <div style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
                      }}>
                        <PlayCircle color="#dc2626" size={34} strokeWidth={2} />
                      </div>
                    </div>

                    {/* Top Badges */}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      right: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pointerEvents: 'none'
                    }}>
                      <span style={{
                        background: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(4px)',
                        color: '#fff',
                        padding: '3px 8px',
                        borderRadius: '20px',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        letterSpacing: '0.3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                      }}>
                        <MonitorPlay size={11} />
                        <span>16:9 HD</span>
                      </span>

                      {video.videoType === 'upload' ? (
                        <span style={{
                          background: 'rgba(16, 185, 129, 0.92)',
                          color: '#fff',
                          padding: '3px 8px',
                          borderRadius: '20px',
                          fontSize: '0.7rem',
                          fontWeight: '700'
                        }}>
                          ☁️ Direct
                        </span>
                      ) : (
                        <span style={{
                          background: 'rgba(220, 38, 38, 0.92)',
                          color: '#fff',
                          padding: '3px 8px',
                          borderRadius: '20px',
                          fontSize: '0.7rem',
                          fontWeight: '700'
                        }}>
                          ▶ YouTube
                        </span>
                      )}
                    </div>

                    {/* Bottom Duration */}
                    {video.duration && (
                      <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        background: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(4px)',
                        color: '#fff',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Clock size={11} /> <span>{video.duration}</span>
                      </div>
                    )}
                  </div>

                  {/* 16:9 Card Footer */}
                  <div style={{
                    padding: '1.1rem',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.8rem'
                  }}>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: 'var(--text-main)',
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {lang === 'mr' ? video.titleMr : video.titleEn}
                    </h3>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: 'var(--primary)',
                      fontSize: '0.84rem',
                      fontWeight: '700'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <PlayCircle size={15} />
                        <span>{lang === 'mr' ? 'व्हिडिओ पहा' : 'Watch Demo'}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                        {video.category || 'Demo'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Player Modal (Responsive for 16:9 and 9:16 Vertical) */}
        {activeVideo && (
            <div 
              className="modal-backdrop" 
              style={{ 
                zIndex: 9999,
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
              }}
              onClick={() => setActiveVideo(null)}
            >
                <div 
                  className="video-modal-content" 
                  style={{
                    width: '100%',
                    maxWidth: activeVideo.orientation === 'vertical' ? '420px' : '880px',
                    background: '#0f172a',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: activeVideo.orientation === 'vertical'
                      ? '0 25px 60px -10px rgba(225, 29, 72, 0.4), 0 0 0 1px rgba(255,255,255,0.1)'
                      : '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '94vh'
                  }} 
                  onClick={e => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button 
                        onClick={() => setActiveVideo(null)}
                        className="modal-close-btn"
                        style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'rgba(0,0,0,0.6)',
                            color: '#ffffff',
                            border: '1px solid rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(6px)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                            transition: 'all 0.2s ease'
                        }}
                        aria-label="Close video"
                    >
                        <X size={18} />
                    </button>
                    
                    {/* Media Container (16:9 for landscape, 9:16 for portrait reels) */}
                    <div style={{ 
                      width: '100%', 
                      aspectRatio: activeVideo.orientation === 'vertical' ? '9/16' : '16/9', 
                      backgroundColor: '#000',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      maxHeight: activeVideo.orientation === 'vertical' ? '70vh' : 'auto'
                    }}>
                      {isDirectVideo(activeVideo) ? (
                        <video 
                          src={activeVideo.url} 
                          controls 
                          autoPlay 
                          playsInline
                          controlsList="nodownload"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'contain', 
                            backgroundColor: '#000' 
                          }}
                        />
                      ) : (
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src={getEmbedUrl(activeVideo.url)} 
                            title={activeVideo.title} 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                            style={{ border: 'none' }}
                        />
                      )}
                    </div>

                    {/* Bottom Info & Action Bar */}
                    <div style={{ 
                      padding: '1.1rem 1.4rem', 
                      background: '#1e293b', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      flexWrap: 'wrap', 
                      gap: '0.8rem' 
                    }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: '800',
                            padding: '2px 7px',
                            borderRadius: '10px',
                            background: activeVideo.orientation === 'vertical' ? '#e11d48' : '#334155',
                            color: '#fff'
                          }}>
                            {activeVideo.orientation === 'vertical' ? '📱 9:16 Reel' : '📺 16:9 Landscape'}
                          </span>
                          <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                            {activeVideo.category || 'Machinery Demo'}
                          </span>
                        </div>
                        <h4 style={{ color: '#ffffff', margin: 0, fontSize: '1.02rem', fontWeight: '700', lineHeight: '1.3' }}>
                          {lang === 'mr' ? (activeVideo.titleMr || activeVideo.title) : (activeVideo.titleEn || activeVideo.title)}
                        </h4>
                      </div>

                      <a 
                        href={getWhatsAppVideoUrl(activeVideo)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-amber"
                        style={{ 
                          padding: '0.55rem 1.1rem', 
                          fontSize: '0.85rem',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <MessageCircle size={16} />
                        <span>{lang === 'mr' ? 'कोटेशन मागा (WhatsApp)' : 'Inquire on WhatsApp'}</span>
                      </a>
                    </div>
                </div>
            </div>
        )}

      </div>
    </section>
  );
}
