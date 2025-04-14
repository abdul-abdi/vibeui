
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Performance optimization: Use a constant for the root element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

// Create root once
createRoot(rootElement).render(<App />);

// Log for tracking render performance
console.log('VibeUI initialized:', new Date().toISOString());
