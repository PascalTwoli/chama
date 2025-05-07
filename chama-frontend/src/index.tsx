import React from 'react';
import ReactDOM from 'react-dom/client';

// Import PrimeReact styles in the correct order
import 'primereact/resources/primereact.min.css'; // PrimeReact core CSS
import 'primereact/resources/themes/lara-dark-indigo/theme.css'; // Theme
import 'primeicons/primeicons.css'; // PrimeIcons
import 'primeflex/primeflex.css'; // PrimeFlex for layout

// Import custom styles last
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
