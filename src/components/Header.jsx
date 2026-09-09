import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Globe, Menu, X, ShieldCheck, Sun, Moon, MessageSquare } from 'lucide-react';
import { mainContact } from '../data/branchesData';
import { imageUrl } from '../lib/imageUrl';

export default function Header({ lang, setLang, theme, setTheme, onOpenInquiry }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'mr' : 'en'));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="header-wrapper">
      {/* Dark Backdrop Overlay on mobile when menu is open */}
      {mobileMenuOpen && (
        <div 
          className="nav-backdrop" 
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Top Contact Bar (Desktop Only) */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-bar-left">
            <div className="top-info-item">
              <MapPin size={14} className="text-secondary" style={{ marginRight: '6px' }} />
              <span>{lang === 'mr' ? 'कारखाना: सादतपूर, संगमनेर' : 'Main Works: Sadatpur, Sangamner'}</span>
            </div>
            <div className="top-info-item">
              <Phone size={14} className="text-secondary" style={{ marginRight: '6px' }} />
              <a href={`tel:${mainContact.mainPhone}`} style={{ color: 'inherit' }}>{mainContact.mainPhone}</a>
            </div>
            <div className="top-info-item">
              <Mail size={14} className="text-secondary" style={{ marginRight: '6px' }} />
              <a href={`mailto:${mainContact.email}`} style={{ color: 'inherit' }}>{mainContact.email}</a>
            </div>
          </div>

          <div className="top-bar-right">
            <button 
              id="lang-toggle-btn" 
              onClick={toggleLang} 
              className="lang-toggle-btn"
              title={lang === 'en' ? 'भाषा बदला' : 'Switch Language'}
              aria-label={lang === 'en' ? 'Switch to Marathi' : 'Switch to English'}
            >
              <Globe size={14} aria-hidden="true" />
              <span>{lang === 'en' ? 'मराठी मध्ये पहा' : 'English'}</span>
            </button>

            <button 
              id="theme-toggle-btn" 
              onClick={toggleTheme} 
              className="lang-toggle-btn"
              title={lang === 'mr' ? 'थीम बदला' : 'Toggle Dark/Light Mode'}
              aria-label={theme === 'light' ? (lang === 'mr' ? 'डार्क मोड चालू करा' : 'Switch to dark mode') : (lang === 'mr' ? 'लाईट मोड चालू करा' : 'Switch to light mode')}
            >
              {theme === 'light' ? <Moon size={14} aria-hidden="true" /> : <Sun size={14} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar" role="navigation" aria-label={lang === 'mr' ? 'मुख्य नेव्हिगेशन' : 'Main Navigation'}>
        <div className="container navbar-inner">
          <a href="#home" className="brand-logo" aria-label={lang === 'mr' ? 'पद्मश्री ॲग्रो - मुख्यपृष्ठ' : 'Padmashri Agro - Home'}>
            <div className="brand-logo-img-wrapper">
              <img src={imageUrl("https://res.cloudinary.com/bthbndrq/image/upload/v1786167598/padmashri-agro/site/logo.jpg")} alt="Padmashri Agro Logo" className="brand-logo-img" />
            </div>
            <div className="brand-text">
              <div className="brand-name">{lang === 'mr' ? 'पद्मश्री ॲग्रो' : 'PADMASHRI AGRO'}</div>
              <span>{lang === 'mr' ? 'शेती अवजारे • सन १९९८' : 'AGRO MACHINERY • EST. 1998'}</span>
            </div>
          </a>

          {/* Desktop & Mobile Nav Links Drawer */}
          <ul 
            className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}
            role="list"
            aria-label={lang === 'mr' ? 'मुख्य नेव्हिगेशन मेनू' : 'Main navigation menu'}
          >
            <li>
              <a 
                href="#home" 
                className="nav-link-item active" 
                onClick={() => setMobileMenuOpen(false)}
              >
                {lang === 'mr' ? 'मुख्य पृष्ठ (Home)' : 'Home'}
              </a>
            </li>
            <li>
              <a 
                href="#products" 
                className="nav-link-item" 
                onClick={() => setMobileMenuOpen(false)}
              >
                {lang === 'mr' ? 'शेती अवजारे (Catalog)' : 'Products & Catalog'}
              </a>
            </li>
            <li>
              <a 
                href="#calculator" 
                className="nav-link-item" 
                onClick={() => setMobileMenuOpen(false)}
              >
                {lang === 'mr' ? 'दर अंदाजपत्रक (Calculator)' : 'Price Estimator'}
              </a>
            </li>
            <li>
              <a 
                href="#gallery" 
                className="nav-link-item" 
                onClick={() => setMobileMenuOpen(false)}
              >
                {lang === 'mr' ? 'गॅलरी (Photos)' : 'Photo Gallery'}
              </a>
            </li>
            <li>
              <a 
                href="#branches" 
                className="nav-link-item" 
                onClick={() => setMobileMenuOpen(false)}
              >
                {lang === 'mr' ? 'शाखा (Branches)' : 'Our Branches'}
              </a>
            </li>

            {/* Language Switcher inside Mobile Drawer */}
            <li className="mobile-only-lang-item">
              <button 
                onClick={() => { toggleLang(); setMobileMenuOpen(false); }}
                className="btn-amber"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Globe size={18} />
                <span>{lang === 'en' ? 'मराठी मध्ये पहा (Language)' : 'Switch to English'}</span>
              </button>
            </li>
          </ul>

          {/* Action Buttons */}
          <div className="nav-actions">
            <button 
              id="header-inquiry-btn" 
              className="btn-amber desktop-only-action"
              onClick={() => onOpenInquiry()}
              aria-label={lang === 'mr' ? 'कोटेशन मागा' : 'Get a quote'}
            >
              <MessageSquare size={16} aria-hidden="true" />
              <span>{lang === 'mr' ? 'कोटेशन मागा' : 'Get Quote'}</span>
            </button>

            <button 
              id="mobile-nav-toggle"
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? (lang === 'mr' ? 'मेनू बंद करा' : 'Close navigation menu') : (lang === 'mr' ? 'मेनू उघडा' : 'Open navigation menu')}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
