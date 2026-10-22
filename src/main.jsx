import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
// ...
<HashRouter>
  <App />
</HashRouter>
import App from './App';
import { ShopProvider } from './context/ShopContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><ShopProvider><App /></ShopProvider></BrowserRouter></React.StrictMode>);
