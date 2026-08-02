import React, { useState } from 'react';
import { Calculator, MessageCircle, Sparkles, Send, Tag, ShieldCheck, Truck, User, MapPin, ChevronDown } from 'lucide-react';
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
    if (p && p.sizes.length > 0) setSelectedSize(p.sizes[0]);
  };

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
        `• वाहतूक जोडणी: ${includeTransport ? 'होय (थेट शेतात पोच)' : 'नाही'}\n` +
        `• अंदाजित दर: *₹${totalPriceEst.toLocaleString()}/-*\n\nकृपया मला नक्की डिस्काउंट व पेमेंट सवलत सांगा.`
      : `*Price Estimation Inquiry - Padmashri Agro*\n\n` +
        `• Farmer Name: ${farmerName || 'Farmer Customer'}\n` +
        `• Location/Village: ${farmerVillage || 'Maharashtra'}\n` +
        `• Selected Implement: ${currentProduct.name}\n` +
        `• Size Variant: ${selectedSize}\n` +
        `• Nearest Branch: ${branchInfo}\n` +
        `• Transport Required: ${includeTransport ? 'Yes (Farm delivery)' : 'No'}\n` +
        `• Estimated Quote: *₹${totalPriceEst.toLocaleString()}/-*\n\nPlease provide final best price and payment scheme.`;

    window.open(`https://wa.me/${mainContact.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="calculator" className="calculator-section">
      <div className="container">

        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <span className="section-subtitle calc-subtitle">
            <Calculator size={16} />
            {lang === 'mr' ? 'थेट दर अंदाजपत्रक' : 'Instant Quotation Tool'}
          </span>
          <h2 className="section-title calc-section-title">
            {lang === 'mr' ? (
              <>दर <span>अंदाजपत्रक कॅल्क्युलेटर</span></>
            ) : (
              <>Equipment <span>Price Estimator</span></>
            )}
          </h2>
          <p className="section-desc calc-section-desc">
            {lang === 'mr'
              ? 'तुमच्या शेताच्या गरजेनुसार अवजार, साईझ व जवळची शाखा निवडून त्वरित अंदाजपत्रक मिळवा.'
              : 'Select your implement, size variant, and nearest branch to instantly get an estimated factory price.'}
          </p>
        </div>

        {/* Main Calculator Card */}
        <div className="calculator-card">

          {/* ── LEFT: Form Controls ── */}
          <div className="calc-form-col">
            <div className="calc-form-inner">
              <div className="calc-form-heading">
                <Sparkles size={20} className="calc-heading-icon" />
                <span>{lang === 'mr' ? 'अवजार व साईझ निवडा' : 'Select Specifications'}</span>
              </div>

              {/* Step 1: Product */}
              <div className="calc-form-group">
                <label className="calc-label">
                  <span className="calc-step-num">1</span>
                  {lang === 'mr' ? 'अवजार प्रकार निवडा' : 'Select Product'}
                </label>
                <div className="calc-select-wrapper">
                  <select
                    id="calc-product-select"
                    className="calc-select"
                    value={selectedProductId}
                    onChange={handleProductChange}
                  >
                    {productsData.map(p => (
                      <option key={p.id} value={p.id}>
                        {lang === 'mr' ? p.nameMr : p.name} — ₹{p.priceMin.toLocaleString()} to ₹{p.priceMax.toLocaleString()}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="calc-select-arrow" />
                </div>
              </div>

              {/* Step 2: Size Variant Pills */}
              <div className="calc-form-group">
                <label className="calc-label">
                  <span className="calc-step-num">2</span>
                  {lang === 'mr' ? 'साईझ / पर्याय निवडा' : 'Select Size / Variant'}
                </label>
                <div className="calc-size-pills">
                  {currentProduct.sizes.map((sz, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`calc-size-pill ${selectedSize === sz ? 'active' : ''}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Branch */}
              <div className="calc-form-group">
                <label className="calc-label">
                  <span className="calc-step-num">3</span>
                  {lang === 'mr' ? 'जवळची पद्मश्री शाखा' : 'Nearest Delivery Branch'}
                </label>
                <div className="calc-select-wrapper">
                  <select
                    id="calc-branch-select"
                    className="calc-select"
                    value={selectedBranch}
                    onChange={e => setSelectedBranch(e.target.value)}
                  >
                    <option value="main">
                      {lang === 'mr' ? mainContact.headOffice.titleMr : mainContact.headOffice.title}
                    </option>
                    {branchesData.map(b => (
                      <option key={b.id} value={b.id}>{lang === 'mr' ? b.nameMr : b.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="calc-select-arrow" />
                </div>
              </div>

              {/* Step 4: Transport Toggle */}
              <div className="calc-form-group">
                <label className="calc-transport-toggle">
                  <input
                    type="checkbox"
                    checked={includeTransport}
                    onChange={e => setIncludeTransport(e.target.checked)}
                    className="calc-checkbox"
                  />
                  <div className="calc-toggle-track">
                    <Truck size={16} className="calc-toggle-icon" />
                    <span className="calc-toggle-text">
                      {lang === 'mr' ? 'थेट शेतात डिलिव्हरी समाविष्ट करा' : 'Include Farm Delivery Transport'}
                    </span>
                    <span className="calc-toggle-price">+ ₹2,500</span>
                  </div>
                </label>
              </div>

              {/* Farmer Info Row */}
              <div className="calc-farmer-row">
                <div className="calc-farmer-field">
                  <label className="calc-label">
                    <User size={14} />
                    {lang === 'mr' ? 'तुमचे नाव' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    className="calc-input"
                    placeholder={lang === 'mr' ? 'उदा. रामराव पाटील' : 'e.g. Ramesh Patil'}
                    value={farmerName}
                    onChange={e => setFarmerName(e.target.value)}
                  />
                </div>
                <div className="calc-farmer-field">
                  <label className="calc-label">
                    <MapPin size={14} />
                    {lang === 'mr' ? 'गाव / तालुका' : 'Village / Location'}
                  </label>
                  <input
                    type="text"
                    className="calc-input"
                    placeholder={lang === 'mr' ? 'उदा. संगमनेर' : 'e.g. Sangamner'}
                    value={farmerVillage}
                    onChange={e => setFarmerVillage(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Price Result Panel ── */}
          <div className="calc-result-col">
            <div className="calc-result-box">
              {/* Result Header */}
              <div className="calc-result-header">
                <span className="calc-result-badge">
                  <Tag size={14} />
                  {lang === 'mr' ? 'अंदाजित दरपत्रक' : 'Estimated Quotation'}
                </span>
                <span className="calc-warranty-note">
                  <ShieldCheck size={13} />
                  {lang === 'mr' ? 'GST + वॉरंटी समाविष्ट' : 'GST + Warranty Included'}
                </span>
              </div>

              {/* Selected Product Name */}
              <div className="calc-result-product">
                <h4 className="calc-result-name">
                  {lang === 'mr' ? currentProduct.nameMr : currentProduct.name}
                </h4>
                <p className="calc-result-variant">
                  {lang === 'mr' ? 'निवडलेली साईझ: ' : 'Variant: '}
                  <strong>{selectedSize}</strong>
                </p>
              </div>

              {/* Big Price Display */}
              <div className="calc-price-display">
                <span className="calc-price-rupee">₹</span>
                <span className="calc-price-amount">{totalPriceEst.toLocaleString()}</span>
                <span className="calc-price-suffix">/-</span>
              </div>
              <p className="calc-price-note">{lang === 'mr' ? '(अंदाजित कारखान्यातील दर)' : '(Estimated Ex-Factory Price)'}</p>

              {/* Price Breakdown */}
              <div className="calc-price-breakdown">
                <div className="calc-breakdown-row">
                  <span>{lang === 'mr' ? 'मूळ अवजार किंमत:' : 'Base Implement Price:'}</span>
                  <span className="calc-breakdown-val">₹{basePriceEst.toLocaleString()}/-</span>
                </div>
                {includeTransport && (
                  <div className="calc-breakdown-row">
                    <span>{lang === 'mr' ? 'ट्रान्सपोर्ट भाडे:' : 'Farm Delivery Transport:'}</span>
                    <span className="calc-breakdown-val">+ ₹2,500/-</span>
                  </div>
                )}
                <div className="calc-breakdown-row warranty-row">
                  <span>{lang === 'mr' ? 'कारखाना वॉरंटी:' : 'Factory Warranty:'}</span>
                  <span className="calc-breakdown-val warranty-val">✓ 1 Year</span>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <button
                id="calc-send-whatsapp-btn"
                onClick={sendWhatsAppQuote}
                className="calc-whatsapp-btn"
              >
                <MessageCircle size={20} />
                <span>{lang === 'mr' ? 'हे कोटेशन व्हॉट्सॲपवर पाठवा' : 'Send Quote on WhatsApp'}</span>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
