import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Phone, MessageCircle, Search, ArrowLeft } from 'lucide-react';

/**
 * Custom 404 Not Found Page
 * Shown when a user navigates to a non-existent route.
 * Maintains branding, provides helpful navigation, and is fully bilingual.
 */
export default function NotFound() {
  return (
    <div
      id="not-found-page"
      style={{
        minHeight: '100vh',
        background: 'var(--bg-page, #f8fafb)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'Inter, Noto Sans Devanagari, sans-serif',
        textAlign: 'center',
      }}
    >
      {/* Large illustrated 404 */}
      <div style={{ marginBottom: '2rem', position: 'relative', lineHeight: 1 }}>
        <span
          style={{
            fontSize: 'clamp(6rem, 20vw, 12rem)',
            fontWeight: 800,
            color: 'var(--primary, #1a5c2a)',
            opacity: 0.08,
            letterSpacing: '-0.05em',
            userSelect: 'none',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          aria-hidden="true"
        >
          404
        </span>
        <div
          style={{
            position: 'relative',
            fontSize: '5rem',
            marginBottom: '1rem',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.12))',
          }}
          role="img"
          aria-label="Tractor with question mark"
        >
          🚜❓
        </div>
      </div>

      {/* Headline */}
      <h1
        style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: 800,
          color: 'var(--primary, #1a5c2a)',
          marginBottom: '0.5rem',
          lineHeight: 1.2,
        }}
      >
        पृष्ठ सापडले नाही
      </h1>
      <p
        style={{
          fontSize: '1.1rem',
          color: 'var(--text-muted, #666)',
          marginBottom: '0.5rem',
          fontWeight: 500,
        }}
      >
        This Page Does Not Exist
      </p>
      <p
        style={{
          maxWidth: '480px',
          color: 'var(--text-muted, #888)',
          marginBottom: '2.5rem',
          lineHeight: 1.7,
          fontSize: '0.95rem',
        }}
      >
        The page you were looking for was not found. It may have been moved, renamed, or never existed.
        Use the links below to get back on track.
        <br />
        <span style={{ fontSize: '0.85rem' }}>
          तुम्ही शोधत असलेले पृष्ठ उपलब्ध नाही. खाली दिलेल्या लिंकमधून परत जा.
        </span>
      </p>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center',
          marginBottom: '3rem',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--primary, #1a5c2a)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'background 0.2s',
          }}
        >
          <Home size={18} />
          मुख्य पृष्ठ (Home)
        </Link>

        <a
          href="/#products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'transparent',
            color: 'var(--primary, #1a5c2a)',
            border: '2px solid var(--primary, #1a5c2a)',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'all 0.2s',
          }}
        >
          <Search size={18} />
          Products Catalog
        </a>

        <a
          href="tel:+919226253710"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#f5a623',
            color: '#1a1a1a',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'background 0.2s',
          }}
        >
          <Phone size={18} />
          Call Us Now
        </a>
      </div>

      {/* Quick links */}
      <div
        style={{
          borderTop: '1px solid #e5e7eb',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: '#999', fontSize: '0.85rem' }}>Quick Links:</span>
        {[
          { href: '/#calculator', label: 'Price Estimator' },
          { href: '/#gallery', label: 'Photo Gallery' },
          { href: '/#branches', label: 'Branches' },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{
              color: 'var(--primary, #1a5c2a)',
              fontSize: '0.85rem',
              textDecoration: 'underline',
              textDecorationColor: 'transparent',
              fontWeight: 500,
              transition: 'text-decoration-color 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.textDecorationColor = 'currentColor')}
            onMouseLeave={(e) => (e.target.style.textDecorationColor = 'transparent')}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Branding footer */}
      <p
        style={{
          marginTop: '3rem',
          fontSize: '0.8rem',
          color: '#bbb',
        }}
      >
        © {new Date().getFullYear()} Padmashri Agro Engineering Works, Sangamner, Maharashtra
      </p>
    </div>
  );
}
