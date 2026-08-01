import React from 'react';
import { Phone, MessageCircle, FileText } from 'lucide-react';
import { mainContact } from '../data/branchesData';

export default function MobileStickyActionBar({ lang, onOpenInquiry }) {
  const whatsappUrl = `https://wa.me/${mainContact.whatsapp}?text=${encodeURIComponent(
    lang === 'mr' 
      ? 'नमस्कार पद्मश्री ॲग्रो, मला आपल्या शेती अवजारांबद्दल व दराबद्दल माहिती हवी आहे.' 
      : 'Hello Padmashri Agro, I would like to inquire about your agricultural implements and prices.'
  )}`;

  return (
    <div className="mobile-sticky-action-bar" id="mobile-sticky-bar">
      <a 
        id="mobile-sticky-call"
        href={`tel:${mainContact.mainPhone}`} 
        className="mobile-action-btn"
        style={{ background: 'var(--slate-800)', color: 'white', border: '1px solid var(--slate-700)' }}
      >
        <Phone size={18} style={{ color: 'var(--secondary)' }} />
        <span>{lang === 'mr' ? 'कॉल करा' : 'Call'}</span>
      </a>

      <a 
        id="mobile-sticky-wa"
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="mobile-action-btn"
        style={{ background: '#25D366', color: 'white' }}
      >
        <MessageCircle size={18} />
        <span>{lang === 'mr' ? 'व्हॉट्सॲप' : 'WhatsApp'}</span>
      </a>

      <button 
        id="mobile-sticky-quote"
        onClick={onOpenInquiry}
        className="mobile-action-btn"
        style={{ background: 'var(--primary)', color: 'white' }}
      >
        <FileText size={18} />
        <span>{lang === 'mr' ? 'कोटेशन' : 'Get Quote'}</span>
      </button>
    </div>
  );
}
