import React, { useState, useEffect } from 'react';
import { Camera, Maximize2, X, ChevronLeft, ChevronRight, Play, Pause, Grid, LayoutList, MessageCircle, Sparkles } from 'lucide-react';
import { galleryImages } from '../data/galleryData';
import { mainContact } from '../data/branchesData';

export default function PhotoGallery({ lang }) {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'slider'
  const [lightboxIndex, setLightboxIndex] = useState(null);
  
  // Slider state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);

  const categories = [
    { id: 'all', labelEn: 'All Photos (27)', labelMr: 'सर्व फोटो (२७)' },
    { id: 'ploughs', labelEn: 'Ploughs / नांगर', labelMr: 'नांगर फोटो' },
    { id: 'tillage', labelEn: 'Tillage & Levelers', labelMr: 'कल्टिव्हेटर व लेव्हलर' },
    { id: 'sowing', labelEn: 'Seed Drills / पेरणी यंत्र', labelMr: 'पेरणी यंत्र फोटो' },
    { id: 'haulage', labelEn: 'Trailers / ट्रॉली', labelMr: 'ट्रॉली फोटो' }
  ];

  const filteredImages = galleryImages.filter(img => 
    activeTab === 'all' || img.category === activeTab
  );

  // Reset slide index when tab changes
  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [activeTab]);

  // Autoplay timer for slider
  useEffect(() => {
    let timer;
    if (isAutoplay && filteredImages.length > 0) {
      timer = setInterval(() => {
        setCurrentSlideIndex(prev => (prev + 1) % filteredImages.length);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isAutoplay, filteredImages.length]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  const nextSlide = () => {
    setCurrentSlideIndex((currentSlideIndex + 1) % filteredImages.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((currentSlideIndex - 1 + filteredImages.length) % filteredImages.length);
  };

  const getWhatsAppGalleryUrl = (img) => {
    const text = lang === 'mr'
      ? `नमस्कार पद्मश्री ॲग्रो, मी गॅलरी मधील "${img.title}" या अवजाराचा फोटो पाहिला असून मला याची खरी किंमत व कोटेशन हवे आहे.`
      : `Hello Padmashri Agro, I saw "${img.title}" in your photo gallery and would like to get a formal quotation.`;
    return `https://wa.me/${mainContact.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">
            <Camera size={16} style={{ display: 'inline', marginRight: '6px' }} />
            {lang === 'mr' ? 'प्रत्यक्ष कारखान्यातील व अवजारांचे फोटो' : 'Real Factory & Product Photos'}
          </span>
          <h2 className="section-title">
            {lang === 'mr' ? (
              <>पद्मश्री <span>फोटो गॅलरी</span> (27 HD Photos)</>
            ) : (
              <>Product & <span>Factory Photo Gallery</span></>
            )}
          </h2>
          <p className="section-desc">
            {lang === 'mr'
              ? 'आमच्या कारखान्यातील प्रत्यक्ष निर्मिती, फिनिशिंग व ग्राहकांना दिलेली शेती अवजारे पहा.'
              : 'Browse high-resolution photographs of our manufactured hydraulic ploughs, cultivators, seed drills, levelers, and trailers.'}
          </p>
        </div>

        {/* Filter Tabs & View Mode Switcher */}
        <div className="gallery-control-bar">
          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`tab-btn ${activeTab === cat.id ? 'active' : ''}`}
              >
                {lang === 'mr' ? cat.labelMr : cat.labelEn}
              </button>
            ))}
          </div>

          <div className="view-mode-toggle" style={{ flexShrink: 0 }}>
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={16} />
              <span>{lang === 'mr' ? 'ग्रिड' : 'Grid'}</span>
            </button>
            <button 
              className={`view-btn ${viewMode === 'slider' ? 'active' : ''}`}
              onClick={() => setViewMode('slider')}
              title="Slider Carousel Mode"
            >
              <LayoutList size={16} />
              <span>{lang === 'mr' ? 'स्लायडर' : 'Slider'}</span>
            </button>
          </div>
        </div>

        {/* MODE 1: INTERACTIVE SLIDER CAROUSEL */}
        {viewMode === 'slider' && filteredImages.length > 0 && (
          <div className="gallery-carousel-wrapper">
            <div className="carousel-main-display">
              <img 
                src={filteredImages[currentSlideIndex].url} 
                alt={filteredImages[currentSlideIndex].title} 
                className="carousel-main-img"
              />

              <div className="carousel-badge-counter">
                <span>{currentSlideIndex + 1} / {filteredImages.length}</span>
              </div>

              {/* Slider Controls */}
              <button onClick={prevSlide} className="carousel-arrow left" aria-label="Previous image">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextSlide} className="carousel-arrow right" aria-label="Next image">
                <ChevronRight size={24} />
              </button>

              <div className="carousel-caption-overlay">
                <div className="caption-text">
                  <h3>{filteredImages[currentSlideIndex].title}</h3>
                  <p>{filteredImages[currentSlideIndex].caption}</p>
                </div>
                <div className="caption-actions">
                  <button 
                    onClick={() => openLightbox(currentSlideIndex)} 
                    className="btn-amber"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
                  >
                    <Maximize2 size={15} />
                    <span>{lang === 'mr' ? 'झूम पहा' : 'Zoom'}</span>
                  </button>

                  <a 
                    href={getWhatsAppGalleryUrl(filteredImages[currentSlideIndex])}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
                  >
                    <MessageCircle size={15} />
                    <span>{lang === 'mr' ? 'ऑर्डर करा' : 'Inquire'}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Slider Thumbnail Bar */}
            <div className="carousel-thumbs-bar">
              <button 
                onClick={() => setIsAutoplay(!isAutoplay)} 
                className={`autoplay-btn ${isAutoplay ? 'active' : ''}`}
                title={isAutoplay ? 'Pause auto-slide' : 'Play auto-slide'}
              >
                {isAutoplay ? <Pause size={16} /> : <Play size={16} />}
                <span>{isAutoplay ? 'Pause' : 'Auto Play'}</span>
              </button>

              <div className="thumbs-scroll-row">
                {filteredImages.map((img, idx) => (
                  <div 
                    key={img.id}
                    className={`thumb-item ${currentSlideIndex === idx ? 'active' : ''}`}
                    onClick={() => setCurrentSlideIndex(idx)}
                  >
                    <img src={img.url} alt={img.title} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: UNIFORM 4:3 ASPECT RATIO GRID */}
        {viewMode === 'grid' && (
          <div className="gallery-uniform-grid">
            {filteredImages.map((img, idx) => (
              <div 
                key={img.id} 
                className="gallery-card-item"
                onClick={() => openLightbox(idx)}
              >
                <div className="gallery-card-img-box">
                  <img src={img.url} alt={img.title} loading="lazy" />
                  <div className="gallery-card-badge">
                    <Sparkles size={12} style={{ color: 'var(--secondary-light)' }} />
                    <span>HD Photo</span>
                  </div>
                </div>

                <div className="gallery-card-overlay">
                  <div className="gallery-card-content">
                    <h4>{img.title}</h4>
                    <p>{img.caption}</p>
                  </div>
                  <div className="gallery-zoom-icon">
                    <Maximize2 size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LIGHTBOX MODAL WITH FULLSCREEN SLIDER & THUMBNAIL STRIP */}
        {lightboxIndex !== null && (
          <div className="modal-backdrop" onClick={closeLightbox}>
            <div 
              className="lightbox-modal-content"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={closeLightbox}
                className="lightbox-close-btn"
                aria-label="Close modal"
              >
                <X size={22} />
              </button>

              <div className="lightbox-image-stage">
                <img 
                  src={filteredImages[lightboxIndex].url} 
                  alt={filteredImages[lightboxIndex].title}
                  className="lightbox-active-img"
                />

                <button onClick={prevLightbox} className="lightbox-arrow left" aria-label="Previous">
                  <ChevronLeft size={28} />
                </button>

                <button onClick={nextLightbox} className="lightbox-arrow right" aria-label="Next">
                  <ChevronRight size={28} />
                </button>

                <div className="lightbox-counter-pill">
                  {lightboxIndex + 1} / {filteredImages.length}
                </div>
              </div>

              {/* Lightbox Footer & Action Row */}
              <div className="lightbox-info-bar">
                <div className="lightbox-title-group">
                  <h4>{filteredImages[lightboxIndex].title}</h4>
                  <p>{filteredImages[lightboxIndex].caption}</p>
                </div>

                <a 
                  href={getWhatsAppGalleryUrl(filteredImages[lightboxIndex])}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-amber"
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                >
                  <MessageCircle size={16} />
                  <span>{lang === 'mr' ? 'कोटेशन मागा (Inquire)' : 'Get Quotation'}</span>
                </a>
              </div>

              {/* Lightbox Bottom Thumbnail Row */}
              <div className="lightbox-bottom-thumbs">
                {filteredImages.map((img, i) => (
                  <div 
                    key={img.id}
                    className={`lb-thumb ${lightboxIndex === i ? 'active' : ''}`}
                    onClick={() => setLightboxIndex(i)}
                  >
                    <img src={img.url} alt={img.title} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
