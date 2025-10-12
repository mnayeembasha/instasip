import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { PostHogProvider } from 'posthog-js/react'
import App from './App';
import './index.css';

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2025-05-24',
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={options}>
    <HelmetProvider>
      <App />
    </HelmetProvider>
   </PostHogProvider>
  </React.StrictMode>
);

