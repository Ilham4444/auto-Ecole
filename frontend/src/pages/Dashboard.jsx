import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { Modal, Button, Form } from "react-bootstrap";

export default function Dashboard() {
  const { user: contextUser, logoutUser } = useUser();
  const [user, setUser] = useState(contextUser);
  const [loading, setLoading] = useState(!contextUser);
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
  });

  useEffect(() => {
    if (!contextUser) return;

    const fetchData = async () => {
      try {
        const api = (await import("../api.jsx")).default;

        const res = await api.get("/dashboard");

        const userData = {
          ...res.data.user,
          reservations: res.data.reservations || [],
          paiements: res.data.paiements || [],
          cours_code: res.data.progression?.cours?.fait || 0,
          cours_conduite: res.data.progression?.conduite?.fait || 0,
          candidates: res.data.candidates || [],
        };

        setUser(userData);
        setLoading(false);
      } catch (err) {
        console.error("Erreur chargement dashboard", err);
        setLoading(false);

        if (err.response && err.response.status === 401) {
          alert("Session expirée. Veuillez vous reconnecter.");
          logoutUser();
          navigate("/compte");
        } else {
          alert("Erreur de chargement des données.");
        }
      }
    };

    fetchData();
  }, [contextUser, navigate, logoutUser]);

  const handleLogout = () => {
    logoutUser();
    navigate("/compte");
  };

  const handleEditClick = () => {
    setEditFormData({
      nom: user.nom || "",
      prenom: user.prenom || "",
      telephone: user.telephone || "",
      email: user.email || "",
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async () => {
    try {
      const api = (await import("../api.jsx")).default;

      const response = await api.put("/profil", editFormData);

      if (response.data.status) {
        alert("✅ Profil mis à jour avec succès !");
        setUser({ ...user, ...response.data.user });
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Erreur mise à jour profil", error);
      alert("❌ Erreur lors de la mise à jour du profil.");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Chargement...</p>
      </div>
    );

  if (!user)
    return (
      <div className="text-center mt-5">
        <p>Erreur de chargement des données. Veuillez vous reconnecter.</p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/compte")}
        >
          Se connecter
        </button>
      </div>
    );

  return (
    <>
      <div className="dashboard-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Tableau de Bord {user.role === "moniteur" ? "(Moniteur)" : ""}</h2>
          <div>
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => navigate("/")}
            >
              🏠 Accueil
            </button>
          </div>
        </div>

        <h4>Bienvenue {user.nom} {user.prenom}</h4>

        {/* ================== VUE CANDIDAT ================== */}
        {user.role === "candidate" && (
          <>
            <div className="row mt-4">
              <div className="col-md-4 mb-4">
                <div className="dashboard-card p-3">
                  <h5>Code de la Route</h5>
                  <p>Progression : {user.cours_code}/20 heures</p>
                  <div className="progress mb-2">
                    <div
                      className="progress-bar"
                      style={{ width: `${user.cours_code * 5}%` }}
                    ></div>
                  </div>
                  <small>
                    Examen : {user.examen_code ? "Réussi" : "Non passé"}
                  </small>
                </div>
              </div>

              <div className="col-md-4 mb-4">
                <div className="dashboard-card p-3">
                  <h5>Conduite Pratique</h5>
                  <p>Progression : {user.cours_conduite}/30 heures</p>
                  <div className="progress mb-2">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${(user.cours_conduite / 30) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <small>
                    Heures restantes : {30 - user.cours_conduite}h
                  </small>
                </div>
              </div>

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
                      style={{
                        width: `${
                          (user.total_paye / (user.total_a_payer || 1)) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <small>
                    Reste à payer :{" "}
                    {(user.total_a_payer || 0) - (user.total_paye || 0)} Dh
                  </small>
                </div>
              </div>
            </div>

            {/* Onglets */}
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
                {/* Reservations */}
                <div
                  className="tab-pane fade show active"
                  id="reservations"
                >
                  <h4>Mes Réservations</h4>

                  {user.reservations.length > 0 ? (
                    user.reservations.map((r) => (
                      <div className="card p-3 mt-3" key={r.id}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h5>{r.type}</h5>
                            <span className="badge bg-primary">
                              {r.status}
                            </span>
                            <p className="mt-2">
                              {r.permis?.title || "Permis"}
                            </p>
                            <small>📅 {r.date} à {r.time}</small>
                          </div>

                          <button
                            className="btn btn-outline-danger"
                            onClick={async () => {
                              if (window.confirm("Confirmer annulation ?")) {
                                try {
                                  const api = (await import("../api.jsx")).default;
                                  await api.delete(`/reservations/${r.id}`);
                                  alert("Réservation annulée");
                                  window.location.reload();
                                } catch (error) {
                                  alert("Erreur annulation");
                                }
                              }
                            }}
                          >
                            ❌ Annuler
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Aucune réservation</p>
                  )}
                </div>

                {/* Paiements */}
                <div className="tab-pane fade" id="paiements">
                  <h4>Historique des Paiements</h4>

                  {user.paiements.length > 0 ? (
                    user.paiements.map((p) => (
                      <div className="card p-3 mt-3" key={p.id}>
                        <h5>{p.montant} Dh</h5>
                        <p>📅 {p.date}</p>
                        <span className="badge bg-success">{p.status}</span>
                      </div>
                    ))
                  ) : (
                    <p>Aucun paiement</p>
                  )}
                </div>

                {/* Profil */}
                <div className="tab-pane fade" id="profil">
                  <h4>Mon Profil</h4>

                  <button
                    className="btn btn-primary mt-3"
                    onClick={handleEditClick}
                  >
                    ✏ Modifier mon profil
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ================== MODAL EDIT PROFIL ================== */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier Profil</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                name="nom"
                value={editFormData.nom}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                name="prenom"
                value={editFormData.prenom}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                name="telephone"
                value={editFormData.telephone}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                value={editFormData.email}
                onChange={handleEditChange}
                type="email"
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
