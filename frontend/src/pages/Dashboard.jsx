import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://127.0.0.1:8000/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    })
    .then(res => {
      setUser(res.data.user);
    })
    .catch(() => {
      setUser(null);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/compte");
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="dashboard-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tableau de Bord</h2>

        <div>
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => navigate("/")}
          >
            🏠 Accueil
          </button>

          <button className="btn btn-outline-danger" onClick={handleLogout}>
            👤 Se déconnecter
          </button>
        </div>
      </div>

      <h4>Bienvenue {user.nom}</h4>

      <div className="row mt-4">

        {/* --- Carte CODE DE LA ROUTE --- */}
        <div className="col-md-4 mb-4">
          <div className="dashboard-card p-3">
            <h5>Code de la Route</h5>
            <p>Progression : 0/20 heures</p>
            <div className="progress mb-2">
              <div className="progress-bar" style={{ width: "0%" }}></div>
            </div>
            <small>Examen : Non passé</small>
          </div>
        </div>

        {/* --- Carte CONDUITE --- */}
        <div className="col-md-4 mb-4">
          <div className="dashboard-card p-3">
            <h5>Conduite Pratique</h5>
            <p>Progression : 0/30 heures</p>
            <div className="progress mb-2">
              <div className="progress-bar" style={{ width: "0%" }}></div>
            </div>
            <small>Heures restantes : 30h</small>
          </div>
        </div>

        {/* --- Carte SOLDE --- */}
        <div className="col-md-4 mb-4">
          <div className="dashboard-card p-3 position-relative">

            {/* BOUTON PAIEMENT EN HAUT À DROITE */}
            <button
              className="btn btn-sm btn-primary position-absolute"
              style={{ top: "10px", right: "10px" }}
              onClick={() => navigate("/paiement")}
            >
              💳 Payer
            </button>

            <h5>Solde Restant</h5>
            <p>Payé : 0 Dh</p>

            <div className="progress mb-2">
              <div className="progress-bar" style={{ width: "0%" }}></div>
            </div>

            <small>Reste à payer : 0 Dh</small>
          </div>
        </div>
      </div>
    </div>
  );
}
