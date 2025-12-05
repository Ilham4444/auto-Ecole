import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "../assets/css/UnifiedDashboard.css";

export default function Dashboard() {
  const { user: contextUser, logoutUser } = useUser();
  const [user, setUser] = useState(contextUser);
  const [loading, setLoading] = useState(!contextUser);
  const navigate = useNavigate();

  // État pour la modale de modification de profil
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
  });

  // États de recherche pour moniteur
  const [searchStudent, setSearchStudent] = useState("");
  const [searchReservation, setSearchReservation] = useState("");

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
          toast.error("Session expirée. Veuillez vous reconnecter.");
          logoutUser();
          navigate("/compte");
        } else {
          toast.error("Erreur de chargement des données. Veuillez réessayer.");
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
        toast.success("Profil mis à jour avec succès !");
        // Mettre à jour l'utilisateur localement avec les nouvelles données
        setUser({ ...user, ...response.data.user });
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Erreur mise à jour profil", error);
      toast.error("Erreur lors de la mise à jour du profil.");
    }
  };
  const handleReservationStatus = async (id, status) => {
    try {
      const api = (await import("../api.jsx")).default;
      const endpoint = status === 'confirmed' ? 'confirm' : 'cancel';
      await api.put(`/reservations/${id}/${endpoint}`);

      toast.success(`Réservation ${status === 'confirmed' ? 'confirmée' : 'refusée'} avec succès !`);

      // Mettre à jour l'état local
      setUser(prevUser => ({
        ...prevUser,
        reservations: prevUser.reservations.map(r =>
          r.id === id ? { ...r, status: status } : r
        )
      }));
    } catch (error) {
      console.error("Erreur mise à jour réservation", error);
      toast.error("Erreur lors de la mise à jour de la réservation.");
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
      <div className="unified-dashboard-container">
        <div className="d-flex justify-content-between align-items-center mb-4 unified-dashboard-header">
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

                    style={{ top: "10px", right: "10px", zIndex: 10 }}
                    onClick={() => {
                      console.log("Navigation vers paiement");
                      navigate("/paiement");
                    }}

                  >
                    💳 Payer
                  </button>
                  <h5>Solde Restant</h5>
                  <p>Payé : {user.total_paye || 0} Dh</p>
                  <div className="progress mb-2">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${(user.total_paye / (user.total_a_payer || 1)) * 100
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

                <div className="tab-pane fade show active" id="reservations">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Mes Réservations</h4>
                  </div>

                  {user.moniteur_assigne && (
                    <div className="alert alert-info d-flex align-items-center">
                      <i className="bi bi-person-badge me-2 fs-4"></i>
                      <div>
                        <strong>Moniteur Assigné :</strong> {user.moniteur_assigne.nom} {user.moniteur_assigne.prenom}
                        <br />
                        <small>Tél: {user.moniteur_assigne.telephone}</small>
                      </div>
                    </div>
                  )}


                  {user.reservations && user.reservations.length > 0 ? (
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
                              if (window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
                                try {
                                  const api = (await import("../api.jsx")).default;
                                  await api.delete(`/reservations/${r.id}`);

                                  toast.success('Réservation annulée avec succès');
                                  // Mettre à jour l'état local au lieu de recharger la page
                                  setUser({
                                    ...user,
                                    reservations: user.reservations.filter(res => res.id !== r.id)
                                  });

                                } catch (error) {
                                  console.error('Erreur:', error);
                                  toast.error("Erreur lors de l'annulation");
                                }
                              }
                            }}
                          >
                            🗑 Annuler
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

                  {user.paiements && user.paiements.length > 0 ? (
                    user.paiements.map((p) => (
                      <div className="card p-3 mt-3" key={p.id}>
                        <h5>{p.montant} Dh</h5>
                        <p>📅 {p.date}</p>
                        <span className="badge bg-success">{p.status}</span>
                        <button
                          className="btn btn-sm btn-secondary mt-2"
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem("token");
                              if (!token) {
                                toast.warning("Vous devez être connecté pour télécharger ce document.");
                                return;
                              }

                              const response = await axios.get(`http://127.0.0.1:8000/api/paiements/${p.id}/recu`, {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                  Accept: "application/pdf",
                                },
                                responseType: 'blob',
                              });

                              const url = window.URL.createObjectURL(new Blob([response.data]));
                              const link = document.createElement('a');
                              link.href = url;
                              link.setAttribute('download', `recu_paiement_${p.id}.pdf`);
                              document.body.appendChild(link);
                              link.click();
                              link.remove();
                              window.URL.revokeObjectURL(url);
                            } catch (error) {
                              console.error("Erreur téléchargement:", error);
                              toast.error(`Erreur lors du téléchargement: ${error.message}`);
                            }
                          }}
                        >
                          📄 Télécharger Reçu
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>Aucun paiement trouvé.</p>
                  )}
                </div>

                {/* Profil */}
                <div className="tab-pane fade" id="profil">
                  <h4>Mon Profil</h4>

                  <div className="card p-3 mb-3">
                    <h5 className="text-primary mb-3">👤 Informations Personnelles</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Nom :</strong> {user.nom}</p>
                        <p><strong>Prénom :</strong> {user.prenom}</p>
                        <p><strong>Email :</strong> {user.email}</p>
                        <p><strong>Téléphone :</strong> {user.telephone}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Date de naissance :</strong> {user.date_naissance ? new Date(user.date_naissance).toLocaleDateString('fr-FR') : 'Non renseignée'}</p>
                        <p><strong>Carte Nationale (CIN) :</strong> {user.carte_nationale || 'Non renseignée'}</p>
                        <p><strong>Adresse :</strong> {user.adresse || 'Non renseignée'}</p>
                        <p><strong>Méthode de paiement :</strong> {user.methode_paiement ? user.methode_paiement.charAt(0).toUpperCase() + user.methode_paiement.slice(1) : 'Non renseignée'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="card p-3 mb-3">
                    <h5 className="text-primary mb-3">🚗 Formation</h5>
                    <p><strong>Catégorie du permis :</strong> Permis {user.categorie_permis}</p>
                  </div>

                  <button className="btn btn-primary mt-2" onClick={handleEditClick}>
                    ✏ Modifier les informations
                  </button>

                  <h5 className="mt-4">Téléchargements</h5>
                  <button
                    className="btn btn-outline-secondary w-100 mt-2"
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("token");
                        if (!token) {
                          alert("Vous devez être connecté pour télécharger ce document.");
                          return;
                        }

                        const response = await axios.get("http://127.0.0.1:8000/api/pdf/recu-inscription", {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/pdf",
                          },
                          responseType: 'blob',
                        });

                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'recu_inscription.pdf');
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        console.error("Erreur téléchargement:", error);
                        alert(`Erreur lors du téléchargement: ${error.message}`);
                      }
                    }}
                  >
                    📄 Reçu d'inscription
                  </button>
                  <button
                    className="btn btn-outline-secondary w-100 mt-2"
                    onClick={() => {
                      const tabButton = document.querySelector('button[data-bs-target="#paiements"]');
                      if (tabButton) tabButton.click();
                    }}
                  >
                    🧾 Reçu des paiements
                  </button>
                  {user.cours_completes && user.paiements_completes && user.examen_reussi ? (
                    <button
                      className="btn btn-success w-100 mt-3"
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("token");
                          if (!token) {
                            alert("Vous devez être connecté pour télécharger ce document.");
                            return;
                          }

                          const response = await axios.get("http://127.0.0.1:8000/api/pdf/certificat", {
                            headers: {
                              Authorization: `Bearer ${token}`,
                              Accept: "application/pdf",
                            },
                            responseType: 'blob',
                          });

                          const url = window.URL.createObjectURL(new Blob([response.data]));
                          const link = document.createElement('a');
                          link.href = url;
                          link.setAttribute('download', 'certificat_reussite.pdf');
                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                          window.URL.revokeObjectURL(url);
                        } catch (error) {
                          console.error("Erreur téléchargement:", error);
                          alert(`Erreur lors du téléchargement: ${error.message}`);
                        }
                      }}
                    >
                      🎉 Télécharger Certificat de Réussite
                    </button>
                  ) : (
                    <p className="text-danger mt-3">⚠ Vous devez terminer tous les cours, tous les paiements et réussir l'examen.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}


        {/* ================== VUE MONITEUR ================== */}
        {user.role === 'moniteur' && (() => {
          // Fonctions de filtrage pour moniteur
          const filteredStudents = (user.candidates || []).filter(c =>
            (c.nom && c.nom.toLowerCase().includes(searchStudent.toLowerCase())) ||
            (c.prenom && c.prenom.toLowerCase().includes(searchStudent.toLowerCase())) ||
            (c.email && c.email.toLowerCase().includes(searchStudent.toLowerCase())) ||
            (c.categorie_permis && c.categorie_permis.toLowerCase().includes(searchStudent.toLowerCase()))
          );

          const filteredReservations = (user.reservations || []).filter(r =>
            (r.student_name && r.student_name.toLowerCase().includes(searchReservation.toLowerCase())) ||
            (r.type && r.type.toLowerCase().includes(searchReservation.toLowerCase()))
          );

          return (
            <>

              {/* Cartes de statistiques colorées */}
              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-icon">👥</div>
                  <div className="stat-label">Mes Élèves</div>
                  <div className="stat-value">{user.candidates ? user.candidates.length : 0}</div>
                </div>
                <div className="stat-card success">
                  <div className="stat-icon">✅</div>
                  <div className="stat-label">Réservations Confirmées</div>
                  <div className="stat-value">
                    {user.reservations ? user.reservations.filter(r => r.status === 'confirmed').length : 0}
                  </div>
                </div>
                <div className="stat-card warning">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-label">Réservations en Attente</div>
                  <div className="stat-value">
                    {user.reservations ? user.reservations.filter(r => r.status === 'pending').length : 0}
                  </div>
                </div>
              </div>

              {/* Section: Mes Élèves - Tableau */}
              <div className="dashboard-section mt-4">
                <h3>👥 Mes Élèves Assignés</h3>
                {user.candidates && user.candidates.length > 0 ? (
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Permis</th>
                        <th>Adresse</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((candidate) => (
                        <tr key={candidate.id}>
                          <td>{candidate.nom} {candidate.prenom}</td>
                          <td>{candidate.email}</td>
                          <td>{candidate.telephone}</td>
                          <td>
                            <span className="status-badge completed">{candidate.categorie_permis}</span>
                          </td>
                          <td>{candidate.adresse}</td>
                          <td>
                            <span className="status-badge confirmed">Assigné</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="alert alert-info">
                    <h4>Aucun élève assigné</h4>
                    <p>Vous n'avez pas encore d'élèves assignés par l'administrateur.</p>
                  </div>
                )}
              </div>

              {/* Section: Gestion des Réservations - Tableau */}
              <div className="dashboard-section mt-4">
                <h3>📅 Gestion des Réservations</h3>
                {user.reservations && user.reservations.length > 0 ? (
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Élève</th>
                        <th>Permis</th>
                        <th>Date</th>
                        <th>Heure</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.reservations.map((r) => (
                        <tr key={r.id}>
                          <td>{r.type}</td>
                          <td>{r.student_name || "Élève"}</td>
                          <td>{r.permis?.title || 'Permis'}</td>
                          <td><small>{r.date}</small></td>
                          <td>{r.time}</td>
                          <td>
                            <span className={`status-badge ${r.status === 'confirmed' ? 'confirmed' :
                              r.status === 'rejected' ? 'cancelled' :
                                'pending'
                              }`}>
                              {r.status === 'confirmed' ? 'Confirmé' :
                                r.status === 'rejected' ? 'Refusé' :
                                  'En attente'}
                            </span>
                          </td>
                          <td>
                            {r.status === 'pending' && (
                              <>
                                <button
                                  className="action-btn success"
                                  onClick={() => handleReservationStatus(r.id, 'confirmed')}
                                >
                                  ✅ Confirmer
                                </button>
                                <button
                                  className="action-btn danger"
                                  onClick={() => handleReservationStatus(r.id, 'rejected')}
                                >
                                  ❌ Annuler
                                </button>
                              </>
                            )}
                            {r.status === 'confirmed' && (
                              <button
                                className="action-btn danger"
                                onClick={() => handleReservationStatus(r.id, 'rejected')}
                              >
                                Annuler confirmation
                              </button>
                            )}
                            {r.status === 'rejected' && (
                              <button
                                className="action-btn success"
                                onClick={() => handleReservationStatus(r.id, 'confirmed')}
                              >
                                Rétablir
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Aucune réservation trouvée.</p>
                )}
              </div>
            </>
          );
        })()}
      </div>

      {/* ================== MODAL EDIT PROFIL ================== */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier mes informations</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={editFormData.nom}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                name="prenom"
                value={editFormData.prenom}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleEditChange}
                disabled
              />
              <Form.Text className="text-muted">
                L'email ne peut pas être modifié pour des raisons de sécurité.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="text"
                name="telephone"
                value={editFormData.telephone}
                onChange={handleEditChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Enregistrer les modifications
          </Button>
        </Modal.Footer>
      </Modal>


    </>
  );
}
