import React from 'react';
import './App.css';
import AppRoutes from './routes/Routes';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'primereact/resources/primereact.min.css'; // PrimeReact core CSS
import 'primereact/resources/themes/lara-dark-indigo/theme.css'; // Theme
import 'primeicons/primeicons.css'; // PrimeIcons
// import 'primeflex/primeflex.css'; // PrimeFlex for layout


function App() {
  return (
    <div className="App text-base">
      <AppRoutes/>
    </div>
  );
}

export default App;
