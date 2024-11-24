import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import Scrollbar from './components/scrollbar';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Scrollbar>
  <HelmetProvider>
  <BrowserRouter>
    <Suspense>
      <App />
    </Suspense>
  </BrowserRouter>
</HelmetProvider>
</Scrollbar>
);


