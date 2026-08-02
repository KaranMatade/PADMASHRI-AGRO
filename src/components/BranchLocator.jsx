import React from 'react';
import { MapPin, Phone, MessageCircle, Navigation, Clock, Building2, ShieldCheck, Award } from 'lucide-react';
import { mainContact, branchesData } from '../data/branchesData';

export default function BranchLocator({ lang }) {
  const getWhatsAppBranch = (branch) => {
    const text = lang === 'mr'
      ? `नमस्कार, मी ${branch.nameMr} शाखेशी संपर्क साधू इच्छितो.`
      : `Hello Padmashri Agro, I would like to inquire about sales & service at your ${branch.name}.`;
    return `https://wa.me/${branch.phoneClean}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="branches" className="branch-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">
            <Building2 size={16} style={{ display: 'inline', marginRight: '6px' }} />
            {lang === 'mr' ? 'थेट संपर्क व सेवा केंद्रे' : 'Sales & Service Centers'}
          </span>
          <h2 className="section-title">
            {lang === 'mr' ? (
              <>आमच्या <span>शाखा व संपर्क</span></>
            ) : (
              <>Our Factory & <span>Branch Network</span></>
            )}
          </h2>
          <p className="section-desc">
            {lang === 'mr'
              ? 'संगमनेर मुख्य कारखान्यासह राहाता, वैजापूर आणि खुलताबाद येथील अधिकृत शाखांना भेट द्या.'
              : 'Visit our main manufacturing workshop in Sangamner or our regional sales outlets across Ahilyanagar & Sambhajinagar.'}
          </p>
        </div>

        {/* Head Office Highlight Card */}
        <div className="head-office-card">
          <div className="head-office-grid">
            <div className="head-office-info">
              <div className="head-office-badges">
                <span className="badge badge-amber">
                  <Award size={13} />
                  <span>{mainContact.headOffice.badge}</span>
                </span>
                <span className="badge badge-primary">
                  <ShieldCheck size={13} />
                  <span>{lang === 'mr' ? 'मुख्य कारखाना' : 'Headquarters'}</span>
                </span>
              </div>

              <h3 className="head-office-title">
                {lang === 'mr' ? mainContact.headOffice.titleMr : mainContact.headOffice.title}
              </h3>

              <p className="head-office-address">
                <MapPin size={20} className="address-pin-icon" />
                <span>{lang === 'mr' ? mainContact.headOffice.addressMr : mainContact.headOffice.address}</span>
              </p>

              <div className="head-office-meta">
                <div className="meta-item">
                  <Phone size={16} style={{ color: 'var(--secondary-light)' }} />
                  <a href={`tel:${mainContact.headOffice.phoneClean}`} className="meta-phone-link">
                    {mainContact.headOffice.phone}
                  </a>
                </div>

                <div className="meta-item">
                  <Clock size={16} style={{ color: 'var(--secondary-light)' }} />
                  <span>Mon - Sat: 9:00 AM - 8:30 PM</span>
                </div>
              </div>
            </div>

            <div className="head-office-actions">
              <a 
                href={`tel:${mainContact.headOffice.phoneClean}`}
                className="btn-amber head-office-btn"
              >
                <Phone size={18} />
                <span>{lang === 'mr' ? 'मुख्य कारखान्यात कॉल करा' : 'Call Main Office'}</span>
              </a>

              <a 
                href={`https://wa.me/${mainContact.headOffice.phoneClean}?text=${encodeURIComponent('Hello Padmashri Agro Main Office')}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary head-office-btn"
              >
                <MessageCircle size={18} />
                <span>{lang === 'mr' ? 'व्हॉट्सॲप मेसेज करा' : 'WhatsApp Main Office'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Regional Branches Grid */}
        <div className="branch-grid">
          {branchesData.map(branch => (
            <div key={branch.id} className="branch-card">
              <div className="branch-header">
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>{branch.badge}</span>
                  <h3 className="branch-name">{lang === 'mr' ? branch.nameMr : branch.name}</h3>
                </div>
              </div>

              <p className="branch-address">
                <MapPin size={16} style={{ display: 'inline', marginRight: '6px', color: 'var(--primary)' }} />
                {lang === 'mr' ? branch.addressMr : branch.address}
              </p>

              <div style={{ marginBottom: '1.2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <Phone size={15} style={{ color: 'var(--secondary)' }} />
                  <a href={`tel:${branch.phoneClean}`} style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                    {branch.phone}
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={15} />
                  <span>{branch.timing}</span>
                </div>
              </div>

              <div className="branch-actions">
                <a 
                  href={`tel:${branch.phoneClean}`}
                  className="btn-outline"
                  style={{ flex: 1, justifyContent: 'center', padding: '0.65rem' }}
                >
                  <Phone size={16} />
                  <span>{lang === 'mr' ? 'कॉल करा' : 'Call'}</span>
                </a>

                <a 
                  href={getWhatsAppBranch(branch)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-amber"
                  style={{ flex: 1, justifyContent: 'center', padding: '0.65rem' }}
                >
                  <MessageCircle size={16} />
                  <span>{lang === 'mr' ? 'व्हॉट्सॲप' : 'WhatsApp'}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
