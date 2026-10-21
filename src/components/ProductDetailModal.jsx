import React, { useState, useEffect } from 'react';
import ResponsiveImage from './ResponsiveImage';
import { 
  X, CheckCircle2, MessageCircle, PhoneCall, ShieldCheck, 
  Wrench, Tag, Check, Sparkles, Award, Cpu, FileText, CheckSquare 
} from 'lucide-react';
import { useContactData } from '../hooks/useContactData';
import useFocusTrap from '../hooks/useFocusTrap';

export default function ProductDetailModal({ product, lang, onClose, onOpenInquiry }) {
  const { mainContact } = useContactData();
  if (!product) return null;

  const [activeImg, setActiveImg] = useState(product.image);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  // Focus trap for keyboard accessibility
  const modalRef = useFocusTrap(!!product);

  // Reset modal state when product changes
  useEffect(() => {
    if (product) {
      setActiveImg(product.image);
      setSelectedSizeIndex(0);
    }
  }, [product?.id]);

  // Lock body scroll and handle ESC key
  useEffect(() => {
    document.body.classList.add('modal-open');
    const handleEscapeEvent = () => {
      onClose();
    };

    if (modalRef.current) {
      modalRef.current.addEventListener('escapeKeyPressed', handleEscapeEvent);
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('modal-open');
      if (modalRef.current) {
        modalRef.current.removeEventListener('escapeKeyPressed', handleEscapeEvent);
      }
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, modalRef]);

  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['Standard'];
  const selectedSize = sizes[selectedSizeIndex] || sizes[0];

  // Calculate dynamic price based on selected size
  const totalSizes = sizes.length;
  let displayPriceMin = product.priceMin || 0;
  let displayPriceMax = product.priceMax || 0;

  if (totalSizes > 1) {
    const step = (displayPriceMax - displayPriceMin) / (totalSizes - 1);
    const estVal = Math.round(displayPriceMin + (step * selectedSizeIndex));
    displayPriceMin = Math.round(estVal * 0.96);
    displayPriceMax = Math.round(estVal * 1.04);
  }

  const whatsappUrl = `https://wa.me/${mainContact.whatsapp}?text=${encodeURIComponent(
    lang === 'mr'
      ? `नमस्कार पद्मश्री ॲग्रो, मला ${product.nameMr || product.name} (${product.name}) - साईज: ${selectedSize} (दर: ₹${displayPriceMin.toLocaleString()} - ₹${displayPriceMax.toLocaleString()}/-) ची सविस्तर माहिती व खरेदी कोटेशन हवे आहे.`
      : `Hello Padmashri Agro, I would like to get a formal quotation for ${product.name} (Size Variant: ${selectedSize}, Price range: ₹${displayPriceMin.toLocaleString()} - ₹${displayPriceMax.toLocaleString()}).`
  )}`;

  // Filter unique valid images
  const imageList = Array.from(new Set([product.image, ...(product.images || [])].filter(Boolean)));

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      role="presentation"
    >
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-product-title"
        className="modal-content product-specs-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          type="button"
          className="modal-close-btn" 
          onClick={onClose}
          aria-label={lang === 'mr' ? 'मोडल बंद करा' : 'Close modal'}
          title={lang === 'mr' ? 'विंडो बंद करा' : 'Close window'}
        >
          <X size={18} />
        </button>

        <div className="modal-grid-container">
          {/* Left Column: Visual Showcase & Gallery */}
          <div className="modal-left-col">
            <div className="modal-main-image-box">
              <ResponsiveImage src={activeImg} alt={product.name} preset="gallery" eager={true} />
              <div className="modal-image-badge">
                <ShieldCheck size={13} style={{ color: '#4ade80' }} />
                <span>100% Factory Built</span>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {imageList.length > 1 && (
              <div className="modal-thumbs-row">
                {imageList.map((img, i) => (
                  <button 
                    key={i} 
                    type="button"
                    onClick={() => setActiveImg(img)}
                    className={`modal-thumb-btn ${activeImg === img ? 'active' : ''}`}
                    aria-label={`${lang === 'mr' ? 'थंबनेल' : 'Thumbnail'} ${i + 1}`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} - Thumbnail ${i + 1}`} 
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Tractor HP Compatibility Badge Card */}
            {product.tractorHp && (
              <div className="hp-recommendation-box">
                <div className="hp-header">
                  <Wrench size={14} className="hp-icon" />
                  <span>{lang === 'mr' ? 'ट्रॅक्टर जोडणी शिफारस' : 'Tractor HP Compatibility'}</span>
                </div>
                <div className="hp-value">{product.tractorHp}</div>
              </div>
            )}
          </div>

          {/* Right Column: Product Specs & Size Selector */}
          <div className="modal-right-col">
            {/* Category & Verified Badges */}
            <div className="modal-badges-header">
              {(product.categoryName || product.category) && (
                <span className="badge badge-primary">
                  <Tag size={12} />
                  <span>{product.categoryName || product.category}</span>
                </span>
              )}
              {product.badge && (
                <span className="badge badge-amber">
                  <Award size={12} />
                  <span>{product.badge}</span>
                </span>
              )}
            </div>

            <h2 className="modal-product-title" id="modal-product-title">{product.name}</h2>
            {product.nameMr && <p className="modal-product-title-mr">{product.nameMr}</p>}

            {/* Size Selector Bar (Interactive) */}
            {sizes.length > 1 && (
              <div className="size-selector-container">
                <label className="size-selector-label">
                  <Sparkles size={14} style={{ color: '#d97706' }} />
                  <span>{lang === 'mr' ? 'साईज पर्याय निवडा (Size Variant):' : 'Select Size Variant:'}</span>
                </label>
                
                <div className="size-buttons-group">
                  {sizes.map((sz, idx) => {
                    const isSelected = selectedSizeIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSizeIndex(idx)}
                        className={`size-select-pill ${isSelected ? 'selected' : ''}`}
                        aria-label={`${lang === 'mr' ? 'साईज निवडा' : 'Select size'} ${sz}`}
                        aria-pressed={isSelected}
                      >
                        {isSelected && <Check size={13} className="check-icon" />}
                        <span>{sz}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dynamic Price Display */}
            {(displayPriceMin > 0 || displayPriceMax > 0) && (
              <div className="modal-price-box">
                <div className="price-info-group">
                  <span className="price-label">
                    {lang === 'mr' 
                      ? `अंदाजित कारखान्यातील दर ${totalSizes > 1 ? `(${selectedSize})` : ''}:` 
                      : `Estimated Factory Price ${totalSizes > 1 ? `(${selectedSize})` : ''}:`}
                  </span>
                  <div className="price-val">
                    ₹{displayPriceMin.toLocaleString()} - ₹{displayPriceMax.toLocaleString()}/-
                  </div>
                </div>
                <Tag size={20} style={{ color: '#16a34a' }} />
              </div>
            )}

            {/* Key Advantages List */}
            {((lang === 'mr' && product.featuresMr && product.featuresMr.length > 0) || (product.features && product.features.length > 0)) && (
              <div className="modal-features-section">
                <h4 className="modal-section-h4">
                  <CheckSquare size={14} style={{ color: '#15803d' }} />
                  <span>{lang === 'mr' ? 'मुख्य वैशिष्ट्ये (Key Advantages):' : 'Key Technical Features:'}</span>
                </h4>
                <ul className="modal-features-list">
                  {(lang === 'mr' && product.featuresMr && product.featuresMr.length > 0 ? product.featuresMr : (product.features || [])).map((f, i) => (
                    <li key={i}>
                      <CheckCircle2 size={14} className="feat-check" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technical Specs Table Grid */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="modal-specs-box">
                <h4 className="modal-section-h4">
                  <FileText size={14} style={{ color: '#d97706' }} />
                  <span>{lang === 'mr' ? 'तांत्रिक माहिती (Technical Specs):' : 'Technical Specifications:'}</span>
                </h4>

                <div className="specs-table-grid">
                  {Object.entries(product.specs).map(([key, val], idx) => (
                    <div key={idx} className="spec-row">
                      <div className="spec-key-col">
                        <Cpu size={13} className="spec-icon" />
                        <span>{key}</span>
                      </div>
                      <div className="spec-val-col">
                        {val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="modal-actions-row">
              <button 
                type="button"
                onClick={() => { onClose(); onOpenInquiry(product); }}
                className="modal-btn modal-btn-whatsapp"
                aria-label={lang === 'mr' ? 'व्हॉट्सॲप द्वारे चौकशी करा' : 'Inquire via WhatsApp'}
              >
                <MessageCircle size={17} />
                <span>{lang === 'mr' ? 'व्हॉट्सॲप ऑर्डर' : 'WhatsApp Order'}</span>
              </button>

              <button 
                type="button"
                onClick={() => { onClose(); onOpenInquiry(product); }}
                className="modal-btn modal-btn-quote" 
              >
                <PhoneCall size={17} />
                <span>{lang === 'mr' ? 'कोटेशन मागा' : 'Get Official Quote'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
