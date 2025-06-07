import React from 'react';
import logo from './logo.svg';
import './App.css';
import AppRoutes from './routes/Routes';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'primereact/resources/primereact.min.css'; // PrimeReact core CSS
import 'primereact/resources/themes/lara-dark-indigo/theme.css'; // Theme
import 'primeicons/primeicons.css'; // PrimeIcons
// import 'primeflex/primeflex.css'; // PrimeFlex for layout
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <div className="App text-base">
      <AppRoutes/>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;
