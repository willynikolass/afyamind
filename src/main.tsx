import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for instant offline caching and mobile app installation
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('AfyaMind 2036 update available');
  },
  onOfflineReady() {
    console.log('AfyaMind 2036 is ready for offline use');
  },
});

createRoot(document.getElementById('root')!).render(<App />);

