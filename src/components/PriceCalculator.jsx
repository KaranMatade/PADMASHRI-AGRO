import React, { useState, useEffect } from 'react';
import { Calculator, MessageCircle, Sparkles, Send, Tag, ShieldCheck, Truck, User, MapPin, ChevronDown, Phone } from 'lucide-react';
import { productsData as defaultProductsData } from '../data/productsData';
import { useContactData } from '../hooks/useContactData';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query } from 'firebase/firestore';
import { toast } from 'sonner';

export default function PriceCalculator({ lang }) {
  const { mainContact, branchesData } = useContactData();
  const [calcMode, setCalcMode] = useState('price'); // 'price' or 'subsidy'
  const [productsList, setProductsList] = useState(defaultProductsData);
  const [selectedProductId, setSelectedProductId] = useState(defaultProductsData[0].id);
  const [selectedSize, setSelectedSize] = useState(defaultProductsData[0].sizes[0]);
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [includeTransport, setIncludeTransport] = useState(false);
  const [farmerCategory, setFarmerCategory] = useState('small_sc_st'); // 'small_sc_st' (50%) or 'general' (40%)
  const [loanTenureMonths, setLoanTenureMonths] = useState(36); // 12, 24, 36, 48, 60
  const [downPaymentPercent, setDownPaymentPercent] = useState(25); // 15% to 50%
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerVillage, setFarmerVillage] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  // Subscribe to live products from Firestore
  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const live = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const active = live.filter(p => p.isActive !== false && p.status !== 'inactive');
        if (active.length > 0) {
          setProductsList(active);
        }
      }
    }, (err) => {
      console.error('Error fetching live products in PriceCalculator:', err);
    });
    return () => unsubscribe();
  }, []);

  const currentProduct = productsList.find(p => p.id === selectedProductId) || productsList[0] || defaultProductsData[0];

  const handleProductChange = (e) => {
    const prodId = e.target.value;
    setSelectedProductId(prodId);
    const p = productsList.find(prod => prod.id === prodId);
    // Always reset to first size when product changes to avoid index mismatch
    if (p && p.sizes && p.sizes.length > 0) {
      setSelectedSize(p.sizes[0]);
    }
  };

  // Safe size index calculation with fallback to prevent -1 errors
  const sizeIndex = currentProduct.sizes.indexOf(selectedSize);
  const safeSizeIndex = sizeIndex >= 0 ? sizeIndex : 0;
  
  const sizeStep = currentProduct.sizes.length > 1
    ? (currentProduct.priceMax - currentProduct.priceMin) / (currentProduct.sizes.length - 1)
    : 0;
  const basePriceEst = Math.round(currentProduct.priceMin + (sizeStep * safeSizeIndex));
  const transportEst = includeTransport ? 2500 : 0;
  const totalPriceEst = basePriceEst + transportEst;

  // Subsidy Calculation (Mahadbt / Krishi Yantrikikaran scheme)
  const subsidyPercent = farmerCategory === 'small_sc_st' ? 0.50 : 0.40;
  const maxSubsidyCap = farmerCategory === 'small_sc_st' ? 50000 : 40000;
  const calculatedSubsidy = Math.min(Math.round(basePriceEst * subsidyPercent), maxSubsidyCap);
  const netFarmerShare = Math.max(totalPriceEst - calculatedSubsidy, 10000);

  // Tractor Loan EMI Calculation (Standard Agri Loan at 8.5% p.a.)
  const annualInterestRate = 0.085;
  const monthlyRate = annualInterestRate / 12;
  const downPaymentAmount = Math.round(netFarmerShare * (downPaymentPercent / 100));
  const loanPrincipal = netFarmerShare - downPaymentAmount;
  const monthlyEMI = Math.round(
    (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, loanTenureMonths)) /
    (Math.pow(1 + monthlyRate, loanTenureMonths) - 1)
  );

  const sendWhatsAppQuote = async () => {
    if (!farmerName.trim() || !farmerPhone.trim() || !farmerVillage.trim()) {
      setShowErrors(true);
      toast.error(
        lang === 'mr' 
          ? 'कृपया तुमचे नाव, मोबाईल नंबर आणि गाव प्रविष्ट करा.' 
          : 'Please enter your name, mobile number, and village.'
      );
      return;
    }
    setShowErrors(false);
    const branchInfo = selectedBranch === 'main'
      ? (mainContact?.headOffice?.title || 'Main Factory HQ')
      : (branchesData.find(b => b.id === selectedBranch)?.name || 'Nearest Branch');

    const message = calcMode === 'subsidy'
      ? (lang === 'mr'
          ? `*शासकीय कृषी योजना व ईएमआय अंदाजपत्रक - पद्मश्री ॲग्रो*\n\n` +
            `• शेतकर्‍याचे नाव: ${farmerName}\n` +
            `• संपर्क मोबाईल: ${farmerPhone}\n` +
            `• गाव/पत्ता: ${farmerVillage}\n` +
            `• अवजार: ${currentProduct.nameMr} (${currentProduct.name})\n` +
            `• साईज: ${selectedSize}\n` +
            `• शेतकरी प्रवर्ग: ${farmerCategory === 'small_sc_st' ? 'अल्पभूधारक / महिला / SC-ST (५०% अनुदान)' : 'सर्वसाधारण प्रवर्ग (४०% अनुदान)'}\n` +
            `• मूळ किंमत: ₹${totalPriceEst.toLocaleString()}/-\n` +
            `• अंदाजित शासकीय अनुदान: ₹${calculatedSubsidy.toLocaleString()}/-\n` +
            `• शेतकरी वाटा: *₹${netFarmerShare.toLocaleString()}/-*\n` +
            `• अंदाजित मासिक हप्ता (EMI): *₹${monthlyEMI.toLocaleString()}/महिना* (${loanTenureMonths} महिने)\n\nकृपया महाडीबीटी कोटेशन व बँक लोन मंजुरीची माहिती द्या.`
          : `*Govt Subsidy & Tractor Loan EMI Inquiry - Padmashri Agro*\n\n` +
            `• Farmer Name: ${farmerName}\n` +
            `• Mobile: ${farmerPhone}\n` +
            `• Location: ${farmerVillage}\n` +
            `• Implement: ${currentProduct.name}\n` +
            `• Variant: ${selectedSize}\n` +
            `• Category: ${farmerCategory === 'small_sc_st' ? 'Small/Marginal/SC/ST/Women (50% Subsidy)' : 'General Category (40% Subsidy)'}\n` +
            `• Total Price: ₹${totalPriceEst.toLocaleString()}/-\n` +
            `• Est. Govt Subsidy: ₹${calculatedSubsidy.toLocaleString()}/-\n` +
            `• Farmer Share: *₹${netFarmerShare.toLocaleString()}/-*\n` +
            `• Est. Monthly EMI: *₹${monthlyEMI.toLocaleString()}/mo* (${loanTenureMonths} mos tenure)\n\nPlease provide formal quotation for Mahadbt subsidy & bank loan approval.`)
      : (lang === 'mr'
          ? `*कोटेशन अंदाजपत्रक चौकशी - पद्मश्री ॲग्रो*\n\n` +
            `• शेतकर्‍याचे नाव: ${farmerName}\n` +
            `• संपर्क मोबाईल: ${farmerPhone}\n` +
            `• गाव/पत्ता: ${farmerVillage}\n` +
            `• निवडलेले अवजार: ${currentProduct.nameMr} (${currentProduct.name})\n` +
            `• साईज (Size): ${selectedSize}\n` +
            `• निवडलेली शाखा: ${branchInfo}\n` +
            `• वाहतूक जोडणी: ${includeTransport ? 'होय (थेट शेतात पोच)' : 'नाही'}\n` +
            `• अंदाजित दर: *₹${totalPriceEst.toLocaleString()}/-*\n\nकृपया मला नक्की डिस्काउंट व पेमेंट सवलत सांगा.`
          : `*Price Estimation Inquiry - Padmashri Agro*\n\n` +
            `• Farmer Name: ${farmerName}\n` +
            `• Mobile: ${farmerPhone}\n` +
            `• Location/Village: ${farmerVillage}\n` +
            `• Selected Implement: ${currentProduct.name}\n` +
            `• Size Variant: ${selectedSize}\n` +
            `• Nearest Branch: ${branchInfo}\n` +
            `• Transport Required: ${includeTransport ? 'Yes (Farm delivery)' : 'No'}\n` +
            `• Estimated Quote: *₹${totalPriceEst.toLocaleString()}/-*\n\nPlease provide final best price and payment scheme.`);

    const phoneNum = mainContact?.whatsapp || '919226253710';
    window.open(`https://wa.me/${phoneNum}?text=${encodeURIComponent(message)}`, '_blank');

    // Save Lead to Firestore 'inquiries' collection in real-time
    try {
      await addDoc(collection(db, 'inquiries'), {
        name: farmerName.trim(),
        phone: farmerPhone.trim(),
        village: farmerVillage.trim(),
        productName: `${currentProduct.nameMr || currentProduct.name} (${selectedSize})`,
        productId: currentProduct.id,
        branch: branchInfo,
        message: calcMode === 'subsidy'
          ? `शासकीय योजना अंदाज: एकूण ₹${totalPriceEst.toLocaleString()} | शेतकरी वाटा ₹${netFarmerShare.toLocaleString()} | EMI ₹${monthlyEMI}/महिना (${loanTenureMonths} महिने)`
          : `कॅल्क्युलेटर दर अंदाज: ₹${totalPriceEst.toLocaleString()} | साईझ: ${selectedSize} | ट्रान्सपोर्ट: ${includeTransport ? 'होय' : 'नाही'}`,
        status: 'New',
        createdAt: serverTimestamp(),
        dateStr: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      });

      toast.success(
        lang === 'mr'
          ? 'कोटेशन विनंती यशस्वीरित्या नोंदवली गेली आहे!'
          : 'Price estimate inquiry submitted to admin successfully!'
      );
    } catch (err) {
      console.error('Failed to log lead in Firestore inquiries:', err);
    }
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
          <h2 className="section-title calc-section-title" key={`calc-title-${lang}`}>
            {lang === 'mr' ? (
              <span>दर <span>अंदाजपत्रक कॅल्क्युलेटर</span></span>
            ) : (
              <span>Equipment <span>Price Estimator</span></span>
            )}
          </h2>
          <p className="section-desc calc-section-desc">
            {lang === 'mr'
              ? 'तुमच्या शेताच्या गरजेनुसार अवजार, साईझ व जवळची शाखा निवडून त्वरित अंदाजपत्रक मिळवा.'
              : 'Select your implement, size variant, and nearest branch to instantly get an estimated factory price.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setCalcMode('price')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: calcMode === 'price' ? '#059669' : '#e2e8f0',
              backgroundColor: calcMode === 'price' ? '#059669' : '#ffffff',
              color: calcMode === 'price' ? '#ffffff' : '#475569',
              boxShadow: calcMode === 'price' ? '0 4px 12px rgba(5, 150, 105, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            🏷️ {lang === 'mr' ? 'थेट कारखाना दर' : 'Factory Price Estimator'}
          </button>
          <button
            type="button"
            onClick={() => setCalcMode('subsidy')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: calcMode === 'subsidy' ? '#059669' : '#e2e8f0',
              backgroundColor: calcMode === 'subsidy' ? '#059669' : '#ffffff',
              color: calcMode === 'subsidy' ? '#ffffff' : '#475569',
              boxShadow: calcMode === 'subsidy' ? '0 4px 12px rgba(5, 150, 105, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            🏛️ {lang === 'mr' ? 'शासकीय अनुदान व ईएमआय (EMI)' : 'Govt Subsidy & Tractor EMI'}
          </button>
        </div>

        {/* Main Calculator Card */}
        <div className="calculator-card">

          {/* ── LEFT: Form Controls ── */}
          <div className="calc-form-col">
            <div className="calc-form-inner">
              <div className="calc-form-heading">
                <Sparkles size={20} className="calc-heading-icon" />
                <span>
                  {calcMode === 'subsidy'
                    ? (lang === 'mr' ? 'अनुदान व कर्ज तपशील निवडा' : 'Subsidy & Loan Parameters')
                    : (lang === 'mr' ? 'अवजार व साईझ निवडा' : 'Select Specifications')}
                </span>
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
                    {productsList.map(p => (
                      <option key={p.id} value={p.id}>
                        {(lang === 'mr' ? (p.nameMr || p.name) : (p.name || p.nameMr)).replace(/[{}[\]]/g, '')} — ₹{(p.priceMin || 0).toLocaleString()} to ₹{(p.priceMax || 0).toLocaleString()}
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
                      {typeof sz === 'string' ? sz.replace(/[{}[\]]/g, '') : sz}
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
                    {branchesData.filter(b => b.isActive !== false).map(b => (
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

              {/* Step 4: Subsidy & Loan Controls (if in subsidy mode) */}
              {calcMode === 'subsidy' && (
                <>
                  <div className="calc-form-group">
                    <label className="calc-label">
                      <span className="calc-step-num">4</span>
                      {lang === 'mr' ? 'शेतकरी प्रवर्ग निवडा (महाडीबीटी योजना)' : 'Farmer Category (Mahadbt Scheme)'}
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setFarmerCategory('small_sc_st')}
                        style={{
                          padding: '0.6rem 0.75rem',
                          borderRadius: '8px',
                          border: farmerCategory === 'small_sc_st' ? '2px solid #059669' : '1px solid #e2e8f0',
                          backgroundColor: farmerCategory === 'small_sc_st' ? '#f0fdf4' : '#ffffff',
                          color: farmerCategory === 'small_sc_st' ? '#166534' : '#475569',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        🌾 {lang === 'mr' ? 'अल्पभूधारक / महिला / SC / ST' : 'Small / SC / ST / Women'}<br />
                        <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>50% {lang === 'mr' ? 'अनुदान' : 'Subsidy'} (Max ₹50K)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFarmerCategory('general')}
                        style={{
                          padding: '0.6rem 0.75rem',
                          borderRadius: '8px',
                          border: farmerCategory === 'general' ? '2px solid #059669' : '1px solid #e2e8f0',
                          backgroundColor: farmerCategory === 'general' ? '#f0fdf4' : '#ffffff',
                          color: farmerCategory === 'general' ? '#166534' : '#475569',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        👨‍🌾 {lang === 'mr' ? 'सर्वसाधारण प्रवर्ग शेतकरी' : 'General Category Farmer'}<br />
                        <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>40% {lang === 'mr' ? 'अनुदान' : 'Subsidy'} (Max ₹40K)</span>
                      </button>
                    </div>
                  </div>

                  <div className="calc-form-group">
                    <label className="calc-label">
                      <span className="calc-step-num">5</span>
                      {lang === 'mr' ? 'बँक कर्ज मुदत (Tenure)' : 'Loan Tenure'}
                    </label>
                    <div className="calc-size-pills">
                      {[12, 24, 36, 48, 60].map(months => (
                        <button
                          key={months}
                          type="button"
                          onClick={() => setLoanTenureMonths(months)}
                          className={`calc-size-pill ${loanTenureMonths === months ? 'active' : ''}`}
                        >
                          {months} {lang === 'mr' ? 'महिने' : 'Months'} ({months / 12} {lang === 'mr' ? 'वर्ष' : 'Yr'})
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="calc-form-group">
                    <label className="calc-label">
                      <span className="calc-step-num">6</span>
                      {lang === 'mr' ? 'डाऊन पेमेंट टक्केवारी' : 'Down Payment'}
                    </label>
                    <div className="calc-size-pills">
                      {[15, 25, 35, 50].map(pct => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setDownPaymentPercent(pct)}
                          className={`calc-size-pill ${downPaymentPercent === pct ? 'active' : ''}`}
                        >
                          {pct}% (₹{Math.round(netFarmerShare * (pct / 100)).toLocaleString()})
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Farmer Info Row */}
              <div className="calc-farmer-row">
                <div className="calc-farmer-field">
                  <label className="calc-label">
                    <User size={14} />
                    {lang === 'mr' ? '१. तुमचे नाव' : '1. Your Name'}
                  </label>
                  <input
                    type="text"
                    className={`calc-input ${showErrors && !farmerName.trim() ? 'border-red-500' : ''}`}
                    style={showErrors && !farmerName.trim() ? { borderColor: '#ef4444' } : {}}
                    placeholder={lang === 'mr' ? 'उदा. रामराव पाटील' : 'e.g. Ramesh Patil'}
                    value={farmerName}
                    onChange={e => { setFarmerName(e.target.value); setShowErrors(false); }}
                  />
                  {showErrors && !farmerName.trim() && (
                    <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                      {lang === 'mr' ? 'नाव आवश्यक आहे' : 'Name is required'}
                    </span>
                  )}
                </div>

                <div className="calc-farmer-field">
                  <label className="calc-label">
                    <Phone size={14} />
                    {lang === 'mr' ? '२. मोबाईल नंबर' : '2. Mobile Number'}
                  </label>
                  <input
                    type="tel"
                    className={`calc-input ${showErrors && !farmerPhone.trim() ? 'border-red-500' : ''}`}
                    style={showErrors && !farmerPhone.trim() ? { borderColor: '#ef4444' } : {}}
                    placeholder="98xxxxxxxx"
                    value={farmerPhone}
                    onChange={e => { setFarmerPhone(e.target.value); setShowErrors(false); }}
                  />
                  {showErrors && !farmerPhone.trim() && (
                    <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                      {lang === 'mr' ? 'मोबाईल नंबर आवश्यक आहे' : 'Mobile number is required'}
                    </span>
                  )}
                </div>

                <div className="calc-farmer-field">
                  <label className="calc-label">
                    <MapPin size={14} />
                    {lang === 'mr' ? '३. गाव / तालुका' : '3. Village / Location'}
                  </label>
                  <input
                    type="text"
                    className={`calc-input ${showErrors && !farmerVillage.trim() ? 'border-red-500' : ''}`}
                    style={showErrors && !farmerVillage.trim() ? { borderColor: '#ef4444' } : {}}
                    placeholder={lang === 'mr' ? 'उदा. संगमनेर' : 'e.g. Sangamner'}
                    value={farmerVillage}
                    onChange={e => { setFarmerVillage(e.target.value); setShowErrors(false); }}
                  />
                  {showErrors && !farmerVillage.trim() && (
                    <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                      {lang === 'mr' ? 'गावाचे नाव आवश्यक आहे' : 'Village is required'}
                    </span>
                  )}
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
                  {calcMode === 'subsidy' 
                    ? (lang === 'mr' ? 'शासकीय योजना अंदाज' : 'Subsidy & EMI Plan')
                    : (lang === 'mr' ? 'अंदाजित दरपत्रक' : 'Estimated Quotation')}
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
                <span className="calc-price-amount">
                  {calcMode === 'subsidy' ? netFarmerShare.toLocaleString() : totalPriceEst.toLocaleString()}
                </span>
                <span className="calc-price-suffix">/-</span>
              </div>
              <p className="calc-price-note">
                {calcMode === 'subsidy'
                  ? (lang === 'mr' ? '(अनुदानानंतर शेतकरी प्रत्यक्ष वाटा)' : '(Farmer Net Cost After Subsidy)')
                  : (lang === 'mr' ? '(अंदाजित कारखान्यातील दर)' : '(Estimated Ex-Factory Price)')}
              </p>

              {/* Monthly EMI highlight pill in subsidy mode */}
              {calcMode === 'subsidy' && (
                <div style={{
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600, display: 'block' }}>
                    {lang === 'mr' ? 'अंदाजित मासिक हप्ता (Tractor/Agri Loan EMI)' : 'Est. Monthly Installment (EMI)'}
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065f46' }}>
                    ₹{monthlyEMI.toLocaleString()} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>/ {lang === 'mr' ? 'महिना' : 'month'}</span>
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#059669', display: 'block', marginTop: '2px' }}>
                    ({loanTenureMonths} {lang === 'mr' ? 'महिने' : 'mos'} @ 8.5% p.a. • {downPaymentPercent}% {lang === 'mr' ? 'डाऊन पेमेंट' : 'down payment'})
                  </span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="calc-price-breakdown">
                <div className="calc-breakdown-row">
                  <span>{lang === 'mr' ? 'मूळ अवजार किंमत:' : 'Base Implement Price:'}</span>
                  <span className="calc-breakdown-val">₹{basePriceEst.toLocaleString()}/-</span>
                </div>
                {calcMode === 'subsidy' && (
                  <div className="calc-breakdown-row" style={{ color: '#059669', fontWeight: 700 }}>
                    <span>{lang === 'mr' ? 'शासकीय महाडीबीटी अनुदान:' : 'Govt Mahadbt Subsidy:'}</span>
                    <span className="calc-breakdown-val">- ₹{calculatedSubsidy.toLocaleString()}/-</span>
                  </div>
                )}
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
                <span>
                  {calcMode === 'subsidy'
                    ? (lang === 'mr' ? 'अनुदान व EMI कोटेशन मिळवा' : 'Get Subsidy & EMI Quote')
                    : (lang === 'mr' ? 'हे कोटेशन व्हॉट्सॲपवर पाठवा' : 'Send Quote on WhatsApp')}
                </span>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
