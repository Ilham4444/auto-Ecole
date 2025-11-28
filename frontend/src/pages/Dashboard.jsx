 import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://127.0.0.1:8000/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
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
    <>
      {/* ======== PARTIE 1 : TABLEAU DE BORD ========= */}
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

        <h4>Bienvenue {user.nom} {user.prenom}</h4>

        <div className="row mt-4">
          {/* --- Carte CODE DE LA ROUTE --- */}
          <div className="col-md-4 mb-4">
            <div className="dashboard-card p-3">
              <h5>Code de la Route</h5>
              <p>Progression : {user.cours_code || 0}/20 heures</p>
              <div className="progress mb-2">
                <div className="progress-bar" style={{ width: `${(user.cours_code || 0) * 5}%` }}></div>
              </div>
              <small>Examen : {user.examen_code ? "Réussi" : "Non passé"}</small>
            </div>
          </div>

          {/* --- Carte CONDUITE --- */}
          <div className="col-md-4 mb-4">
            <div className="dashboard-card p-3">
              <h5>Conduite Pratique</h5>
              <p>Progression : {user.cours_conduite || 0}/30 heures</p>

              <div className="progress mb-2">
                <div
                  className="progress-bar"
                  style={{ width: `${((user.cours_conduite || 0) / 30) * 100}%` }}
                ></div>
              </div>

              <small>Heures restantes : {30 - (user.cours_conduite || 0)}h</small>
            </div>
          </div>

          {/* --- Carte SOLDE --- */}
          <div className="col-md-4 mb-4">
            <div className="dashboard-card p-3 position-relative">
              <button
                className="btn btn-sm btn-primary position-absolute"
                style={{ top: "10px", right: "10px" }}
                onClick={() => navigate("/paiement")}
              >
                💳 Payer
              </button>

              <h5>Solde Restant</h5>

              <p>Payé : {user.total_paye || 0} Dh</p>

              <div className="progress mb-2">
                <div
                  className="progress-bar"
                  style={{ width: `${(user.total_paye || 0) / (user.total_a_payer || 1) * 100}%` }}
                ></div>
              </div>

              <small>Reste à payer : {(user.total_a_payer || 0) - (user.total_paye || 0)} Dh</small>
            </div>
          </div>
        </div>
      </div>

      {/* ======== PARTIE 2 : ONGLET RESERVATION / PAIEMENT / PROFIL ========= */}
      <div className="mt-5">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className="nav-link active"
              data-bs-toggle="tab"
              data-bs-target="#reservations"
            >
              Réservations
            </button>
          </li>

          <li className="nav-item">
            <button
              className="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#paiements"
            >
              Paiements
            </button>
          </li>

          <li className="nav-item">
            <button
              className="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#profil"
            >
              Mon Profil
            </button>
          </li>
        </ul>

        <div className="tab-content p-3 border border-top-0">
          {/* ================== RÉSERVATIONS ================== */}
          <div className="tab-pane fade show active" id="reservations">
            <h4>Mes Réservations</h4>

            {user.reservations && user.reservations.length > 0 ? (
              user.reservations.map((r) => (
                <div className="card p-3 mt-3" key={r.id}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>{r.type}</h5>
                      <span className="badge bg-primary">{r.status}</span>

                      <p className="mt-2">{r.permis}</p>
                      <small>
                        📅 {r.date} à {r.time}
                      </small>
                    </div>

                    <button className="btn btn-outline-danger">
                      🗑 Annuler
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Aucune réservation</p>
            )}
          </div>

          {/* ================== PAIEMENTS ================== */}
          <div className="tab-pane fade" id="paiements">
            <h4>Historique des Paiements</h4>

            {user.paiements && user.paiements.length > 0 ? (
              user.paiements.map((p) => (
                <div className="card p-3 mt-3" key={p.id}>
                  <h5>{p.montant} Dh</h5>
                  <p>📅 {p.date}</p>
                  <span className="badge bg-success">{p.status}</span>

                  <button className="btn btn-sm btn-secondary mt-2">
                    📄 Télécharger Reçu
                  </button>
                </div>
              ))
            ) : (
              <p>Aucun paiement trouvé.</p>
            )}
          </div>

          {/* ================== PROFIL ================== */}
          <div className="tab-pane fade" id="profil">
            <h4>Mon Profil</h4>

            <p><strong>Nom :</strong> {user.nom} {user.prenom}</p>
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>Téléphone :</strong> {user.telephone}</p>
            <p><strong>Catégorie du permis :</strong> {user.categorie_permis}</p>

            <button className="btn btn-primary mt-2">
              ✏ Modifier les informations
            </button>

            <h5 className="mt-4">Téléchargements</h5>

            <button className="btn btn-outline-secondary w-100 mt-2">
              📄 Reçu d’inscription
            </button>
            <button className="btn btn-outline-secondary w-100 mt-2">
              🧾 Reçu des paiements
            </button>

            {user.cours_completes &&
            user.paiements_completes &&
            user.examen_reussi ? (
              <button className="btn btn-success w-100 mt-3">
                🎉 Télécharger Certificat de Réussite
              </button>
            ) : (
              <p className="text-danger mt-3">
                ⚠ Vous devez terminer tous les cours, tous les paiements et réussir l'examen.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
