import React from 'react';
import { ArrowRight, Shield, PhoneCall, MessageCircle } from 'lucide-react';
import { mainContact } from '../data/branchesData';

export default function HeroSection({ lang, onOpenInquiry }) {
  const whatsappUrl = `https://wa.me/${mainContact.whatsapp}?text=${encodeURIComponent(
    lang === 'mr' 
      ? 'नमस्कार पद्मश्री ॲग्रो, मला आपल्या शेती अवजारांबद्दल व दराबद्दल माहिती हवी आहे.' 
      : 'Hello Padmashri Agro, I would like to inquire about your agricultural implements and prices.'
  )}`;

  return (
    <section id="home" className="hero-section">
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="hero-tag">
            <Shield size={16} />
            <span>
              {lang === 'mr' 
                ? '२५+ वर्षांची विश्वासार्हता • महाराष्ट्रातील अग्रेसर ब्रँड' 
                : 'Pioneer Manufacturer in Maharashtra Since 1998'}
            </span>
          </div>

          <h1 className="hero-title">
            {lang === 'mr' ? (
              <>
                दमदार आणि टिकाऊ <span className="highlight">शेती अवजारे</span>, उत्तम पिकाची खात्री!
              </>
            ) : (
              <>
                Heavy Duty &amp; Precision <span className="highlight">Agricultural Implements</span> for Modern Farming
              </>
            )}
          </h1>

          <p className="hero-subtitle">
            {lang === 'mr' 
              ? 'हायड्रोलिक नांगर, मेकॅनिकल प्लॉ, कल्टिव्हेटर, ऑटोमॅटिक सीड ड्रिल, रेझर, लेव्हलर व ट्रॉली उत्कृष्ट लोखंडी बनावटीसह प्रत्यक्ष उत्पादक दरात!' 
              : 'Direct from manufacturer: Hydraulic & Mechanical Reversible Ploughs, Cultivators, Seed Drills, Razers, Levelers & Heavy Duty Trailers with factory warranty.'}
          </p>

          <div className="hero-actions">
            <a href="#products" className="btn-primary" id="hero-browse-btn">
              <span>{lang === 'mr' ? 'अवजारे पहा (Catalog)' : 'Explore Products'}</span>
              <ArrowRight size={18} />
            </a>

            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="btn-amber"
              id="hero-whatsapp-btn"
            >
              <MessageCircle size={18} />
              <span>{lang === 'mr' ? 'व्हॉट्सॲप ऑर्डर' : 'WhatsApp Order'}</span>
            </a>

            <button 
              onClick={() => onOpenInquiry()} 
              className="btn-outline"
              id="hero-quote-btn"
            >
              <PhoneCall size={18} />
              <span>{lang === 'mr' ? 'कॉल बॅक मागा' : 'Request Callback'}</span>
            </button>
          </div>



          <div className="hero-stats">
            <div className="stat-item">
              <h3>9+</h3>
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

        {/* Hero Right Visual — clean product image card, no IndiaMART overlay */}
        <div className="hero-visual">
          <div className="hero-card-box">
            <div className="hero-image-wrapper">
              <img 
                src="/Product_images/reversible_plough_2.jpeg" 
                alt="Padmashri 2 Bottom Hydraulic Reversible Plough" 
              />
            </div>
            <div className="hero-badge-overlay">
              <div>
                <h4>{lang === 'mr' ? '२ बॉटम हायड्रोलिक रिव्हर्सिबल नांगर' : '2 Bottom Hydraulic Reversible Plough'}</h4>
                <p>{lang === 'mr' ? '१२", १४", १६" इंच | रु. ८२,००० ते ९५,०००/-' : '12, 14, 16 inch | ₹82,000 to ₹95,000'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
