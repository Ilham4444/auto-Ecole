
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";

// Bootstrap JS (OBLIGATOIRE POUR LES TABS)
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './assets/css/style.scss'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
