import React, { useState } from 'react';
import { Calculator, CheckCircle, MessageCircle, MapPin, Sparkles, Send } from 'lucide-react';
import { productsData } from '../data/productsData';
import { branchesData, mainContact } from '../data/branchesData';

export default function PriceCalculator({ lang }) {
  const [selectedProductId, setSelectedProductId] = useState(productsData[0].id);
  const [selectedSize, setSelectedSize] = useState(productsData[0].sizes[0]);
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [includeTransport, setIncludeTransport] = useState(false);
  const [farmerName, setFarmerName] = useState('');
  const [farmerVillage, setFarmerVillage] = useState('');

  const currentProduct = productsData.find(p => p.id === selectedProductId) || productsData[0];

  const handleProductChange = (e) => {
    const prodId = e.target.value;
    setSelectedProductId(prodId);
    const p = productsData.find(prod => prod.id === prodId);
    if (p && p.sizes.length > 0) {
      setSelectedSize(p.sizes[0]);
    }
  };

  // Estimate price offset based on size index
  const sizeIndex = currentProduct.sizes.indexOf(selectedSize);
  const sizeStep = currentProduct.sizes.length > 1 
    ? (currentProduct.priceMax - currentProduct.priceMin) / (currentProduct.sizes.length - 1) 
    : 0;

  const basePriceEst = Math.round(currentProduct.priceMin + (sizeStep * (sizeIndex >= 0 ? sizeIndex : 0)));
  const transportEst = includeTransport ? 2500 : 0;
  const totalPriceEst = basePriceEst + transportEst;

  const sendWhatsAppQuote = () => {
    const branchInfo = selectedBranch === 'main' 
      ? mainContact.headOffice.title 
      : branchesData.find(b => b.id === selectedBranch)?.name;

    const message = lang === 'mr'
      ? `*कोटेशन अंदाजपत्रक चौकशी - पद्मश्री ॲग्रो*\n\n` +
        `• शेतकर्‍याचे नाव: ${farmerName || 'शेतकरी मित्र'}\n` +
        `• गाव/पत्ता: ${farmerVillage || 'महाराष्ट्र'}\n` +
        `• निवडलेले अवजार: ${currentProduct.nameMr} (${currentProduct.name})\n` +
        `• साईज (Size): ${selectedSize}\n` +
        `• निवडलेली शाखा: ${branchInfo}\n` +
        `• वाहतूक जोडणी: ${includeTransport ? 'होय (थेट शेतात पोच)' : 'नाही (शाखेतून स्वखर्चाने)'}\n` +
        `• अंदाजित दर: *₹${totalPriceEst.toLocaleString()}/-*\n\n` +
        `कृपया मला नक्की डिस्काउंट व पेमेंट सवलत सांगा.`
      : `*Price Estimation Inquiry - Padmashri Agro*\n\n` +
        `• Farmer Name: ${farmerName || 'Farmer Customer'}\n` +
        `• Location/Village: ${farmerVillage || 'Maharashtra'}\n` +
        `• Selected Implement: ${currentProduct.name}\n` +
        `• Size Variant: ${selectedSize}\n` +
        `• Nearest Branch: ${branchInfo}\n` +
        `• Transport Required: ${includeTransport ? 'Yes (Farm delivery)' : 'No (Pickup from branch)'}\n` +
        `• Estimated Quote: *₹${totalPriceEst.toLocaleString()}/-*\n\n` +
        `Please provide final best price and payment scheme.`;

    window.open(`https://wa.me/${mainContact.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="calculator" className="calculator-section">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <span className="section-subtitle" style={{ color: 'var(--secondary-light)' }}>
            <Calculator size={16} style={{ display: 'inline', marginRight: '6px' }} />
            {lang === 'mr' ? 'थेट दर अंदाजपत्रक' : 'Instant Quotation Tool'}
          </span>
          <h2 className="section-title" style={{ color: 'white' }}>
            {lang === 'mr' ? (
              <>दर <span>अंदाजपत्रक कॅल्क्युलेटर</span></>
            ) : (
              <>Equipment <span>Price Estimator</span></>
            )}
          </h2>
          <p className="section-desc" style={{ color: 'var(--slate-400)' }}>
            {lang === 'mr'
              ? 'तुमच्या शेताच्या गरजेनुसार अवजार, साईज व जवळची शाखा निवडून त्वरित अंदाजपत्रक मिळवा आणि व्हॉट्सॲपवर पाठवा.'
              : 'Select your preferred implement, size variant, and nearest branch to calculate an estimated price range.'}
          </p>
        </div>

        <div className="calculator-card">
          {/* Left Controls */}
          <div>
            <h3 style={{ fontSize: '1.4rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} style={{ color: 'var(--secondary)' }} />
              <span>{lang === 'mr' ? 'अवजार व साईझ निवडा' : 'Select Specifications'}</span>
            </h3>

            <div className="calc-form-group">
              <label className="calc-label">{lang === 'mr' ? '१. अवजार प्रकार (Product Category):' : '1. Select Product:'}</label>
              <select className="calc-select" value={selectedProductId} onChange={handleProductChange} id="calc-product-select">
                {productsData.map(p => (
                  <option key={p.id} value={p.id}>
                    {lang === 'mr' ? p.nameMr : p.name} (₹{p.priceMin.toLocaleString()} - ₹{p.priceMax.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="calc-form-group">
              <label className="calc-label">{lang === 'mr' ? '२. साईझ पर्याय (Size Option):' : '2. Select Size / Variant:'}</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {currentProduct.sizes.map((sz, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    style={{
                      padding: '0.65rem 1.2rem',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      background: selectedSize === sz ? 'var(--secondary)' : 'var(--slate-900)',
                      color: selectedSize === sz ? 'white' : 'var(--slate-300)',
                      border: selectedSize === sz ? '2px solid var(--secondary-light)' : '1px solid var(--slate-700)',
                      transition: 'var(--transition)'
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="calc-form-group">
              <label className="calc-label">{lang === 'mr' ? '३. जवळची पद्मश्री शाखा (Branch):' : '3. Nearest Delivery Branch:'}</label>
              <select className="calc-select" value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} id="calc-branch-select">
                <option value="main">{lang === 'mr' ? mainContact.headOffice.titleMr : mainContact.headOffice.title}</option>
                {branchesData.map(b => (
                  <option key={b.id} value={b.id}>{lang === 'mr' ? b.nameMr : b.name}</option>
                ))}
              </select>
            </div>

            <div className="calc-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: 'var(--slate-200)' }}>
                <input 
                  type="checkbox" 
                  checked={includeTransport} 
                  onChange={e => setIncludeTransport(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--secondary)' }}
                />
                <span>{lang === 'mr' ? 'थेट शेतात ट्रान्सपोर्ट पोच समाविष्ट करा (+ ₹२,५००)' : 'Include Farm Delivery Transport (+ ₹2,500)'}</span>
              </label>
            </div>

            <div className="calc-farmer-grid">
              <div>
                <label className="calc-label">{lang === 'mr' ? 'तुमचे नाव:' : 'Your Name:'}</label>
                <input 
                  type="text" 
                  className="calc-input" 
                  placeholder={lang === 'mr' ? 'उदा. रामराव पाटील' : 'e.g. Ramesh Patil'} 
                  value={farmerName}
                  onChange={e => setFarmerName(e.target.value)}
                />
              </div>
              <div>
                <label className="calc-label">{lang === 'mr' ? 'गाव / तालुका:' : 'Village / Location:'}</label>
                <input 
                  type="text" 
                  className="calc-input" 
                  placeholder={lang === 'mr' ? 'उदा. सादतपूर, संगमनेर' : 'e.g. Sangamner'} 
                  value={farmerVillage}
                  onChange={e => setFarmerVillage(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right Result Display */}
          <div className="calc-result-box">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="badge badge-amber">{lang === 'mr' ? 'अंदाजित दरपत्रक' : 'Estimated Quotation'}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--slate-400)' }}>GST + Warrenty Included</span>
              </div>

              <h4 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '0.2rem' }}>
                {lang === 'mr' ? currentProduct.nameMr : currentProduct.name}
              </h4>
              <p style={{ color: 'var(--secondary-light)', fontWeight: '700', fontSize: '1rem' }}>
                Variant: {selectedSize}
              </p>

              <div className="result-price-display">
                ₹{totalPriceEst.toLocaleString()}/-
              </div>

              <ul style={{ listStyle: 'none', marginBottom: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-300)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  <span>{lang === 'mr' ? 'मूळ अवजार किंमत (अंदाजे):' : 'Base Implement Price:'}</span>
                  <span style={{ fontWeight: '700', color: 'white' }}>₹{basePriceEst.toLocaleString()}/-</span>
                </li>
                {includeTransport && (
                  <li style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-300)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                    <span>{lang === 'mr' ? 'ट्रान्सपोर्ट भाडे:' : 'Estimated Transport:'}</span>
                    <span style={{ fontWeight: '700', color: 'white' }}>+ ₹2,500/-</span>
                  </li>
                )}
                <li style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-300)', fontSize: '0.9rem' }}>
                  <span>{lang === 'mr' ? 'कारखाना वॉरंटी:' : 'Factory Warranty:'}</span>
                  <span style={{ fontWeight: '700', color: 'var(--primary-light)' }}>1 Year Guarantee</span>
                </li>
              </ul>
            </div>

            <button 
              id="calc-send-whatsapp-btn"
              onClick={sendWhatsAppQuote}
              className="btn-amber"
              style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.05rem' }}
            >
              <Send size={20} />
              <span>{lang === 'mr' ? 'हे कोटेशन व्हॉट्सॲपवर पाठवा' : 'Send Quote to WhatsApp'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
