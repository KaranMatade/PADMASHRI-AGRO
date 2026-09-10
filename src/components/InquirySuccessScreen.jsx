import React from 'react';
import { CheckCircle, Clock, Phone, MapPin, MessageCircle } from 'lucide-react';

/**
 * InquirySuccessScreen Component
 * Shows confirmation after a successful inquiry submission with DB reference number
 * Author: Anushka Shete
 */
export default function InquirySuccessScreen({ lang, referenceNo, onClose }) {
  const steps = lang === 'mr'
    ? [
        { icon: <CheckCircle size={16} />, text: 'तुमची माहिती डेटाबेसमध्ये जतन झाली आहे' },
        { icon: <MessageCircle size={16} />, text: 'व्हॉट्सॲप विनंती पाठवली गेली आहे' },
        { icon: <Phone size={16} />, text: '२४ तासांत आमचे प्रतिनिधी संपर्क करतील' },
        { icon: <MapPin size={16} />, text: 'जवळच्या शाखेतून डिमॉन्स्ट्रेशन मिळवा' },
      ]
    : [
        { icon: <CheckCircle size={16} />, text: 'Your details saved to our lead database' },
        { icon: <MessageCircle size={16} />, text: 'WhatsApp inquiry sent to factory team' },
        { icon: <Phone size={16} />, text: 'Sales rep will call within 24 hours' },
        { icon: <MapPin size={16} />, text: 'Get a free demo at your nearest branch' },
      ];

  return (
    <div className="inquiry-success-screen">
      <div className="inquiry-success-icon-wrap">
        <CheckCircle size={52} className="inquiry-success-icon" />
      </div>

      <h3 className="inquiry-success-title">
        {lang === 'mr' ? 'कोटेशन विनंती यशस्वी! 🎉' : 'Inquiry Submitted! 🎉'}
      </h3>

      {referenceNo && (
        <div className="inquiry-ref-badge" aria-label={`Reference number ${referenceNo}`}>
          <Clock size={14} />
          <span>
            {lang === 'mr' ? 'संदर्भ क्रमांक:' : 'Ref No:'}&nbsp;
            <strong>{referenceNo}</strong>
          </span>
        </div>
      )}

      <ul className="inquiry-success-steps">
        {steps.map((step, i) => (
          <li key={i} className="inquiry-success-step">
            <span className="step-icon">{step.icon}</span>
            <span>{step.text}</span>
          </li>
        ))}
      </ul>

      <button onClick={onClose} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
        {lang === 'mr' ? 'बंद करा' : 'Close Window'}
      </button>
    </div>
  );
}
