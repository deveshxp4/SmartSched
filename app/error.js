"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc' }}>
        <div style={{ background: 'white', padding: '2rem 3rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', color: '#e53e3e', marginBottom: '1rem' }}>Something went wrong</h1>
          <p style={{ color: '#555', marginBottom: '1.5rem' }}>{error?.message || 'An unexpected error occurred.'}</p>
          <button onClick={reset} style={{ background: '#2563eb', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
} 