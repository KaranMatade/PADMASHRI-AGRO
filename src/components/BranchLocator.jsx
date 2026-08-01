import React from 'react';
import { MapPin, Phone, MessageCircle, Navigation, Clock, Building2 } from 'lucide-react';
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
        <div 
          className="branch-card" 
          style={{ 
            marginBottom: '2.5rem', 
            background: 'linear-gradient(135deg, var(--slate-900), #162032)', 
            color: 'white',
            border: '2px solid var(--secondary)'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span className="badge badge-amber">{mainContact.headOffice.badge}</span>
                <span className="badge badge-primary">{lang === 'mr' ? 'मुख्य कारखाना' : 'Headquarters'}</span>
              </div>

              <h3 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '0.5rem' }}>
                {lang === 'mr' ? mainContact.headOffice.titleMr : mainContact.headOffice.title}
              </h3>

              <p style={{ color: 'var(--slate-300)', fontSize: '1.05rem', marginBottom: '1.2rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <MapPin size={20} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '3px' }} />
                <span>{lang === 'mr' ? mainContact.headOffice.addressMr : mainContact.headOffice.address}</span>
              </p>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'var(--slate-300)', fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={16} style={{ color: 'var(--secondary)' }} />
                  <a href={`tel:${mainContact.headOffice.phoneClean}`} style={{ color: 'white', fontWeight: '700' }}>
                    {mainContact.headOffice.phone}
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={16} style={{ color: 'var(--secondary)' }} />
                  <span>Mon - Sat: 9:00 AM - 8:30 PM</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a 
                href={`tel:${mainContact.headOffice.phoneClean}`}
                className="btn-amber"
                style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
              >
                <Phone size={18} />
                <span>{lang === 'mr' ? 'मुख्य कारखान्यात कॉल करा' : 'Call Main Office'}</span>
              </a>

              <a 
                href={`https://wa.me/${mainContact.headOffice.phoneClean}?text=${encodeURIComponent('Hello Padmashri Agro Main Office')}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
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
