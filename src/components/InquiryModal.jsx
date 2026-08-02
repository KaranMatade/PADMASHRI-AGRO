import React, { useState } from 'react';
import { X, Send, PhoneCall, CheckCircle, ShieldCheck } from 'lucide-react';
import { mainContact, branchesData } from '../data/branchesData';
import { productsData } from '../data/productsData';

export default function InquiryModal({ lang, preselectedProduct, onClose }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [selectedProd, setSelectedProd] = useState(preselectedProduct ? preselectedProduct.id : productsData[0].id);
  const [branch, setBranch] = useState('main');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const prod = productsData.find(p => p.id === selectedProd);
    
    const waText = lang === 'mr'
      ? `*कोटेशन विनंती - पद्मश्री ॲग्रो*\n\n` +
        `• नाव: ${name}\n` +
        `• संपर्क क्रमांक: ${phone}\n` +
        `• गाव/पत्ता: ${village}\n` +
        `• इच्छित अवजार: ${prod?.nameMr || prod?.name}\n` +
        `• पसंतीची शाखा: ${branch}\n` +
        `• संदेश: ${message || 'दर व माहिती हवी आहे.'}`
      : `*Quotation Request - Padmashri Agro*\n\n` +
        `• Name: ${name}\n` +
        `• Mobile: ${phone}\n` +
        `• Village/City: ${village}\n` +
        `• Required Equipment: ${prod?.name}\n` +
        `• Preferred Branch: ${branch}\n` +
        `• Message: ${message || 'Please send formal quotation.'}`;

    window.open(`https://wa.me/${mainContact.whatsapp}?text=${encodeURIComponent(waText)}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {!submitted ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>
                {lang === 'mr' ? 'थेट कारखाना कोटेशन' : 'Factory Direct Quote'}
              </span>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>
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
                  className="calc-input" 
                  style={{ background: 'var(--bg-main)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                  placeholder={lang === 'mr' ? 'उदा. ज्ञानेश्वर शेळके' : 'e.g. Dnyaneshwar Shelke'}
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="form-two-col">
                <div className="calc-form-group">
                  <label className="calc-label" style={{ color: 'var(--text-main)' }}>
                    {lang === 'mr' ? '२. मोबाईल नंबर:' : '2. Mobile Number:'}
                  </label>
                  <input 
                    type="tel" 
                    className="calc-input"
                    style={{ background: 'var(--bg-main)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                    placeholder="98xxxxxxxx"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>

                <div className="calc-form-group">
                  <label className="calc-label" style={{ color: 'var(--text-main)' }}>
                    {lang === 'mr' ? '३. गाव / तालुका:' : '3. Village / Taluka:'}
                  </label>
                  <input 
                    type="text" 
                    className="calc-input"
                    style={{ background: 'var(--bg-main)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                    placeholder={lang === 'mr' ? 'उदा. संगमनेर' : 'e.g. Sangamner'}
                    required
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                  />
                </div>
              </div>

              <div className="calc-form-group">
                <label className="calc-label" style={{ color: 'var(--text-main)' }}>
                  {lang === 'mr' ? '४. निवडलेले अवजार:' : '4. Select Equipment:'}
                </label>
                <select 
                  className="calc-select"
                  style={{ background: 'var(--bg-main)', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                  value={selectedProd}
                  onChange={e => setSelectedProd(e.target.value)}
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
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
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
                style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}
              >
                <Send size={18} />
                <span>{lang === 'mr' ? 'कोटेशन पाठवा (WhatsApp)' : 'Send Quote Request'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle size={54} style={{ color: 'var(--primary)', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              {lang === 'mr' ? 'कोटेशन विनंती पाठवली आहे!' : 'Inquiry Submitted Successfully!'}
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {lang === 'mr' 
                ? 'आमचे प्रतिनिधी लवकरच आपल्याशी फोन किंवा व्हॉट्सॲपवर संपर्क साधतील.' 
                : 'Our sales representative will reach out to you shortly with full details.'}
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
