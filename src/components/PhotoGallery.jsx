import React, { useState } from 'react';
import { Camera, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryImages } from '../data/galleryData';

export default function PhotoGallery({ lang }) {
  const [activeTab, setActiveTab] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = [
    { id: 'all', labelEn: 'All Photos (43)', labelMr: 'सर्व फोटो (४३)' },
    { id: 'ploughs', labelEn: 'Ploughs / नांगर', labelMr: 'नांगर फोटो' },
    { id: 'tillage', labelEn: 'Tillage & Levelers', labelMr: 'कल्टिव्हेटर व लेव्हलर' },
    { id: 'sowing', labelEn: 'Seed Drills / पेरणी यंत्र', labelMr: 'पेरणी यंत्र फोटो' },
    { id: 'haulage', labelEn: 'Trailers / ट्रॉली', labelMr: 'ट्रॉली फोटो' }
  ];

  const filteredImages = galleryImages.filter(img => 
    activeTab === 'all' || img.category === activeTab
  );

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
              <>पद्मश्री <span>फोटो गॅलरी</span> (43 Photos)</>
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

        {/* Category Tabs */}
        <div className="category-tabs" style={{ justifyContent: 'center', marginBottom: '2.5rem' }}>
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

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {filteredImages.map((img, idx) => (
            <div 
              key={img.id} 
              className="gallery-item"
              onClick={() => openLightbox(idx)}
            >
              <img src={img.url} alt={img.title} loading="lazy" />
              <div className="gallery-overlay">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="gallery-caption">{img.title}</span>
                  <Maximize2 size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxIndex !== null && (
          <div className="modal-backdrop" onClick={closeLightbox}>
            <div 
              style={{ position: 'relative', maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={closeLightbox}
                style={{ position: 'absolute', top: '-45px', right: '0', color: 'white', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '6px' }}
              >
                <X size={24} />
              </button>

              <div style={{ position: 'relative', width: '100%', height: '70vh', background: '#000', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src={filteredImages[lightboxIndex].url} 
                  alt={filteredImages[lightboxIndex].title}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />

                <button 
                  onClick={prevLightbox}
                  style={{ position: 'absolute', left: '15px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ChevronLeft size={28} />
                </button>

                <button 
                  onClick={nextLightbox}
                  style={{ position: 'absolute', right: '15px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ChevronRight size={28} />
                </button>
              </div>

              <div style={{ color: 'white', textAlign: 'center', marginTop: '1rem' }}>
                <h4 style={{ fontSize: '1.2rem' }}>{filteredImages[lightboxIndex].title}</h4>
                <p style={{ color: 'var(--slate-400)', fontSize: '0.9rem' }}>{filteredImages[lightboxIndex].caption} ({lightboxIndex + 1} of {filteredImages.length})</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
