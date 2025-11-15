import React, { useEffect } from "react";
import {BrowserRouter as Router,Routes, Route,useLocation,useNavigate,} from "react-router-dom";

import Header from "./components/Header";
import "./assets/css/style.scss";

// Pages
import Home from "./pages/Home";
import Permis from "./pages/Permis";
import Examens from "./pages/Examens";
import Moniteurs from "./pages/Moniteurs";
import Apropos from "./pages/Apropos";
import Compte from "./pages/Compte";
import Register from "./pages/Register";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // fermer avec Esc
  useEffect(() => {
    function onKey(e) {
      if ((e.key === "Escape") &&
        (location.pathname === "/compte" || location.pathname === "/register")) {
        navigate("/");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [location.pathname, navigate]);

  // clic en dehors = fermer
  const handleOverlayClick = () => {
    navigate("/");
  };

  const isAuthModal =
    location.pathname === "/compte" || location.pathname === "/register";

  return (
    <>
      <Header />

      <main className="container my-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/permis" element={<Permis />} />
          <Route path="/examens" element={<Examens />} />
          <Route path="/moniteurs" element={<Moniteurs />} />
          <Route path="/apropos" element={<Apropos />} />

          {/* les 2 modals gardent Home derrière */}
          <Route path="/compte" element={<Home />} />
          <Route path="/register" element={<Home />} />
        </Routes>
      </main>

      {/* Overlay global */}
      {isAuthModal && (
        <div
          onClick={handleOverlayClick}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            backdropFilter: "blur(3px)",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 520,
              background: "#fff",
              borderRadius: 12,
              padding: "20px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
              overflowY: "auto",
              maxHeight: "90vh",
            }}
          >
            {location.pathname === "/compte" && <Compte />}
            {location.pathname === "/register" && <Register />}
          </div>
        </div>
      )}

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
