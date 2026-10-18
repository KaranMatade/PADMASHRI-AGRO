import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductCatalog from './components/ProductCatalog';
import PriceCalculator from './components/PriceCalculator';
import PhotoGallery from './components/PhotoGallery';
import VideoGallery from './components/VideoGallery';
import BranchLocator from './components/BranchLocator';
import MobileStickyActionBar from './components/MobileStickyActionBar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import NotFound from './components/NotFound';
import useLocalStorage from './hooks/useLocalStorage';
import { Toaster } from 'sonner';



// Lazy load modal components for code splitting
const ProductDetailModal = lazy(() => import('./components/ProductDetailModal'));
const InquiryModal = lazy(() => import('./components/InquiryModal'));

function MainApp() {
  const [lang, setLang] = useLocalStorage('padmashri-lang', 'mr');
  const [theme, setTheme] = useLocalStorage('padmashri-theme', 'light');
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
    <ErrorBoundary>
      <div className="app-container" vaul-drawer-wrapper="">
        <Header
          key={`header-${lang}`}
          lang={lang}
          setLang={setLang}
          theme={theme}
          setTheme={setTheme}
          onOpenInquiry={handleOpenInquiry}
        />

        {/* Main content — one single <h1> lives inside HeroSection */}
        <main id="main-content" key={`main-content-${lang}`}>
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

          <VideoGallery 
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
          key={`footer-${lang}`}
          lang={lang}
        />

        {/* Mobile Sticky Quick Action Bar */}
        <MobileStickyActionBar
          lang={lang}
          onOpenInquiry={() => handleOpenInquiry()}
        />

        {/* Product Specification Lightbox Modal */}
        {selectedProduct && (
          <Suspense fallback={<LoadingSpinner />}>
            <ProductDetailModal
              product={selectedProduct}
              lang={lang}
              onClose={() => setSelectedProduct(null)}
              onOpenInquiry={handleOpenInquiry}
            />
          </Suspense>
        )}

        {/* Inquiry Quote Modal */}
        {inquiryModalOpen && (
          <Suspense fallback={<LoadingSpinner />}>
            <InquiryModal
              lang={lang}
              preselectedProduct={inquiryPreselect}
              onClose={() => {
                setInquiryModalOpen(false);
                setInquiryPreselect(null);
              }}
            />
          </Suspense>
        )}

        <Toaster position="bottom-right" richColors />
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public main site */}
        <Route path="/" element={<MainApp />} />

        {/* Custom 404 — catches all unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
