import React, { useState } from 'react';
import { Search, CheckCircle2, SlidersHorizontal, MessageCircle, Eye, Tag, Sparkles, Award } from 'lucide-react';
import { productsData } from '../data/productsData';
import { mainContact } from '../data/branchesData';

export default function ProductCatalog({ lang, onSelectProduct, onOpenInquiry }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
      ? `नमस्कार पद्मश्री ॲग्रो, मला ${product.nameMr} (किंमत: ₹${product.priceMin.toLocaleString()} - ₹${product.priceMax.toLocaleString()}) बद्दल अधिक माहिती व ऑर्डर करायची आहे.`
      : `Hello Padmashri Agro, I want to inquire about ${product.name} (Price range: ₹${product.priceMin.toLocaleString()} - ₹${product.priceMax.toLocaleString()}).`;
    return `https://wa.me/${mainContact.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="products" className="catalog-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">
            {lang === 'mr' ? 'गुणवत्ता व टिकाऊपणा' : 'Heavy Duty Agriculture Machinery'}
          </span>
          <h2 className="section-title">
            {lang === 'mr' ? (
              <>पद्मश्री <span>शेती अवजारे</span> कॅटलॉग</>
            ) : (
              <>Product <span>Catalog & Pricing</span></>
            )}
          </h2>
          <p className="section-desc">
            {lang === 'mr'
              ? 'सर्व अवजारे उच्च दर्जाच्या लोखंडापासून बनवलेली असून थेट सादतपूर कारखान्यातून वॉरंटीसह मिळतील.'
              : 'Explore our complete lineup of heavy duty agricultural machinery with official size options and factory-direct price ranges.'}
          </p>
        </div>

        {/* Filter and Search Bar */}
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

          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              id="product-search-input"
              type="text"
              placeholder={lang === 'mr' ? 'अवजार किंवा साईज शोधा (उदा. 14 inch, 5 Ton)...' : 'Search by name or size (e.g. 14 inch, 5 Ton)...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="product-grid">
          {filteredProducts.map(product => (
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

                {/* Available Sizes Row */}
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

                {/* Factory Price Tag */}
                <div className="product-price-tag">
                  <div>
                    <div className="price-label">{lang === 'mr' ? 'अंदाजे कारखान्यातील किंमत' : 'Estimated Factory Price'}</div>
                    <div className="price-value">
                      ₹{product.priceMin.toLocaleString()} - ₹{product.priceMax.toLocaleString()}/-
                    </div>
                  </div>
                  <Tag size={20} style={{ color: 'var(--secondary)' }} />
                </div>

                {/* Features List */}
                <ul className="product-features-list">
                  {(lang === 'mr' ? product.featuresMr : product.features).slice(0, 3).map((feat, i) => (
                    <li key={i} className="product-feature-item">
                      <CheckCircle2 size={16} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Card Action Buttons */}
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
                    <span>{lang === 'mr' ? 'व्हॉट्सॲप ऑर्डर' : 'WhatsApp Order'}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
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
