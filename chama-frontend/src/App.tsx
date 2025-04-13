import React from 'react';
import logo from './logo.svg';
import './App.css';
import AppRoutes from './routes/Routes';
import "bootstrap-icons/font/bootstrap-icons.css";
import "primeicons/primeicons.css";

function App() {
  return (
    <div className="App text-base">
      <AppRoutes/>
    </div>
  );
}

export default App;
