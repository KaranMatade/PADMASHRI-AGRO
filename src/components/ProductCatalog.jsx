import React, { useState, useEffect } from 'react';
import ResponsiveImage from './ResponsiveImage';
import { Search, CheckCircle2, SlidersHorizontal, MessageCircle, Eye, Tag, Sparkles, Award, PhoneCall, Star, ShieldCheck, Grid, List, Heart } from 'lucide-react';
import { useContactData } from '../hooks/useContactData';
import useDebounce from '../hooks/useDebounce';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

export default function ProductCatalog({ lang, onSelectProduct, onOpenInquiry }) {
  const { mainContact } = useContactData();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Debounce search query to prevent excessive re-renders
  const debouncedSearch = useDebounce(searchQuery, searchQuery === '' ? 0 : 300);

  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProductsData(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Only display products that are active in real-time
  const activeProducts = productsData.filter(product => {
    if (product.isActive === false || product.status === 'inactive') return false;
    return true;
  });

  const categories = [
    { id: 'all', nameEn: `All Implements (${activeProducts.length})`, nameMr: `सर्व अवजारे (${activeProducts.length})` },
    { id: 'ploughs', nameEn: 'Ploughs / नांगर', nameMr: 'नांगर (Ploughs)' },
    { id: 'tillage', nameEn: 'Tillage & Levelers', nameMr: 'कल्टिव्हेटर व लेव्हलर' },
    { id: 'sowing', nameEn: 'Seed Drills / पेरणी यंत्र', nameMr: 'पेरणी यंत्र (Seed Drills)' },
    { id: 'haulage', nameEn: 'Trailers / ट्रॉली', nameMr: 'ट्रॉली व ट्रेलर' }
  ];

  const filteredProducts = activeProducts.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const searchLower = debouncedSearch.toLowerCase();
    const matchesSearch = 
      (product.name && product.name.toLowerCase().includes(searchLower)) ||
      (product.nameMr && product.nameMr.toLowerCase().includes(searchLower)) ||
      (product.sizes && Array.isArray(product.sizes) && product.sizes.some(s => s.toLowerCase().includes(searchLower)));

    return matchesCategory && matchesSearch;
  });

  const getWhatsAppMessage = (product) => {
    const text = lang === 'mr'
      ? `नमस्कार पद्मश्री ॲग्रो, मला ${product.nameMr} (किंमत: ₹${product.priceMin.toLocaleString()} - ₹${product.priceMax.toLocaleString()}) बद्दल सर्वोत्तम किंमत व सवलत खरेदी कोटेशन हवे आहे.`
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
          <h2 className="section-title" key={`prod-title-${lang}`}>
            {lang === 'mr' ? (
              <span>पद्मश्री <span>शेती अवजारे</span> कॅटलॉग</span>
            ) : (
              <span>Product <span>Catalog & Factory Pricing</span></span>
            )}
          </h2>
          <p className="section-desc">
            {lang === 'mr'
              ? 'आय.एस.आय (ISI) मानक दर्जाचे अवजारे थेट सादतपूर, संगमनेर कारखान्यातून वॉरंटीसह मिळतील.'
              : 'Direct manufacturer pricing on certified heavy duty agricultural equipment with official warranty.'}
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>{lang === 'mr' ? 'लोड होत आहे...' : 'Loading products...'}</p>
          </div>
        ) : (
          <>
            {/* Filter Bar with Search and View Mode Switcher */}
        <div className="filter-bar">
          <div className="category-tabs" role="tablist" aria-label={lang === 'mr' ? 'अवजार प्रकार' : 'Product categories'}>
            {categories.map(cat => (
              <button
                key={cat.id}
                id={`cat-tab-${cat.id}`}
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {lang === 'mr' ? cat.nameMr : cat.nameEn}
              </button>
            ))}
          </div>

          <div className="filter-controls-right">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={18} aria-hidden="true" />
              <label htmlFor="product-search-input" className="sr-only">
                {lang === 'mr' ? 'अवजार शोधा' : 'Search products'}
              </label>
              <input
                id="product-search-input"
                type="text"
                placeholder={lang === 'mr' ? 'अवजार किंवा साईज शोधा (उदा. 14 inch)...' : 'Search product or size (e.g. 14 inch)...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label={lang === 'mr' ? 'अवजार शोधा' : 'Search products'}
              />
            </div>

            {/* View Mode Toggle Button */}
            <div className="view-mode-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title={lang === 'mr' ? 'ग्रिड व्ह्यू' : 'E-Commerce Grid View'}
                aria-label={lang === 'mr' ? 'ग्रिड व्ह्यू' : 'Grid view'}
                aria-pressed={viewMode === 'grid'}
              >
                <Grid size={18} />
                <span className="view-btn-text">{lang === 'mr' ? 'कार्ड (Grid)' : 'Grid'}</span>
              </button>
              <button 
                className={`view-btn ${viewMode === 'b2b' ? 'active' : ''}`}
                onClick={() => setViewMode('b2b')}
                title={lang === 'mr' ? 'यादी व्ह्यू' : 'B2B List View'}
                aria-label={lang === 'mr' ? 'यादी व्ह्यू' : 'List view'}
                aria-pressed={viewMode === 'b2b'}
              >
                <List size={18} />
                <span className="view-btn-text">{lang === 'mr' ? 'यादी (List)' : 'List'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN E-COMMERCE GRID / B2B LIST CONTAINER */}
        <div className={viewMode === 'grid' ? 'product-grid' : 'b2b-list-container'}>
          {filteredProducts.map(product => {
            if (viewMode === 'grid') {
              return (
                <div key={product.id} className="product-card flex flex-col h-full relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="product-card-image-box relative" onClick={() => onSelectProduct(product)}>
                    <div 
                      className="absolute top-2 right-2 bg-white rounded-full shadow-sm p-1.5 z-10 hover:text-red-500 cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); /* wishlist logic */ }}
                    >
                      <Heart size={16} />
                    </div>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="product-card-badge-pill px-2 py-1 flex items-center justify-center text-center">
                      <Award size={13} className="mr-1" />
                      <span>{product.badge}</span>
                    </div>
                  </div>

                  <div className="product-card-body flex flex-col flex-grow">
                    <div className="flex-grow">
                      <h3 className="product-title" onClick={() => onSelectProduct(product)}>{product.name}</h3>
                      <p className="product-title-mr">{product.nameMr}</p>
                    </div>

                    <div className="product-price-tag">
                      <div>
                        <div className="price-label">{lang === 'mr' ? 'कारखान्यातील दर:' : 'Factory Price:'}</div>
                        <div className="price-value">
                          ₹{product.priceMin.toLocaleString()} - ₹{product.priceMax.toLocaleString()}/-
                        </div>
                      </div>
                      <Tag size={16} style={{ color: 'var(--secondary)' }} />
                    </div>

                    <div className="product-card-footer">
                      <button
                        id={`btn-details-${product.id}`}
                        className="btn-card-details"
                        onClick={() => onSelectProduct(product)}
                      >
                        <Eye size={14} />
                        <span>{lang === 'mr' ? 'तपशील' : 'Specs'}</span>
                      </button>

                      <a
                        id={`btn-wa-${product.id}`}
                        href={getWhatsAppMessage(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-card-quote"
                      >
                        <MessageCircle size={14} />
                        <span>{lang === 'mr' ? 'ऑर्डर' : 'Quote'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            }

            // B2B Row Card View
            return (
              <div key={product.id} className="b2b-product-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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
                  <span className="b2b-badge-pill px-2 py-1 text-center flex items-center justify-center">{product.badge}</span>
                </div>

                <div className="b2b-card-body flex flex-col md:flex-row gap-4 items-start w-full">
                  <div className="b2b-img-box w-full md:w-48 flex-shrink-0 relative overflow-hidden rounded-md" onClick={() => onSelectProduct(product)}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="b2b-img-zoom-tag">
                      <Eye size={13} />
                      <span>{lang === 'mr' ? 'झूम पहा' : 'View'}</span>
                    </div>
                  </div>

                  <div className="b2b-info-col flex-grow min-w-0">
                    <h3 className="b2b-title" onClick={() => onSelectProduct(product)}>
                      {product.name}
                    </h3>
                    <p className="b2b-title-mr">{product.nameMr}</p>

                    <div className="b2b-price-box">
                      <span className="b2b-price-label">{lang === 'mr' ? 'कारखान्यातील थेट दर:' : 'Starts From:'}</span>
                      <div className="b2b-price-val">
                        ₹{product.priceMin.toLocaleString()} - ₹{product.priceMax.toLocaleString()}/-
                      </div>
                    </div>

                    <div className="b2b-variants-row">
                      <span className="variant-label">{lang === 'mr' ? 'साईज:' : 'Sizes:'}</span>
                      {product.sizes.map((sz, i) => (
                        <span key={i} className="b2b-size-chip">{sz}</span>
                      ))}
                    </div>
                  </div>
                </div>

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
                    rel="noopener noreferrer"
                    className="b2b-btn-quote"
                  >
                    <MessageCircle size={16} />
                    <span>{lang === 'mr' ? 'ऑफर दर मागा' : 'Get Best Price'}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
            <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>{lang === 'mr' ? 'कोणतेही अवजार सापडले नाही' : 'No products match your search'}</h3>
            <p className="text-muted">{lang === 'mr' ? 'कृपया शोधाचे शब्द किंवा फिल्टर बदला.' : 'Try adjusting your search query or reset the category filter.'}</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="btn-outline" 
              style={{ marginTop: '1rem', padding: '0.6rem 1.25rem', fontSize: '0.88rem' }}
            >
              {lang === 'mr' ? 'सर्व अवजारे पहा' : 'View All Products'}
            </button>
          </div>
        )}
        </>
        )}
      </div>
    </section>
  );
}

