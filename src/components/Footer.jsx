import React from 'react';
import { MapPin, Phone, Mail, ShieldCheck, ExternalLink, Heart } from 'lucide-react';
import { mainContact, branchesData } from '../data/branchesData';

export default function Footer({ lang }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <h3>{lang === 'mr' ? mainContact.companyNameMr : mainContact.companyName}</h3>
            <p style={{ color: 'var(--slate-400)', fontSize: '0.92rem', marginBottom: '1.2rem', lineHeight: '1.6' }}>
              {lang === 'mr'
                ? 'सन १९९८ पासून महाराष्ट्रातील शेतकऱ्यांच्या सेवेत. मजबूत लोखंडी बनावट, सुधारित तंत्रज्ञान व प्रत्यक्ष कारखान्यातून उत्पादक दरात शेती अवजारांची विक्री.'
                : 'Pioneer manufacturer of high durability Hydraulic & Mechanical Ploughs, Cultivators, Seed Drills, Razers, Levelers and Trailers. Built for tough Indian soil.'}
            </p>

            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
              <a 
                href={mainContact.indiaMartUrl} 
                target="_blank" 
                rel="noreferrer"
                className="badge badge-verified"
                style={{ padding: '0.5rem 1rem' }}
              >
                <ShieldCheck size={16} />
                <span>IndiaMART Verified Manufacturer</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-title">{lang === 'mr' ? 'नेव्हिगेशन' : 'Quick Navigation'}</h4>
            <ul className="footer-links">
              <li><a href="#home">{lang === 'mr' ? 'मुख्य पृष्ठ (Home)' : 'Home Overview'}</a></li>
              <li><a href="#products">{lang === 'mr' ? 'शेती अवजारे (Products)' : 'Equipment Catalog'}</a></li>
              <li><a href="#calculator">{lang === 'mr' ? 'दर अंदाजपत्रक (Estimator)' : 'Price Estimator'}</a></li>
              <li><a href="#gallery">{lang === 'mr' ? 'फोटो गॅलरी (Gallery)' : 'Photo Gallery (43)'}</a></li>
              <li><a href="#branches">{lang === 'mr' ? 'शाखा नेटवर्क (Branches)' : 'Branch Locations'}</a></li>
            </ul>
          </div>

          {/* Core Products */}
          <div>
            <h4 className="footer-title">{lang === 'mr' ? 'उत्पादने' : 'Core Products'}</h4>
            <ul className="footer-links">
              <li><a href="#products">2 Bottom Hydraulic Plough</a></li>
              <li><a href="#products">2 Bottom Mechanical Plough</a></li>
              <li><a href="#products">Tractor Cultivator (9 & 11 Tine)</a></li>
              <li><a href="#products">Automatic Seed Drill Machine</a></li>
              <li><a href="#products">Tractor Leveler & Razer</a></li>
              <li><a href="#products">2-Wheeler Heavy Trailer</a></li>
            </ul>
          </div>

          {/* Head Office Contact */}
          <div>
            <h4 className="footer-title">{lang === 'mr' ? 'कारखाना संपर्क' : 'Factory Address'}</h4>
            <div style={{ color: 'var(--slate-400)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <MapPin size={18} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '3px' }} />
                <span>Loni-Sadatpur Road, Sadatpur, Tal: Sangamner, Dist: Ahilyanagar, 413736</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Phone size={16} style={{ color: 'var(--secondary)' }} />
                <a href={`tel:${mainContact.mainPhone}`} style={{ color: 'white', fontWeight: '700' }}>
                  {mainContact.mainPhone}
                </a>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Mail size={16} style={{ color: 'var(--secondary)' }} />
                <a href={`mailto:${mainContact.email}`} style={{ color: 'var(--slate-300)' }}>
                  {mainContact.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Padmashri Agro Engineering Works. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Crafted for Indian Farmers with</span>
            <Heart size={14} style={{ color: '#ef4444', fill: '#ef4444' }} />
            <span>in Maharashtra</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
