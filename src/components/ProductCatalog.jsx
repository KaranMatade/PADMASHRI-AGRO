import React, { useState } from 'react';
import { Search, CheckCircle2, SlidersHorizontal, MessageCircle, Eye, Tag, Sparkles, Award, PhoneCall, Star, ShieldCheck, Grid, List } from 'lucide-react';
import { productsData } from '../data/productsData';
import { mainContact } from '../data/branchesData';

export default function ProductCatalog({ lang, onSelectProduct, onOpenInquiry }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('b2b'); // 'b2b' (IndiaMART/Justdial style) or 'grid'

  const categories = [
    { id: 'all', nameEn: 'All Implements (8)', nameMr: 'सर्व अवजारे (८)' },
    { id: 'ploughs', nameEn: 'Ploughs / नांगर', nameMr: 'नांगर (Ploughs)' },
    { id: 'tillage', nameEn: 'Tillage & Levelers', nameMr: 'कल्टिव्हेटर व लेव्हलर' },
    { id: 'sowing', nameEn: 'Seed Drills / पेरणी यंत्र', nameMr: 'पेरणी यंत्र (Seed Drills)' },
    { id: 'haulage', nameEn: 'Trailers / ट्रॉली', nameMr: 'ट्रॉली व ट्रेलर' }
  ];

  const filteredProducts = productsData.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      product.name.toLowerCase().includes(searchLower) ||
      product.nameMr.includes(searchLower) ||
      product.sizes.some(s => s.toLowerCase().includes(searchLower));

    return matchesCategory && matchesSearch;
  });

  const getWhatsAppMessage = (product) => {
    const text = lang === 'mr'
      ? `नमस्कार पद्मश्री ॲग्रो, मला ${product.nameMr} (किंमत: ₹${product.priceMin.toLocaleString()} - ₹${product.priceMax.toLocaleString()}) बद्दल बेस्ट प्राईस डिस्काउंट व खरेदी कोटेशन हवे आहे.`
      : `Hello Padmashri Agro, I want to get the best factory price quotation for ${product.name} (Price: ₹${product.priceMin.toLocaleString()} - ₹${product.priceMax.toLocaleString()}).`;
    return `https://wa.me/${mainContact.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="products" className="catalog-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">
            {lang === 'mr' ? 'गुणवत्ता व 100% कारखान्यातील दर' : 'Heavy Duty Agriculture Machinery'}
          </span>
          <h2 className="section-title">
            {lang === 'mr' ? (
              <>पद्मश्री <span>शेती अवजारे</span> कॅटलॉग</>
            ) : (
              <>Product <span>Catalog & Factory Pricing</span></>
            )}
          </h2>
          <p className="section-desc">
            {lang === 'mr'
              ? 'आय.एस.आय (ISI) मानक दर्जाचे अवजारे थेट सादतपूर, संगमनेर कारखान्यातून वॉरंटीसह मिळतील.'
              : 'Direct manufacturer pricing on certified heavy duty agricultural equipment with official warranty.'}
          </p>
        </div>

        {/* Top Horizontal Quick Highlights Rail (Justdial / IndiaMART Recommended Products Bar) */}
        <div className="mobile-recommended-rail-container">
          <div className="rail-header">
            <span className="rail-title">
              <Sparkles size={15} style={{ color: 'var(--secondary)' }} />
              {lang === 'mr' ? 'लोकल शेतकर्‍यांची पहिली पसंती (Recommended)' : 'Recommended Products For You'}
            </span>
          </div>
          <div className="mobile-recommended-rail">
            {productsData.slice(0, 5).map(prod => (
              <div key={prod.id} className="rail-card" onClick={() => onSelectProduct(prod)}>
                <div className="rail-card-img-wrapper">
                  <img src={prod.image} alt={prod.name} />
                  <span className="rail-badge">{prod.badge.split('/')[0]}</span>
                </div>
                <div className="rail-card-info">
                  <h4 className="rail-prod-name">{lang === 'mr' ? prod.nameMr : prod.name}</h4>
                  <div className="rail-price">₹{prod.priceMin.toLocaleString()}</div>
                  <button className="rail-call-btn">
                    <MessageCircle size={13} />
                    <span>{lang === 'mr' ? 'ऑर्डर' : 'Quote'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Bar with Search and View Mode Switcher */}
        <div className="filter-bar">
          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat.id}
                id={`cat-tab-${cat.id}`}
                className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {lang === 'mr' ? cat.nameMr : cat.nameEn}
              </button>
            ))}
          </div>

          <div className="filter-controls-right">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={18} />
              <input
                id="product-search-input"
                type="text"
                placeholder={lang === 'mr' ? 'अवजार किंवा साईज शोधा (उदा. 14 inch)...' : 'Search product or size (e.g. 14 inch)...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* View Mode Toggle Button */}
            <div className="view-mode-toggle">
              <button 
                className={`view-btn ${viewMode === 'b2b' ? 'active' : ''}`}
                onClick={() => setViewMode('b2b')}
                title="B2B List View (IndiaMART/Justdial Style)"
              >
                <List size={18} />
                <span className="view-btn-text">{lang === 'mr' ? 'यादी' : 'List'}</span>
              </button>
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid size={18} />
                <span className="view-btn-text">{lang === 'mr' ? 'कार्ड' : 'Grid'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN B2B LISTING CARDS / GRID CONTAINER */}
        <div className={viewMode === 'b2b' ? 'b2b-list-container' : 'product-grid'}>
          {filteredProducts.map(product => {
            if (viewMode === 'b2b') {
              return (
                <div key={product.id} className="b2b-product-card">
                  {/* Manufacturer Header Bar */}
                  <div className="b2b-card-header">
                    <div className="b2b-header-left">
                      <span className="b2b-verified-tag">
                        <ShieldCheck size={14} />
                        <span>VERIFIED MANUFACTURER</span>
                      </span>
                      <span className="b2b-rating-pill">
                        <Star size={13} fill="#f59e0b" color="#f59e0b" />
                        <span>4.9 (150+ Reviews)</span>
                      </span>
                    </div>
                    <span className="b2b-badge-pill">{product.badge}</span>
                  </div>

                  {/* Card Content Row */}
                  <div className="b2b-card-body">
                    {/* Product Photo Box */}
                    <div className="b2b-img-box" onClick={() => onSelectProduct(product)}>
                      <img src={product.image} alt={product.name} loading="lazy" />
                      <div className="b2b-img-zoom-tag">
                        <Eye size={13} />
                        <span>{lang === 'mr' ? 'झूम पहा' : 'View'}</span>
                      </div>
                    </div>

                    {/* Product Info Col */}
                    <div className="b2b-info-col">
                      <h3 className="b2b-title" onClick={() => onSelectProduct(product)}>
                        {product.name}
                      </h3>
                      <p className="b2b-title-mr">{product.nameMr}</p>

                      {/* Price Pill */}
                      <div className="b2b-price-box">
                        <span className="b2b-price-label">{lang === 'mr' ? 'कारखान्यातील थेट दर:' : 'Starts From:'}</span>
                        <div className="b2b-price-val">
                          ₹{product.priceMin.toLocaleString()} - ₹{product.priceMax.toLocaleString()}/-
                        </div>
                      </div>

                      {/* Variant Chips */}
                      <div className="b2b-variants-row">
                        <span className="variant-label">{lang === 'mr' ? 'साईज:' : 'Sizes:'}</span>
                        {product.sizes.map((sz, i) => (
                          <span key={i} className="b2b-size-chip">{sz}</span>
                        ))}
                      </div>

                      {/* Short Highlights */}
                      <div className="b2b-highlights-list">
                        {(lang === 'mr' ? product.featuresMr : product.features).slice(0, 2).map((ft, i) => (
                          <div key={i} className="b2b-feat-item">
                            <CheckCircle2 size={14} className="b2b-check-icon" />
                            <span>{ft}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dual Action Buttons (Justdial / IndiaMART Style) */}
                  <div className="b2b-card-actions">
                    <a
                      href={`tel:${mainContact.phone}`}
                      className="b2b-btn-call"
                    >
                      <PhoneCall size={16} />
                      <span>{lang === 'mr' ? 'कॉल करा' : 'Call Now'}</span>
                    </a>

                    <button
                      className="b2b-btn-specs"
                      onClick={() => onSelectProduct(product)}
                    >
                      <Eye size={16} />
                      <span>{lang === 'mr' ? 'तपशील' : 'Specs'}</span>
                    </button>

                    <a
                      href={getWhatsAppMessage(product)}
                      target="_blank"
                      rel="noreferrer"
                      className="b2b-btn-quote"
                    >
                      <MessageCircle size={16} />
                      <span>{lang === 'mr' ? 'ऑफर दर मागा' : 'Get Best Price'}</span>
                    </a>
                  </div>
                </div>
              );
            }

            // Standard Grid Card View
            return (
              <div key={product.id} className="product-card">
                <div className="product-card-image-box">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <div className="product-card-badge-pill">
                    <Award size={14} className="badge-pill-icon" />
                    <span>{product.badge}</span>
                  </div>
                </div>

                <div className="product-card-body">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-title-mr">{product.nameMr}</p>

                  <div className="product-sizes-row">
                    <div className="sizes-row-header">
                      <SlidersHorizontal size={13} />
                      <span>{lang === 'mr' ? 'उपलब्ध साईज:' : 'Available Variants:'}</span>
                    </div>
                    <div className="sizes-chips-group">
                      {product.sizes.map((sz, idx) => (
                        <span key={idx} className="size-chip-item">{sz}</span>
                      ))}
                    </div>
                  </div>

                  <div className="product-price-tag">
                    <div>
                      <div className="price-label">{lang === 'mr' ? 'अंदाजे कारखान्यातील किंमत' : 'Estimated Factory Price'}</div>
                      <div className="price-value">
                        ₹{product.priceMin.toLocaleString()} - ₹{product.priceMax.toLocaleString()}/-
                      </div>
                    </div>
                    <Tag size={20} style={{ color: 'var(--secondary)' }} />
                  </div>

                  <ul className="product-features-list">
                    {(lang === 'mr' ? product.featuresMr : product.features).slice(0, 3).map((feat, i) => (
                      <li key={i} className="product-feature-item">
                        <CheckCircle2 size={16} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="product-card-footer">
                    <button
                      id={`btn-details-${product.id}`}
                      className="btn-card-details"
                      onClick={() => onSelectProduct(product)}
                    >
                      <Eye size={16} />
                      <span>{lang === 'mr' ? 'तपशील (Specs)' : 'View Specs'}</span>
                    </button>

                    <a
                      id={`btn-wa-${product.id}`}
                      href={getWhatsAppMessage(product)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-card-quote"
                    >
                      <MessageCircle size={16} />
                      <span>{lang === 'mr' ? 'ऑर्डर करा' : 'WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
            <h3>{lang === 'mr' ? 'कोणतेही अवजार सापडले नाही' : 'No products match your search filter'}</h3>
            <p className="text-muted">{lang === 'mr' ? 'कृपया शोधाचे शब्द किंवा फिल्टर बदला.' : 'Try adjusting your search query or reset category filter.'}</p>
          </div>
        )}
      </div>
    </section>
  );
}
