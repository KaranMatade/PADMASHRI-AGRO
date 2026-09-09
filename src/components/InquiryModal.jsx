import React, { useState, useEffect } from 'react';
import { X, Send, PhoneCall, CheckCircle, ShieldCheck } from 'lucide-react';
import { mainContact, branchesData } from '../data/branchesData';
import { productsData } from '../data/productsData';
import { validateInquiryForm } from '../utils/validation';
import useFocusTrap from '../hooks/useFocusTrap';

export default function InquiryModal({ lang, preselectedProduct, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    village: '',
    product: preselectedProduct ? preselectedProduct.id : productsData[0].id,
    branch: 'main',
    message: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Focus trap for keyboard accessibility
  const modalRef = useFocusTrap(true);

  // Lock body scroll and handle Escape key to close modal
  useEffect(() => {
    document.body.classList.add('modal-open');
    const handleEscapeEvent = () => {
      onClose();
    };

    if (modalRef.current) {
      modalRef.current.addEventListener('escapeKeyPressed', handleEscapeEvent);
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('modal-open');
      if (modalRef.current) {
        modalRef.current.removeEventListener('escapeKeyPressed', handleEscapeEvent);
      }
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, modalRef]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Mark field as touched
    if (!touched[field]) {
      setTouched(prev => ({ ...prev, [field]: true }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate form to show errors
    const errors = validateInquiryForm(formData, lang);
    setValidationErrors(errors);
  };
  const [apiLoading, setApiLoading] = useState(false);
  const [referenceNo, setReferenceNo] = useState('');
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ name: true, phone: true, village: true });
    
    // Validate all fields
    const errors = validateInquiryForm(formData, lang);
    setValidationErrors(errors);
    
    // Only proceed if no errors
    if (Object.keys(errors).length > 0) {
      return;
    }

    setApiLoading(true);
    setApiError('');

    try {
      // 🔌 POST inquiry to real backend API & SQLite database
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          village: formData.village.trim(),
          product: formData.product,
          branch: formData.branch,
          message: formData.message.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error');
      }

      // ✅ Inquiry saved to database — show reference number
      setReferenceNo(data.inquiry?.reference_no || 'PAD-CONFIRMED');

      // Also open WhatsApp so customer gets immediate response
      const prod = productsData.find(p => p.id === formData.product);
      const waText = lang === 'mr'
        ? `*कोटेशन विनंती - पद्मश्री ॲग्रो*\nRef: ${data.inquiry?.reference_no}\n• नाव: ${formData.name}\n• संपर्क: ${formData.phone}\n• गाव: ${formData.village}\n• अवजार: ${prod?.nameMr || prod?.name}`
        : `*Quote Request - Padmashri Agro*\nRef: ${data.inquiry?.reference_no}\n• Name: ${formData.name}\n• Mobile: ${formData.phone}\n• Village: ${formData.village}\n• Equipment: ${prod?.name}`;
      window.open(`https://wa.me/${mainContact.whatsapp}?text=${encodeURIComponent(waText)}`, '_blank');

      setSubmitted(true);
    } catch (err) {
      // Fallback: if backend is unavailable, still open WhatsApp directly
      console.warn('API not available, using WhatsApp fallback:', err.message);
      const prod = productsData.find(p => p.id === formData.product);
      const waText = lang === 'mr'
        ? `*कोटेशन विनंती - पद्मश्री ॲग्रो*\n• नाव: ${formData.name}\n• संपर्क: ${formData.phone}\n• गाव: ${formData.village}\n• अवजार: ${prod?.nameMr || prod?.name}`
        : `*Quote Request - Padmashri Agro*\n• Name: ${formData.name}\n• Mobile: ${formData.phone}\n• Village: ${formData.village}\n• Equipment: ${prod?.name}`;
      window.open(`https://wa.me/${mainContact.whatsapp}?text=${encodeURIComponent(waText)}`, '_blank');
      setSubmitted(true);
    } finally {
      setApiLoading(false);
    }
  };


  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-modal-title"
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '600px' }}
      >
        <button 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label={lang === 'mr' ? 'मोडल बंद करा' : 'Close modal'}
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>
                {lang === 'mr' ? 'थेट कारखाना कोटेशन' : 'Factory Direct Quote'}
              </span>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }} id="inquiry-modal-title">
                {lang === 'mr' ? 'शेती अवजार कोटेशन विनंती' : 'Request Equipment Quotation'}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {lang === 'mr' ? 'तुमची माहिती भरा व थेट व्हॉट्सॲप / फोन कॉल वर डिस्काउंट मिळवा.' : 'Fill your contact details to receive full specifications & discount callback.'}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="calc-form-group">
                <label className="calc-label" style={{ color: 'var(--text-main)' }}>
                  {lang === 'mr' ? '१. तुमचे पूर्ण नाव:' : '1. Full Name:'}
                </label>
                <input 
                  type="text" 
                  className={`calc-input ${touched.name && validationErrors.name ? 'input-error' : ''}`}
                  style={{ background: 'var(--bg-main)', color: 'var(--text-main)', borderColor: touched.name && validationErrors.name ? '#dc2626' : 'var(--border-color)' }}
                  placeholder={lang === 'mr' ? 'उदा. ज्ञानेश्वर शेळके' : 'e.g. Dnyaneshwar Shelke'}
                  required
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  aria-invalid={touched.name && validationErrors.name ? 'true' : 'false'}
                  aria-describedby={touched.name && validationErrors.name ? 'name-error' : undefined}
                />
                {touched.name && validationErrors.name && (
                  <div id="name-error" className="input-error-message" role="alert" style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {validationErrors.name}
                  </div>
                )}
              </div>

              <div className="form-two-col">
                <div className="calc-form-group">
                  <label className="calc-label" style={{ color: 'var(--text-main)' }}>
                    {lang === 'mr' ? '२. मोबाईल नंबर:' : '2. Mobile Number:'}
                  </label>
                  <input 
                    type="tel" 
                    className={`calc-input ${touched.phone && validationErrors.phone ? 'input-error' : ''}`}
                    style={{ background: 'var(--bg-main)', color: 'var(--text-main)', borderColor: touched.phone && validationErrors.phone ? '#dc2626' : 'var(--border-color)' }}
                    placeholder="98xxxxxxxx"
                    required
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    aria-invalid={touched.phone && validationErrors.phone ? 'true' : 'false'}
                    aria-describedby={touched.phone && validationErrors.phone ? 'phone-error' : undefined}
                  />
                  {touched.phone && validationErrors.phone && (
                    <div id="phone-error" className="input-error-message" role="alert" style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {validationErrors.phone}
                    </div>
                  )}
                </div>

                <div className="calc-form-group">
                  <label className="calc-label" style={{ color: 'var(--text-main)' }}>
                    {lang === 'mr' ? '३. गाव / तालुका:' : '3. Village / Taluka:'}
                  </label>
                  <input 
                    type="text" 
                    className={`calc-input ${touched.village && validationErrors.village ? 'input-error' : ''}`}
                    style={{ background: 'var(--bg-main)', color: 'var(--text-main)', borderColor: touched.village && validationErrors.village ? '#dc2626' : 'var(--border-color)' }}
                    placeholder={lang === 'mr' ? 'उदा. संगमनेर' : 'e.g. Sangamner'}
                    required
                    value={formData.village}
                    onChange={e => handleInputChange('village', e.target.value)}
                    onBlur={() => handleBlur('village')}
                    aria-invalid={touched.village && validationErrors.village ? 'true' : 'false'}
                    aria-describedby={touched.village && validationErrors.village ? 'village-error' : undefined}
                  />
                  {touched.village && validationErrors.village && (
                    <div id="village-error" className="input-error-message" role="alert" style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {validationErrors.village}
                    </div>
                  )}
                </div>
              </div>

              <div className="calc-form-group">
                <label className="calc-label" style={{ color: 'var(--text-main)' }}>
                  {lang === 'mr' ? '४. निवडलेले अवजार:' : '4. Select Equipment:'}
                </label>
                <select 
                  className="calc-select"
                  style={{ background: 'var(--bg-main)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                  value={formData.product}
                  onChange={e => handleInputChange('product', e.target.value)}
                >
                  {productsData.map(p => (
                    <option key={p.id} value={p.id}>
                      {lang === 'mr' ? p.nameMr : p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="calc-form-group">
                <label className="calc-label" style={{ color: 'var(--text-main)' }}>
                  {lang === 'mr' ? '५. जवळची शाखा:' : '5. Nearest Branch:'}
                </label>
                <select 
                  className="calc-select"
                  style={{ background: 'var(--bg-main)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                  value={formData.branch}
                  onChange={e => handleInputChange('branch', e.target.value)}
                >
                  <option value="main">Main Factory (Sadatpur, Sangamner)</option>
                  {branchesData.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                className="btn-amber" 
                disabled={apiLoading}
                style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem', opacity: apiLoading ? 0.75 : 1 }}
              >
                {apiLoading ? (
                  <>
                    <span className="inquiry-spinner" aria-hidden="true"></span>
                    <span>{lang === 'mr' ? 'पाठवत आहे...' : 'Submitting...'}</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>{lang === 'mr' ? 'कोटेशन पाठवा (WhatsApp)' : 'Send Quote Request'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle size={54} style={{ color: 'var(--primary)', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              {lang === 'mr' ? 'कोटेशन विनंती पाठवली आहे!' : 'Inquiry Submitted Successfully!'}
            </h3>
            {referenceNo && (
              <div className="inquiry-ref-badge">
                <ShieldCheck size={16} style={{ color: 'var(--primary)' }} />
                <span>{lang === 'mr' ? 'संदर्भ क्रमांक:' : 'Reference No:'} <strong>{referenceNo}</strong></span>
              </div>
            )}
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', marginTop: '0.75rem' }}>
              {lang === 'mr' 
                ? 'तुमची विनंती डेटाबेसमध्ये नोंदवली गेली आहे. आमचे प्रतिनिधी लवकरच व्हॉट्सॲप / फोनवर संपर्क साधतील.'
                : 'Your inquiry has been saved to our database. Our representative will contact you via WhatsApp or phone shortly.'}
            </p>
            <button onClick={onClose} className="btn-primary">
              {lang === 'mr' ? 'बंद करा' : 'Close Window'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
