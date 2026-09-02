import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Prevents entire application from crashing due to component errors
 * Displays user-friendly error message with recovery options
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details to console for debugging
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    // Reset error state to try rendering again
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    // Reload the entire page
    window.location.reload();
  };

  handleGoHome = () => {
    // Navigate to home page
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Detect language from localStorage or default to Marathi
      let lang = 'mr';
      try {
        const storedLang = window.localStorage.getItem('padmashri-lang');
        if (storedLang) {
          lang = JSON.parse(storedLang);
        }
      } catch (e) {
        // Ignore errors reading localStorage
      }

      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          backgroundColor: 'var(--bg-main, #f5f5f5)'
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            backgroundColor: 'var(--bg-card, #ffffff)',
            borderRadius: '12px',
            padding: '2.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            {/* Error Icon */}
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 1.5rem',
              backgroundColor: '#fef2f2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={32} style={{ color: '#dc2626' }} />
            </div>

            {/* Error Title */}
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: 'var(--text-main, #1f2937)',
              marginBottom: '0.75rem'
            }}>
              {lang === 'mr' ? 'काहीतरी चूक झाली' : 'Something Went Wrong'}
            </h2>

            {/* Error Description */}
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-muted, #6b7280)',
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              {lang === 'mr'
                ? 'पृष्ठ लोड करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा किंवा पृष्ठ रिफ्रेश करा.'
                : 'An unexpected error occurred while loading the page. Please try again or refresh the page.'}
            </p>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={this.handleReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--primary, #16a34a)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
              >
                <RefreshCw size={18} />
                <span>{lang === 'mr' ? 'पृष्ठ रीलोड करा' : 'Reload Page'}</span>
              </button>

              <button
                onClick={this.handleGoHome}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--secondary, #f59e0b)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
              >
                <Home size={18} />
                <span>{lang === 'mr' ? 'मुख्य पृष्ठ' : 'Go to Home'}</span>
              </button>
            </div>

            {/* Technical Details (Collapsed) */}
            {this.state.error && (
              <details style={{
                marginTop: '2rem',
                textAlign: 'left',
                backgroundColor: '#f9fafb',
                padding: '1rem',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}>
                <summary style={{
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: '#6b7280'
                }}>
                  {lang === 'mr' ? 'तांत्रिक तपशील' : 'Technical Details'}
                </summary>
                <pre style={{
                  marginTop: '0.75rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontSize: '0.75rem',
                  color: '#dc2626'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
