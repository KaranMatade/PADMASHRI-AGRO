import React, { useState } from 'react';
import { X, CheckCircle2, MessageCircle, PhoneCall, ShieldCheck, Wrench, Layers, Tag, Check, Sparkles, Award, Cpu, FileText, CheckSquare } from 'lucide-react';
import { mainContact } from '../data/branchesData';

export default function ProductDetailModal({ product, lang, onClose, onOpenInquiry }) {
  if (!product) return null;

  const [activeImg, setActiveImg] = useState(product.image);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  const selectedSize = product.sizes[selectedSizeIndex] || product.sizes[0];

  // Calculate dynamic price based on selected size
  const totalSizes = product.sizes.length;
  let displayPriceMin = product.priceMin;
  let displayPriceMax = product.priceMax;

  if (totalSizes > 1) {
    const step = (product.priceMax - product.priceMin) / (totalSizes - 1);
    const estVal = Math.round(product.priceMin + (step * selectedSizeIndex));
    displayPriceMin = Math.round(estVal * 0.96);
    displayPriceMax = Math.round(estVal * 1.04);
  }

  const whatsappUrl = `https://wa.me/${mainContact.whatsapp}?text=${encodeURIComponent(
    lang === 'mr'
      ? `नमस्कार पद्मश्री ॲग्रो, मला ${product.nameMr} (${product.name}) - साईज: ${selectedSize} (दर: ₹${displayPriceMin.toLocaleString()} - ₹${displayPriceMax.toLocaleString()}/-) ची सविस्तर माहिती व खरेदी कोटेशन हवे आहे.`
      : `Hello Padmashri Agro, I would like to get a formal quotation for ${product.name} (Size Variant: ${selectedSize}, Price range: ₹${displayPriceMin.toLocaleString()} - ₹${displayPriceMax.toLocaleString()}).`
  )}`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content product-specs-modal" 
        onClick={e => e.stopPropagation()}
      >
        <button 
          className="modal-close-btn" 
          onClick={onClose} 
          aria-label="Close modal"
          title="Close window"
        >
          <X size={20} />
        </button>

        <div className="modal-grid-container">
          {/* Left Column: Visual Showcase & Gallery */}
          <div className="modal-left-col">
            <div className="modal-main-image-box">
              <img src={activeImg} alt={product.name} />
              <div className="modal-image-badge">
                <ShieldCheck size={14} style={{ color: 'var(--primary-light)' }} />
                <span>100% Factory Built</span>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            <div className="modal-thumbs-row">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  type="button"
                  onClick={() => setActiveImg(img)}
                  className={`modal-thumb-btn ${activeImg === img ? 'active' : ''}`}
                >
                  <img src={img} alt={`Thumb ${i}`} />
                </button>
              ))}
            </div>

            {/* Tractor HP Compatibility Badge Card */}
            <div className="hp-recommendation-box">
              <div className="hp-header">
                <Wrench size={18} className="hp-icon" />
                <span>{lang === 'mr' ? 'ट्रॅक्टर एच.पी जोडणी शिफारस' : 'Recommended Tractor Power'}</span>
              </div>
              <div className="hp-value">{product.tractorHp}</div>
            </div>
          </div>

          {/* Right Column: Product Specs & Size Selector */}
          <div className="modal-right-col">
            {/* Category & Verified Badges */}
            <div className="modal-badges-header">
              <span className="badge badge-primary">
                <Tag size={13} />
                <span>{product.categoryName}</span>
              </span>
              <span className="badge badge-amber">
                <Award size={13} />
                <span>{product.badge}</span>
              </span>
            </div>

            <h2 className="modal-product-title">{product.name}</h2>
            <p className="modal-product-title-mr">{product.nameMr}</p>

            {/* Size Selector Bar (Interactive) */}
            <div className="size-selector-container">
              <label className="size-selector-label">
                <Sparkles size={16} style={{ color: 'var(--secondary)' }} />
                <span>{lang === 'mr' ? 'साईज पर्याय निवडा (Select Size Variant):' : 'Select Size Variant:'}</span>
              </label>
              
              <div className="size-buttons-group">
                {product.sizes.map((sz, idx) => {
                  const isSelected = selectedSizeIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`size-select-pill ${isSelected ? 'selected' : ''}`}
                    >
                      {isSelected && <Check size={14} className="check-icon" />}
                      <span>{sz}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Price Display */}
            <div className="modal-price-box">
              <div className="price-info-group">
                <span className="price-label">
                  {lang === 'mr' ? `अंदाजित कारखान्यातील दर (${selectedSize}):` : `Estimated Factory Price for (${selectedSize}):`}
                </span>
                <div className="price-val">
                  ₹{displayPriceMin.toLocaleString()} - ₹{displayPriceMax.toLocaleString()}/-
                </div>
              </div>
              <Tag size={22} style={{ color: 'var(--secondary)' }} />
            </div>

            {/* Key Advantages List */}
            <div className="modal-features-section">
              <h4 className="modal-section-h4">
                <CheckSquare size={16} style={{ color: 'var(--primary)' }} />
                <span>{lang === 'mr' ? 'मुख्य तांत्रिक वैशिष्ट्ये (Key Advantages):' : 'Main Technical Characteristics:'}</span>
              </h4>
              <ul className="modal-features-list">
                {(lang === 'mr' ? product.featuresMr : product.features).map((f, i) => (
                  <li key={i}>
                    <CheckCircle2 size={16} className="feat-check" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Specs Table Grid */}
            <div className="modal-specs-box">
              <h4 className="modal-section-h4">
                <FileText size={16} style={{ color: 'var(--secondary)' }} />
                <span>{lang === 'mr' ? 'तांत्रिक माहिती (Technical Specifications):' : 'Technical Specifications:'}</span>
              </h4>

              <div className="specs-table-grid">
                {Object.entries(product.specs).map(([key, val], idx) => (
                  <div key={idx} className="spec-row">
                    <div className="spec-key-col">
                      <Cpu size={14} className="spec-icon" />
                      <span>{key}</span>
                    </div>
                    <div className="spec-val-col">
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="modal-actions-row">
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-amber modal-btn"
              >
                <MessageCircle size={18} />
                <span>{lang === 'mr' ? 'व्हॉट्सॲप ऑर्डर' : 'WhatsApp Order'}</span>
              </a>

              <button 
                onClick={() => { onClose(); onOpenInquiry(product); }}
                className="btn-primary modal-btn" 
              >
                <PhoneCall size={18} />
                <span>{lang === 'mr' ? 'कोटेशन मागा' : 'Get Official Quote'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
