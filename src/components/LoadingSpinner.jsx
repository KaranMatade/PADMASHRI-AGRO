import React from 'react';

/**
 * Loading spinner component for Suspense fallback
 * Displays a centered spinner with bilingual loading text
 */
export default function LoadingSpinner() {
  return (
    <div 
      className="loading-spinner-overlay"
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 9999
      }}
    >
      <div 
        style={{
          background: 'var(--bg-card, #fff)',
          padding: '2rem',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}
      >
        {/* Spinner Animation */}
        <div 
          className="spinner"
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid var(--border-color, #e5e7eb)',
            borderTopColor: 'var(--primary, #16a34a)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
        
        {/* Loading Text */}
        <span 
          className="sr-only"
          style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted, #6b7280)',
            fontWeight: '500'
          }}
        >
          Loading...
        </span>

        {/* CSS Animation Keyframes */}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
