import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductCatalog from './components/ProductCatalog';
import ProductDetailModal from './components/ProductDetailModal';
import PriceCalculator from './components/PriceCalculator';
import PhotoGallery from './components/PhotoGallery';
import BranchLocator from './components/BranchLocator';
import InquiryModal from './components/InquiryModal';
import MobileStickyActionBar from './components/MobileStickyActionBar';
import Footer from './components/Footer';

export default function App() {
  const [lang, setLang] = useState('mr'); // Default to Marathi for local Maharashtra audience, switchable to English
  const [theme, setTheme] = useState('light');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryPreselect, setInquiryPreselect] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleOpenInquiry = (product = null) => {
    setInquiryPreselect(product);
    setInquiryModalOpen(true);
  };

  return (
    <div className="app-container">
      <Header 
        lang={lang} 
        setLang={setLang} 
        theme={theme} 
        setTheme={setTheme}
        onOpenInquiry={handleOpenInquiry}
      />

      <main>
        <HeroSection 
          lang={lang} 
          onOpenInquiry={handleOpenInquiry} 
        />

        <ProductCatalog 
          lang={lang} 
          onSelectProduct={setSelectedProduct}
          onOpenInquiry={handleOpenInquiry}
        />

        <PriceCalculator 
          lang={lang} 
        />

        <PhotoGallery 
          lang={lang} 
        />

        <BranchLocator 
          lang={lang} 
        />
      </main>

      <Footer 
        lang={lang} 
      />

      {/* Mobile Sticky Quick Action Bar */}
      <MobileStickyActionBar 
        lang={lang}
        onOpenInquiry={() => handleOpenInquiry()}
      />

      {/* Product Specification Lightbox Modal */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          lang={lang}
          onClose={() => setSelectedProduct(null)}
          onOpenInquiry={handleOpenInquiry}
        />
      )}

      {/* Inquiry Quote Modal */}
      {inquiryModalOpen && (
        <InquiryModal 
          lang={lang}
          preselectedProduct={inquiryPreselect}
          onClose={() => {
            setInquiryModalOpen(false);
            setInquiryPreselect(null);
          }}
        />
      )}
    </div>
  );
}
