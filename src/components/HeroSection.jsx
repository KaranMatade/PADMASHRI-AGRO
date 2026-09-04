import React from 'react';
import ResponsiveImage from './ResponsiveImage';
import { ArrowRight, Shield, PhoneCall, MessageCircle } from 'lucide-react';
import { mainContact } from '../data/branchesData';
import { imageUrl } from '../lib/imageUrl';

export default function HeroSection({ lang, onOpenInquiry }) {
  const whatsappUrl = `https://wa.me/${mainContact.whatsapp}?text=${encodeURIComponent(
    lang === 'mr' 
      ? 'नमस्कार पद्मश्री ॲग्रो, मला आपल्या शेती अवजारांबद्दल व दराबद्दल माहिती हवी आहे.' 
      : 'Hello Padmashri Agro, I would like to inquire about your agricultural implements and prices.'
  )}`;

  return (
    <section
      id="skip-content"
      className="hero-section"
      style={{ '--hero-background-image': `url("${imageUrl('/Frontpage_background.png')}")` }}
    >
      <div className="container hero-grid hero-single-col">
        <div className="hero-content">
          <div className="hero-tag">
            <Shield size={16} />
            <span>
              {lang === 'mr' 
                ? '२५+ वर्षांची विश्वासार्हता • महाराष्ट्रातील अग्रेसर ब्रँड' 
                : 'Pioneer Manufacturer in Maharashtra Since 1998'}
            </span>
          </div>

          <h1 className="hero-title" key={`hero-title-${lang}`}>
            {lang === 'mr' ? (
              <span>
                दमदार आणि टिकाऊ <span className="highlight">शेती अवजारे</span>, उत्तम पिकाची खात्री!
              </span>
            ) : (
              <span>
                Heavy Duty &amp; Precision <span className="highlight">Agricultural Implements</span> for Modern Farming
              </span>
            )}
          </h1>

          <p className="hero-subtitle">
            {lang === 'mr' 
              ? 'हायड्रोलिक नांगर, मेकॅनिकल प्लॉ, कल्टिव्हेटर, ऑटोमॅटिक सीड ड्रिल, रेझर, लेव्हलर व ट्रॉली उत्कृष्ट लोखंडी बनावटीसह प्रत्यक्ष उत्पादक दरात!' 
              : 'Direct from manufacturer: Hydraulic & Mechanical Reversible Ploughs, Cultivators, Seed Drills, Razers, Levelers & Heavy Duty Trailers with factory warranty.'}
          </p>

          <div className="hero-actions">
            <a href="#products" className="btn-primary" id="hero-browse-btn" aria-label={lang === 'mr' ? 'कॅटलॉग मधील अवजारे पहा' : 'Explore products catalog'}>
              <span>{lang === 'mr' ? 'अवजारे पहा (Catalog)' : 'Explore Products'}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>

            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-amber"
              id="hero-whatsapp-btn"
              aria-label={lang === 'mr' ? 'व्हॉट्सॲप द्वारे ऑर्डर करा' : 'Place order via WhatsApp'}
            >
              <MessageCircle size={18} aria-hidden="true" />
              <span>{lang === 'mr' ? 'व्हॉट्सॲप ऑर्डर' : 'WhatsApp Order'}</span>
            </a>

            <button 
              onClick={() => onOpenInquiry()} 
              className="btn-outline"
              id="hero-quote-btn"
              aria-label={lang === 'mr' ? 'कॉल बॅक ची विनंती करा' : 'Request a callback'}
            >
              <PhoneCall size={18} aria-hidden="true" />
              <span>{lang === 'mr' ? 'कॉल बॅक मागा' : 'Request Callback'}</span>
            </button>
          </div>



          <div className="hero-stats">
            <div className="stat-item">
              <h3>8+</h3>
              <p>{lang === 'mr' ? 'मुख्य अवजारे' : 'Equipment Lines'}</p>
            </div>
            <div className="stat-item">
              <h3>4</h3>
              <p>{lang === 'mr' ? 'मुख्य शाखा' : 'Branch Outlets'}</p>
            </div>
            <div className="stat-item">
              <h3>15,000+</h3>
              <p>{lang === 'mr' ? 'आनंदी शेतकरी' : 'Satisfied Farmers'}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

