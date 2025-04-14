
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

// Remove StrictMode to avoid duplicate rendering and potential hook issues
createRoot(rootElement).render(
  <App />
);
