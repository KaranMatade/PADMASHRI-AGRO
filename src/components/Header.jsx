import React, { useState } from 'react';
import { Phone, Mail, MapPin, Globe, Menu, X, ShieldCheck, Sun, Moon, MessageSquare, ArrowRight } from 'lucide-react';
import { mainContact } from '../data/branchesData';

export default function Header({ lang, setLang, theme, setTheme, onOpenInquiry }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'mr' : 'en'));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="header-wrapper">
      {/* Top Contact Bar (Desktop Only) */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-bar-left">
            <div className="top-info-item">
              <MapPin size={14} className="text-secondary" />
              <span>{lang === 'mr' ? 'कारखाना: सादतपूर, संगमनेर' : 'Main Works: Sadatpur, Sangamner'}</span>
            </div>
            <div className="top-info-item">
              <Phone size={14} className="text-secondary" />
              <a href={`tel:${mainContact.mainPhone}`} style={{ color: 'inherit' }}>{mainContact.mainPhone}</a>
            </div>
            <div className="top-info-item">
              <Mail size={14} className="text-secondary" />
              <a href={`mailto:${mainContact.email}`} style={{ color: 'inherit' }}>{mainContact.email}</a>
            </div>
          </div>

          <div className="top-bar-right">
            <a 
              href={mainContact.indiaMartUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="badge badge-verified"
              title="IndiaMART Verified Member"
            >
              <ShieldCheck size={14} />
              <span>IndiaMART Verified</span>
            </a>

            <button 
              id="lang-toggle-btn" 
              onClick={toggleLang} 
              className="lang-toggle-btn"
              title="Switch Language / भाषा बदला"
            >
              <Globe size={14} />
              <span>{lang === 'en' ? 'मराठी मध्ये पहा' : 'English'}</span>
            </button>

            <button 
              id="theme-toggle-btn" 
              onClick={toggleTheme} 
              className="lang-toggle-btn"
              title="Toggle Dark/Light Mode"
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="container navbar-inner">
          <a href="#home" className="brand-logo">
            <div className="brand-icon-box">P</div>
            <div className="brand-text">
              <h1>{lang === 'mr' ? mainContact.companyNameMr : 'PADMASHRI AGRO'}</h1>
              <span>{lang === 'mr' ? 'इंजिनिअरिंग वर्क्स • सन् १९९८' : 'ENGINEERING WORKS • EST. 1998'}</span>
            </div>
          </a>

          {/* Desktop & Mobile Nav Links Drawer */}
          <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <li>
              <a 
                href="#home" 
                className="nav-link-item active" 
                onClick={() => setMobileMenuOpen(false)}
              >
                {lang === 'mr' ? 'मुख्य पृष्ठ' : 'Home'}
              </a>
            </li>
            <li>
              <a 
                href="#products" 
                className="nav-link-item" 
                onClick={() => setMobileMenuOpen(false)}
              >
                {lang === 'mr' ? 'शेती अवजारे' : 'Products & Catalog'}
              </a>
            </li>
            <li>
              <a 
                href="#calculator" 
                className="nav-link-item" 
                onClick={() => setMobileMenuOpen(false)}
              >
                {lang === 'mr' ? 'दर अंदाजपत्रक' : 'Price Estimator'}
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
            >
              <MessageSquare size={16} />
              <span>{lang === 'mr' ? 'कोटेशन मागा' : 'Get Quote'}</span>
            </button>

            <button 
              id="mobile-nav-toggle"
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
