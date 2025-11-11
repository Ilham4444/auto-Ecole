import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import "./assets/css/style.scss";

// Pages
import Home from "./pages/Home";
import Permis from "./pages/Permis";
import Examens from "./pages/Examens";
import Moniteurs from "./pages/Moniteurs";
import Apropos from "./pages/Apropos";
import Compte from "./pages/Compte";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Header affiché sur toutes les pages */}
        <Header />

        {/* Contenu principal selon la route */}
        <main className="container my-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Permis" element={<Permis />} />
            <Route path="/examens" element={<Examens />} />
            <Route path="/moniteurs" element={<Moniteurs />} />
            <Route path="/apropos" element={<Apropos />} />
            <Route path="/compte" element={<Compte />} />
          </Routes>
        </main>
      

        {/* Footer global */}
        <footer className="text-center py-3 bg-light text-muted border-top">
          © 2025 Drive UP — Tous droits réservés.
        </footer>
      </div>
    </Router>
  );
}

export default App;
