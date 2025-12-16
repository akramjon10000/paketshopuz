import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Telegram WebApp initialization
const initTelegramApp = () => {
  try {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();

      // Set theme colors (with fallback for older versions)
      try {
        tg.setHeaderColor('#f97316');
        tg.setBackgroundColor('#f8fafc');
      } catch (e) {
        console.log('Theme colors not supported');
      }

      console.log('Telegram WebApp initialized:', tg.initDataUnsafe?.user?.first_name || 'Guest');
    }
  } catch (error) {
    console.log('Telegram WebApp init error:', error);
  }
};

// Initialize Telegram first
initTelegramApp();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}