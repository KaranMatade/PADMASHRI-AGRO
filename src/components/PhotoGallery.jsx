import React, { useState, useEffect } from 'react';
import ResponsiveImage from './ResponsiveImage';
import { Camera, Maximize2, X, ChevronLeft, ChevronRight, Play, Pause, Grid, LayoutList, MessageCircle, Sparkles } from 'lucide-react';
import { mainContact } from '../data/branchesData';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

// Default initial dataset
const defaultPhotos = [
  {
    id: "p1",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167587/padmashri-agro/gallery/tractor-hydraulic-tipping-trailer-gallery-01.jpg",
    title: "Tractor Hydraulic Tipping Trailer",
    category: "haulage",
    caption: "Heavy Duty 5-Ton Hydraulic Tipping Trailer / Trolley"
  },
  {
    id: "p2",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167490/padmashri-agro/gallery/hydraulic-trailer-dump-jack-gallery-01.jpg",
    title: "Hydraulic Trailer Dump Jack",
    category: "haulage",
    caption: "Heavy Duty Hydraulic Tipping Cylinder Mechanism"
  },
  {
    id: "p3",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167504/padmashri-agro/gallery/padmashree-heavy-duty-farm-trailer-gallery-01.jpg",
    title: "Finished Heavy Duty Farm Trailer",
    category: "haulage",
    caption: "Factory Finished Trailer in Agriculture Blue Paint"
  },
  {
    id: "p4",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167341/padmashri-agro/gallery/2-bottom-reversible-mb-plough-gallery-01.jpg",
    title: "2 Bottom Reversible MB Plough",
    category: "ploughs",
    caption: "2 Bottom Reversible Mouldboard Plough"
  },
  {
    id: "p5",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167365/padmashri-agro/gallery/3-bottom-reversible-mb-plough-gallery-01.jpg",
    title: "3 Bottom Reversible MB Plough",
    category: "ploughs",
    caption: "3 Bottom MB Plough for High HP Tractors"
  },
  {
    id: "p6",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167481/padmashri-agro/gallery/hydraulic-reversible-plough-gallery-01.jpg",
    title: "Hydraulic Reversible Plough",
    category: "ploughs",
    caption: "Heavy Duty Hydraulic Reversible Plough with Dual Cylinders"
  },
  {
    id: "p7",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167519/padmashri-agro/gallery/plough-attached-to-tractor-gallery-01.jpg",
    title: "Plough Attached to Tractor",
    category: "ploughs",
    caption: "Hydraulic Reversible Plough connected to Tractor Linkage"
  },
  {
    id: "p8",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167525/padmashri-agro/gallery/plough-frame-and-shares-gallery-01.jpg",
    title: "Plough Frame & Shares",
    category: "ploughs",
    caption: "Forged High-Carbon Steel Plough Share Points"
  },
  {
    id: "p9",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167533/padmashri-agro/gallery/reversible-mechanism-detail-gallery-01.jpg",
    title: "Reversible Mechanism Detail",
    category: "ploughs",
    caption: "Smooth Reversing Pivot Assembly"
  },
  {
    id: "p10",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167540/padmashri-agro/gallery/reversible-plow-side-profile-gallery-01.jpg",
    title: "Reversible Plough Side Profile",
    category: "ploughs",
    caption: "14-Inch Mouldboard Curve for Soil Inversion"
  },
  {
    id: "p11",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167470/padmashri-agro/gallery/hydraulic-hose-and-valve-connection-01.jpg",
    title: "Hydraulic Hose & Valve Connection",
    category: "ploughs",
    caption: "Dual Wire High Pressure Hydraulic Hose Lines"
  },
  {
    id: "p12",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167331/padmashri-agro/gallery/2-bottom-fixed-mb-plough-gallery-01.jpg",
    title: "2 Bottom Fixed MB Plough",
    category: "ploughs",
    caption: "2 Bottom Fixed Mouldboard Plough (साधा नांगर)"
  },
  {
    id: "p13",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167450/padmashri-agro/gallery/fixed-mb-plough-front-linkage-gallery-01.jpg",
    title: "Fixed MB Plough Front Linkage",
    category: "ploughs",
    caption: "Category II Tractor Hitch Mount"
  },
  {
    id: "p14",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167457/padmashri-agro/gallery/fixed-plough-stock-gallery-01.jpg",
    title: "Fixed Plough Stock",
    category: "ploughs",
    caption: "Finished Fixed MB Ploughs at Workshop"
  },
  {
    id: "p15",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167562/padmashri-agro/gallery/sugarcane-inter-row-cultivator-gallery-01.jpg",
    title: "Sugarcane Inter-Row Cultivator",
    category: "tillage",
    caption: "Sugarcane Ridger / Earthing-up Cultivator (उसाची बांधणी)"
  },
  {
    id: "p16",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167578/padmashri-agro/gallery/sugarcane-ridger-field-operation-gallery-01.jpg",
    title: "Sugarcane Ridger Field Operation",
    category: "tillage",
    caption: "In-field sugarcane furrowing and root earthing-up"
  },
  {
    id: "p17",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167553/padmashri-agro/gallery/sugarcane-furrowing-wings-gallery-01.jpg",
    title: "Sugarcane Furrowing Wings",
    category: "tillage",
    caption: "Screw adjustable earthing wings detail"
  },
  {
    id: "p18",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167387/padmashri-agro/gallery/3-row-tractor-ridger-gallery-01.jpg",
    title: "3-Row Tractor Ridger",
    category: "tillage",
    caption: "3-Row Tractor Ridger / Bund Maker / Furrower"
  },
  {
    id: "p19",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167352/padmashri-agro/gallery/2-row-adjustable-ridger.jpg",
    title: "2-Row Adjustable Ridger",
    category: "tillage",
    caption: "2-Row Adjustable Ridger for Row Crop Planting"
  },
  {
    id: "p20",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167417/padmashri-agro/gallery/bund-maker-side-wings-gallery-01.jpg",
    title: "Bund Maker Side Wings",
    category: "tillage",
    caption: "Heavy Duty Side Wings for Field Bund Creation"
  },
  {
    id: "p21",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167408/padmashri-agro/gallery/bund-maker-frame-type.jpg",
    title: "Bund Maker Frame Type",
    category: "tillage",
    caption: "Reinforced Box Frame Construction"
  },
  {
    id: "p22",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167399/padmashri-agro/gallery/5-tine-duckfoot-cultivator.jpg",
    title: "5-Tine Duckfoot Cultivator",
    category: "tillage",
    caption: "5-Tine Duckfoot Cultivator / Sweep Cultivator (डकफूट कोळपे)"
  },
  {
    id: "p23",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167434/padmashri-agro/gallery/duckfoot-sweep-cultivator.jpg",
    title: "Duckfoot Sweep Cultivator",
    category: "tillage",
    caption: "Triangular Sweep Blades for Shallow Weed Slicing"
  },
  {
    id: "p24",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167596/padmashri-agro/gallery/tractor-mounted-seed-drill.jpg",
    title: "Tractor Mounted Seed Drill",
    category: "sowing",
    caption: "Automatic Seed cum Fertilizer Drill Machine"
  },
  {
    id: "p25",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167426/padmashri-agro/gallery/dual-chamber-seed-fertilizer-box.jpg",
    title: "Dual Chamber Seed & Fertilizer Box",
    category: "sowing",
    caption: "Metering Box for Seed & Fertilizer Sowing"
  },
  {
    id: "p26",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167462/padmashri-agro/gallery/heavy-duty-land-leveler-blade.jpg",
    title: "Heavy Duty Land Leveler Blade",
    category: "tillage",
    caption: "Tractor Mounted Land Leveler / Scraper Blade"
  },
  {
    id: "p27",
    url: "https://res.cloudinary.com/bthbndrq/image/upload/v1786167497/padmashri-agro/gallery/land-leveler-turntable-index-plate.jpg",
    title: "Land Leveler Turntable Index Plate",
    category: "tillage",
    caption: "360-Degree Rotation Index Turntable for Pushing/Pulling Soil"
  }
];

export default function PhotoGallery({ lang }) {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'slider'
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [galleryImages, setGalleryImages] = useState(defaultPhotos);
  
  // Slider state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);

  // Real-time Firestore sync with phone Admin App
  useEffect(() => {
    const q = query(collection(db, 'photos'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Map and validate image URLs, filter out any broken local content:// URIs
        const mapped = data
          .map(d => ({
            ...d,
            url: d.imageUrl || d.url || '',
            caption: d.caption || d.title || ''
          }))
          .filter(d => d.url && !d.url.startsWith('content://'));

        if (mapped.length > 0) {
          setGalleryImages(mapped);
        }
      }
    }, (error) => {
      console.warn("Real-time photos listener fallback:", error);
    });

    return () => unsubscribe();
  }, []);

  const categories = [
    { id: 'all', labelEn: `All Photos (${galleryImages.length})`, labelMr: `सर्व फोटो (${galleryImages.length})` },
    { id: 'ploughs', labelEn: 'Ploughs / नांगर', labelMr: 'नांगर फोटो' },
    { id: 'tillage', labelEn: 'Tillage & Levelers', labelMr: 'कल्टिव्हेटर व लेव्हलर' },
    { id: 'sowing', labelEn: 'Seed Drills / पेरणी यंत्र', labelMr: 'पेरणी यंत्र फोटो' },
    { id: 'haulage', labelEn: 'Trailers / ट्रॉली', labelMr: 'ट्रॉली फोटो' }
  ];

  const matchesCategory = (imgCat, tabId) => {
    if (tabId === 'all') return true;
    if (!imgCat) return false;
    const cat = imgCat.toLowerCase();
    if (tabId === 'ploughs') return cat.includes('plough') || cat.includes('नांगर');
    if (tabId === 'tillage') return cat.includes('tillage') || cat.includes('cultivator') || cat.includes('leveler') || cat.includes('ridger') || cat.includes('कल्टिव्हेटर');
    if (tabId === 'sowing') return cat.includes('sowing') || cat.includes('seed') || cat.includes('पेरणी');
    if (tabId === 'haulage') return cat.includes('haulage') || cat.includes('trailer') || cat.includes('trolley') || cat.includes('ट्रॉली');
    return cat === tabId.toLowerCase();
  };

  const filteredImages = galleryImages.filter(img => matchesCategory(img.category, activeTab));

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
    if (lightboxIndex !== null && filteredImages.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null && filteredImages.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  const nextSlide = () => {
    if (filteredImages.length > 0) {
      setCurrentSlideIndex((currentSlideIndex + 1) % filteredImages.length);
    }
  };

  const prevSlide = () => {
    if (filteredImages.length > 0) {
      setCurrentSlideIndex((currentSlideIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  const getWhatsAppGalleryUrl = (img) => {
    if (!img) return `https://wa.me/${mainContact.whatsapp}`;
    const text = lang === 'mr'
      ? `नमस्कार पद्मश्री ॲग्रो, मी गॅलरी मधील "${img.title}" या अवजाराचा फोटो पाहिला असून मला याची खरी किंमत व खरेदी कोटेशन हवे आहे.`
      : `Hello Padmashri Agro, I saw "${img.title}" in your photo gallery and would like to get a formal quotation.`;
    return `https://wa.me/${mainContact.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  const currentSlide = filteredImages[currentSlideIndex] || filteredImages[0];
  const activeLightboxImage = lightboxIndex !== null ? (filteredImages[lightboxIndex] || filteredImages[0]) : null;

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">
            <Camera size={16} style={{ display: 'inline', marginRight: '6px' }} />
            {lang === 'mr' ? 'प्रत्यक्ष कारखान्यातील व अवजारांचे फोटो' : 'Real Factory & Product Photos'}
          </span>
          <h2 className="section-title" key={`gallery-title-${lang}`}>
            {lang === 'mr' 
              ? <React.Fragment>पद्मश्री <span>फोटो गॅलरी</span> ({galleryImages.length} HD Photos)</React.Fragment>
              : <React.Fragment>Product & <span>Factory Photo Gallery</span> ({galleryImages.length} HD Photos)</React.Fragment>
            }
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
        {viewMode === 'slider' && currentSlide && (
          <div className="gallery-carousel-wrapper">
            <div className="carousel-main-display">
              <img 
                src={currentSlide.url} 
                alt={currentSlide.title} 
                className="carousel-main-img"
                loading="lazy"
                decoding="async"
              />

              <div className="carousel-badge-counter" aria-live="polite" aria-atomic="true">
                <span>{currentSlideIndex + 1} / {filteredImages.length}</span>
              </div>

              {/* Slider Controls */}
              <button 
                onClick={prevSlide} 
                className="carousel-arrow left" 
                aria-label={lang === 'mr' ? 'मागील फोटो' : 'Previous image'}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextSlide} 
                className="carousel-arrow right" 
                aria-label={lang === 'mr' ? 'पुढील फोटो' : 'Next image'}
              >
                <ChevronRight size={24} />
              </button>

              <div className="carousel-caption-overlay">
                <div className="caption-text">
                  <h3>{currentSlide.title}</h3>
                  <p>{currentSlide.caption}</p>
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
                    href={getWhatsAppGalleryUrl(currentSlide)}
                    target="_blank"
                    rel="noopener noreferrer"
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
                title={isAutoplay ? (lang === 'mr' ? 'ऑटो-स्लाईड बंद करा' : 'Pause auto-slide') : (lang === 'mr' ? 'ऑटो-स्लाईड सुरू करा' : 'Play auto-slide')}
                aria-label={isAutoplay ? (lang === 'mr' ? 'ऑटो-प्ले थांबवा' : 'Pause autoplay') : (lang === 'mr' ? 'ऑटो-प्ले सुरू करा' : 'Start autoplay')}
              >
                {isAutoplay ? <Pause size={16} /> : <Play size={16} />}
                <span>{isAutoplay ? 'Pause' : 'Auto Play'}</span>
              </button>

              <div className="thumbs-scroll-row">
                {filteredImages.map((img, idx) => (
                  <div 
                    key={img.id || idx}
                    className={`thumb-item ${currentSlideIndex === idx ? 'active' : ''}`}
                    onClick={() => setCurrentSlideIndex(idx)}
                  >
                    <ResponsiveImage src={img.url} alt={img.title} preset="thumbnail" />
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
                key={img.id || idx} 
                className="gallery-card-item"
                onClick={() => openLightbox(idx)}
              >
                <div className="gallery-card-img-box">
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    loading="lazy"
                    decoding="async"
                  />
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
        {activeLightboxImage && (
          <div className="modal-backdrop" onClick={closeLightbox}>
            <div 
              className="lightbox-modal-content"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={closeLightbox}
                className="lightbox-close-btn"
                aria-label={lang === 'mr' ? 'लाईटबॉक्स बंद करा' : 'Close lightbox'}
              >
                <X size={22} />
              </button>

              <div className="lightbox-image-stage">
                <img 
                  src={activeLightboxImage.url} 
                  alt={activeLightboxImage.title}
                  className="lightbox-active-img"
                />

                <button 
                  onClick={prevLightbox} 
                  className="lightbox-arrow left" 
                  aria-label={lang === 'mr' ? 'मागील फोटो' : 'Previous photo'}
                >
                  <ChevronLeft size={28} />
                </button>

                <button 
                  onClick={nextLightbox} 
                  className="lightbox-arrow right" 
                  aria-label={lang === 'mr' ? 'पुढील फोटो' : 'Next photo'}
                >
                  <ChevronRight size={28} />
                </button>

                <div className="lightbox-counter-pill">
                  {lightboxIndex + 1} / {filteredImages.length}
                </div>
              </div>

              {/* Lightbox Footer & Action Row */}
              <div className="lightbox-info-bar">
                <div className="lightbox-title-group">
                  <h4>{activeLightboxImage.title}</h4>
                  <p>{activeLightboxImage.caption}</p>
                </div>

                <a 
                  href={getWhatsAppGalleryUrl(activeLightboxImage)}
                  target="_blank"
                  rel="noopener noreferrer"
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
                    key={img.id || i}
                    className={`lb-thumb ${lightboxIndex === i ? 'active' : ''}`}
                    onClick={() => setLightboxIndex(i)}
                  >
                    <ResponsiveImage src={img.url} alt={img.title} preset="thumbnail" />
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
