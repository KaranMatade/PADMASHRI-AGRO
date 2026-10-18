import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Navigation, 
  Clock, 
  Building2, 
  ShieldCheck, 
  Award, 
  Mail, 
  Search, 
  CheckCircle2, 
  Tag,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useContactData } from '../hooks/useContactData';

export default function BranchLocator({ lang }) {
  const { mainContact, branchesData } = useContactData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // WhatsApp branch message generator
  const getWhatsAppBranch = (branch) => {
    const text = lang === 'mr'
      ? `नमस्कार पद्मश्री ॲग्रो, मी ${branch.nameMr || branch.name} शाखेशी शेती अवजारे खरेदी व सेवेबाबत संपर्क साधू इच्छितो.`
      : `Hello Padmashri Agro, I would like to inquire about agricultural machinery sales & service at your ${branch.name}.`;
    return `https://wa.me/${branch.phoneClean || mainContact.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  // Google Maps link generator
  const getMapsUrl = (branch) => {
    if (branch.googleMapsUrl && branch.googleMapsUrl.trim().length > 0) {
      return branch.googleMapsUrl;
    }
    const query = branch.address || branch.name;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  // Filter branches: only active, match category and search
  const filteredBranches = useMemo(() => {
    return branchesData.filter(branch => {
      // Must be active (default true)
      if (branch.isActive === false) return false;

      // Category filter
      if (selectedCategory !== 'all') {
        const cat = (branch.category || branch.badge || '').toLowerCase();
        if (selectedCategory === 'showroom' && !cat.includes('showroom') && !cat.includes('sales')) return false;
        if (selectedCategory === 'demo' && !cat.includes('demo') && !cat.includes('field')) return false;
        if (selectedCategory === 'service' && !cat.includes('service') && !cat.includes('spare') && !cat.includes('parts')) return false;
      }

      // Search query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (branch.name || '').toLowerCase().includes(q);
        const matchesNameMr = (branch.nameMr || '').toLowerCase().includes(q);
        const matchesAddr = (branch.address || '').toLowerCase().includes(q);
        const matchesAddrMr = (branch.addressMr || '').toLowerCase().includes(q);
        const matchesPerson = (branch.contactPerson || '').toLowerCase().includes(q);
        return matchesName || matchesNameMr || matchesAddr || matchesAddrMr || matchesPerson;
      }

      return true;
    });
  }, [branchesData, selectedCategory, searchQuery]);

  return (
    <section id="branches" className="branch-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-subtitle">
            <Building2 size={16} style={{ display: 'inline', marginRight: '6px' }} />
            {lang === 'mr' ? 'थेट संपर्क व अधिकृत शाखा नेटवर्क' : 'Sales & Service Centers Network'}
          </span>
          <h2 className="section-title" key={`branch-title-${lang}`}>
            {lang === 'mr' ? (
              <span>आमच्या <span>शाखा व थेट संपर्क</span></span>
            ) : (
              <span>Our Factory & <span>Branch Network</span></span>
            )}
          </h2>
          <p className="section-desc">
            {lang === 'mr'
              ? 'संगमनेर मुख्य कारखान्यासह राहाता, वैजापूर आणि खुलताबाद येथील अधिकृत शाखांना प्रत्यक्ष भेट द्या किंवा थेट संपर्क साधा.'
              : 'Visit our flagship manufacturing works in Sangamner or our authorized regional showrooms across Ahilyanagar & Sambhajinagar.'}
          </p>
        </div>

        {/* Unified Quick Channels Bar (Email, WhatsApp, Hotline) */}
        <div className="contact-channels-bar">
          <a href={`tel:${mainContact.mainPhone}`} className="channel-card">
            <div className="channel-icon-box channel-phone">
              <Phone size={20} />
            </div>
            <div className="channel-text">
              <span className="channel-label">{lang === 'mr' ? 'मुख्य फोन हेल्पलाईन' : 'Main Phone Hotline'}</span>
              <span className="channel-value">{mainContact.mainPhone}</span>
            </div>
          </a>

          <a 
            href={`https://wa.me/${mainContact.whatsapp}?text=${encodeURIComponent(lang === 'mr' ? 'नमस्कार पद्मश्री ॲग्रो, मला शेती अवजारांविषयी अधिक माहिती हवी आहे.' : 'Hello Padmashri Agro, I would like to inquire about agricultural implements.')}`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="channel-card"
          >
            <div className="channel-icon-box channel-whatsapp">
              <MessageCircle size={20} />
            </div>
            <div className="channel-text">
              <span className="channel-label">{lang === 'mr' ? 'व्हॉट्सॲप ऑर्डर व मदत कक्ष' : 'WhatsApp Order Desk'}</span>
              <span className="channel-value">+{mainContact.whatsapp}</span>
            </div>
          </a>

          <a href={`mailto:${mainContact.email}`} className="channel-card">
            <div className="channel-icon-box channel-email">
              <Mail size={20} />
            </div>
            <div className="channel-text">
              <span className="channel-label">{lang === 'mr' ? 'अधिकृत कंपनी ईमेल' : 'Official Email Inquiries'}</span>
              <span className="channel-value">{mainContact.email}</span>
            </div>
          </a>
        </div>

        {/* Head Office Highlight Card */}
        <div className="head-office-card">
          <div className="head-office-grid">
            <div className="head-office-info">
              <div className="head-office-badges">
                <span className="badge badge-amber">
                  <Award size={13} />
                  <span>{mainContact.headOffice.badge || 'Main Factory & Works'}</span>
                </span>
                <span className="badge badge-primary">
                  <ShieldCheck size={13} />
                  <span>{lang === 'mr' ? 'मुख्यालय व कारखाना' : 'Headquarters & Plant'}</span>
                </span>
                <span className="badge badge-green-glow">
                  <CheckCircle2 size={13} />
                  <span>{lang === 'mr' ? 'खुले: सोम - शनि' : 'Open: Mon - Sat'}</span>
                </span>
              </div>

              <h3 className="head-office-title">
                {lang === 'mr' ? mainContact.headOffice.titleMr : mainContact.headOffice.title}
              </h3>

              <p className="head-office-address">
                <MapPin size={20} className="address-pin-icon" />
                <span>{lang === 'mr' ? mainContact.headOffice.addressMr : mainContact.headOffice.address}</span>
              </p>

              {/* Head office facilities chips */}
              <div className="head-office-facilities">
                <span className="facility-pill">🚜 {lang === 'mr' ? 'थेट कारखाना विक्री' : 'Direct Factory Sales'}</span>
                <span className="facility-pill">🔧 {lang === 'mr' ? 'दुरुस्ती व सर्व्हिसिंग' : 'Main Overhaul Workshop'}</span>
                <span className="facility-pill">⚙️ {lang === 'mr' ? 'ओरिजनल सुटे भाग' : 'Genuine Spares Depot'}</span>
                <span className="facility-pill">🌾 {lang === 'mr' ? 'महाडीबीटी अनुदान मार्गदर्शन' : 'Mahadbt Subsidy Helpdesk'}</span>
              </div>

              <div className="head-office-meta">
                <div className="meta-item">
                  <Phone size={16} style={{ color: 'var(--secondary-light)', flexShrink: 0 }} />
                  <span>{lang === 'mr' ? 'फोन:' : 'Phone:'}</span>
                  <a href={`tel:${mainContact.headOffice.phoneClean}`} className="meta-phone-link">
                    {mainContact.headOffice.phone}
                  </a>
                </div>

                <div className="meta-item">
                  <Clock size={16} style={{ color: 'var(--secondary-light)', flexShrink: 0 }} />
                  <span>Mon - Sat: 9:00 AM - 8:30 PM (Sunday Closed)</span>
                </div>
              </div>
            </div>

            <div className="head-office-actions">
              <a 
                href={`tel:${mainContact.headOffice.phoneClean}`}
                className="btn-amber head-office-btn"
              >
                <Phone size={18} />
                <span>{lang === 'mr' ? 'कारखान्यात कॉल करा' : 'Call Main Office'}</span>
              </a>

              <a 
                href={`https://wa.me/${mainContact.headOffice.phoneClean}?text=${encodeURIComponent(lang === 'mr' ? 'नमस्कार पद्मश्री ॲग्रो, मला संगमनेर मुख्य कारखान्याशी संपर्क साधायचा आहे.' : 'Hello Padmashri Agro Main Office, I would like to inquire about agricultural machinery.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary head-office-btn"
              >
                <MessageCircle size={18} />
                <span>{lang === 'mr' ? 'व्हॉट्सॲप मेसेज करा' : 'WhatsApp Main Office'}</span>
              </a>

              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mainContact.headOffice.mapQuery || mainContact.headOffice.address)}`} 
                target="_blank" 
                rel="noreferrer"
                className="btn-outline-white head-office-btn"
              >
                <Navigation size={17} />
                <span>{lang === 'mr' ? 'गुगल मॅपवर दिशा पहा' : 'Get Directions'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="branch-filter-container">
          <div className="branch-filter-tabs">
            <button 
              className={`branch-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              {lang === 'mr' ? 'सर्व शाखा' : 'All Branches'} ({branchesData.filter(b => b.isActive !== false).length})
            </button>
            <button 
              className={`branch-filter-btn ${selectedCategory === 'showroom' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('showroom')}
            >
              🏢 {lang === 'mr' ? 'शोरूम व विक्री' : 'Showrooms'}
            </button>
          </div>

          <div className="branch-search-box">
            <Search size={17} className="branch-search-icon" />
            <input 
              type="text"
              placeholder={lang === 'mr' ? 'गाव, शहर किंवा तालुक्यानुसार शोधा (उदा. राहाता, वैजापूर)...' : 'Search by town, district or keyword (e.g. Rahata, Vaijapur)...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="branch-search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="branch-search-clear"
                title="Clear Search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Regional Branches Grid */}
        {filteredBranches.length === 0 ? (
          <div className="branch-empty-card">
            <Building2 size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
              {lang === 'mr' ? 'कोणतीही शाखा आढळली नाही' : 'No Branches Found'}
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {lang === 'mr'
                ? 'कृपया दुसरा शब्द शोधून पहा किंवा मुख्य कारखान्याशी थेट संपर्क साधा.'
                : 'Try adjusting your search criteria or contact our main Sangamner headquarters.'}
            </p>
            <button 
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="btn-amber"
              style={{ padding: '0.55rem 1.25rem' }}
            >
              {lang === 'mr' ? 'सर्व शाखा पहा' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="branch-grid">
            {filteredBranches.map(branch => (
              <div key={branch.id} className="branch-card">
                {/* Branch Card Header */}
                <div className="branch-card-header">
                  <div className="branch-tag-row">
                    <span className="badge badge-primary">
                      <Tag size={11} style={{ marginRight: '4px' }} />
                      {branch.category || branch.badge || (lang === 'mr' ? 'अधिकृत शाखा' : 'Authorized Outlet')}
                    </span>
                    <span className="branch-status-indicator">
                      <span className="branch-status-dot" />
                      <span>{lang === 'mr' ? 'आज खुले' : 'Open Today'}</span>
                    </span>
                  </div>

                  <h3 className="branch-name">{lang === 'mr' ? branch.nameMr || branch.name : branch.name}</h3>
                  {branch.nameMr && lang !== 'mr' && (
                    <span className="branch-name-secondary">{branch.nameMr}</span>
                  )}
                  {branch.contactPerson && (
                    <div className="branch-person-pill">
                      <span>👤 {branch.contactPerson}</span>
                    </div>
                  )}
                </div>

                {/* Facilities List */}
                {Array.isArray(branch.facilities) && branch.facilities.length > 0 && (
                  <div className="branch-facilities-row">
                    {branch.facilities.map((fac, idx) => (
                      <span key={idx} className="branch-facility-chip">
                        {fac}
                      </span>
                    ))}
                  </div>
                )}

                {/* Address & Meta */}
                <div className="branch-card-body">
                  <p className="branch-address">
                    <MapPin size={17} className="branch-pin-icon" />
                    <span>{lang === 'mr' ? branch.addressMr || branch.address : branch.address}</span>
                  </p>

                  <div className="branch-details-list">
                    <div className="branch-detail-item">
                      <Phone size={15} className="detail-icon" />
                      <a href={`tel:${branch.phoneClean || branch.phone}`} className="branch-phone-link">
                        {branch.phone}
                      </a>
                    </div>
                    <div className="branch-detail-item">
                      <Clock size={15} className="detail-icon" />
                      <span>{branch.timing || 'Mon - Sat: 9:00 AM - 8:00 PM'}</span>
                    </div>
                  </div>
                </div>

                {/* Perfectly Aligned 3-Button Actions */}
                <div className="branch-actions">
                  <a 
                    href={`tel:${branch.phoneClean || branch.phone}`}
                    className="branch-action-btn branch-btn-call"
                    title={lang === 'mr' ? 'थेट कॉल करा' : 'Call Branch'}
                  >
                    <Phone size={15} />
                    <span>{lang === 'mr' ? 'कॉल' : 'Call'}</span>
                  </a>

                  <a 
                    href={getWhatsAppBranch(branch)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="branch-action-btn branch-btn-whatsapp"
                    title={lang === 'mr' ? 'व्हॉट्सॲपवर संपर्क साधा' : 'WhatsApp'}
                  >
                    <MessageCircle size={15} />
                    <span>{lang === 'mr' ? 'व्हॉट्सॲप' : 'WhatsApp'}</span>
                  </a>

                  <a 
                    href={getMapsUrl(branch)} 
                    target="_blank" 
                    rel="noreferrer"
                    className="branch-action-btn branch-btn-directions"
                    title={lang === 'mr' ? 'मॅपवर दिशा पहा' : 'Directions'}
                  >
                    <Navigation size={15} />
                    <span>{lang === 'mr' ? 'दिशा' : 'Directions'}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
