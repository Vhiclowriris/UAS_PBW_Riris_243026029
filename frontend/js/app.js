// Main Application Entry Point
console.log('UMKM Dashboard Application Loaded');

// Global error handler
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

// Check network connectivity
window.addEventListener('online', () => {
  console.log('Network connected');
});

window.addEventListener('offline', () => {
  console.warn('Network disconnected');
  alert('Koneksi internet terputus. Beberapa fitur mungkin tidak berfungsi.');
});

// Service Worker registration (untuk PWA - optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // navigator.serviceWorker.register('/sw.js')
    //   .then(reg => console.log('Service Worker registered'))
    //   .catch(err => console.log('Service Worker registration failed'));
  });
}