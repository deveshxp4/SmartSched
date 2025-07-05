export default function NotFound() {
  return (
    <html>
      <body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc' }}>
        <div style={{ background: 'white', padding: '2rem 3rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', color: '#2563eb', marginBottom: '1rem' }}>404 - Page Not Found</h1>
          <p style={{ color: '#555', marginBottom: '1.5rem' }}>Sorry, the page you are looking for does not exist.</p>
          <a href="/" style={{ background: '#2563eb', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 'bold' }}>
            Go Home
          </a>
        </div>
      </body>
    </html>
  );
} 