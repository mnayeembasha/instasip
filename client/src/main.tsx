import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { PostHogProvider } from 'posthog-js/react';
import posthog from 'posthog-js';
import App from './App';
import './index.css';

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  // You can also add other options like:
  capture_pageview: true,
  person_profiles: 'identified_only',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PostHogProvider client={posthog}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </PostHogProvider>
  </React.StrictMode>
);
