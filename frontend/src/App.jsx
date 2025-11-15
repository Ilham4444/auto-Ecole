import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Header from "./components/Header";
import "./assets/css/style.scss";

// Pages
import Home from "./pages/Home";
import Permis from "./pages/Permis";
import Examens from "./pages/Examens";
import Moniteurs from "./pages/Moniteurs";
import Apropos from "./pages/Apropos";
import Compte from "./pages/Compte";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // fermer avec Esc
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && location.pathname === "/compte") {
        navigate("/");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [location.pathname, navigate]);

  // handler de fermeture pour le fond
  const handleOverlayClick = () => {
    navigate("/");
  };

  return (
    <>
      {/* Header */}
      <Header />

      {/* Contenu principal */}
      <main className="container my-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/permis" element={<Permis />} />
          <Route path="/examens" element={<Examens />} />
          <Route path="/moniteurs" element={<Moniteurs />} />
          <Route path="/apropos" element={<Apropos />} />

          {/* on garde Home derrière quand l'URL est /compte */}
          <Route path="/compte" element={<Home />} />
        </Routes>
      </main>

      {/* Overlay affiché par-dessus quand URL = /compte */}
      {location.pathname === "/compte" && (
        <div
          onClick={handleOverlayClick} // clic sur le fond ferme
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(3px)",
            zIndex: 9999,
            cursor: "pointer",
            padding: "20px",
          }}
        >
          {/* boîte qui contient le formulaire — empêche la fermeture si on clique dedans */}
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{
              width: "100%",
              maxWidth: 520,
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
              padding: "20px",
              cursor: "auto",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <Compte />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-3 bg-light text-muted border-top">
        © 2025 Drive UP — Tous droits réservés.
      </footer>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
