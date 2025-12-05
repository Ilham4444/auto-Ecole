import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "../assets/css/UnifiedDashboard.css";
import "../assets/css/CandidateDashboard.css";

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

  // État pour l'onglet actif (pour les candidats)
  const [activeTab, setActiveTab] = useState("reservations");

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
            {/* Stats Cards */}
            <div className="candidate-stats-grid">
              {/* Code de la Route Card */}
              <div className="candidate-stat-card">
                <div className="candidate-stat-header">
                  <h3 className="candidate-stat-title">Code de la Route</h3>
                  <div className="candidate-stat-icon">📘</div>
                </div>
                <div className="candidate-stat-content">
                  <p className="candidate-stat-label">Progression : {user.cours_code}/20 heures</p>
                  <div className="candidate-progress-bar">
                    <div
                      className="candidate-progress-fill"
                      style={{ width: `${user.cours_code * 5}%` }}
                    ></div>
                  </div>
                  <small className="candidate-stat-footer">
                    Examen : {user.examen_code ? "✅ Réussi" : "❌ Non passé"}
                  </small>
                </div>
              </div>

              {/* Conduite Pratique Card */}
              <div className="candidate-stat-card">
                <div className="candidate-stat-header">
                  <h3 className="candidate-stat-title">Conduite Pratique</h3>
                  <div className="candidate-stat-icon">🚗</div>
                </div>
                <div className="candidate-stat-content">
                  <p className="candidate-stat-label">Progression : {user.cours_conduite}/30 heures</p>
                  <div className="candidate-progress-bar">
                    <div
                      className="candidate-progress-fill"
                      style={{
                        width: `${(user.cours_conduite / 30) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <small className="candidate-stat-footer">
                    Heures restantes : {30 - user.cours_conduite}h
                  </small>
                </div>
              </div>

              {/* Solde Restant Card */}
              <div className="candidate-stat-card">
                <button
                  className="candidate-pay-button"
                  onClick={() => {
                    console.log("Navigation vers paiement");
                    navigate("/paiement");
                  }}
                >
                  💳 Payer
                </button>
                <div className="candidate-stat-header">
                  <h3 className="candidate-stat-title">Solde Restant</h3>
                  <div className="candidate-stat-icon">💰</div>
                </div>
                <div className="candidate-stat-content">
                  <p className="candidate-stat-label">Payé : {user.total_paye || 0} Dh</p>
                  <div className="candidate-progress-bar">
                    <div
                      className="candidate-progress-fill"
                      style={{
                        width: `${(user.total_paye / (user.total_a_payer || 1)) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <small className="candidate-stat-footer">
                    Reste à payer : {(user.total_a_payer || 0) - (user.total_paye || 0)} Dh
                  </small>
                </div>
              </div>
            </div>

            {/* Onglets */}
            <div className="candidate-tabs-container mt-5">
              <div className="candidate-tabs-nav">
                <button
                  className={`candidate-tab-button ${activeTab === 'reservations' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reservations')}
                >
                  📅 Réservations
                </button>
                <button
                  className={`candidate-tab-button ${activeTab === 'paiements' ? 'active' : ''}`}
                  onClick={() => setActiveTab('paiements')}
                >
                  💳 Paiements
                </button>
                <button
                  className={`candidate-tab-button ${activeTab === 'profil' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profil')}
                >
                  👤 Mon Profil
                </button>
              </div>

              <div className="tab-content candidate-tab-content">
                {/* TAB RÉSERVATIONS */}
                <div className={`candidate-tab-pane ${activeTab === 'reservations' ? 'active' : ''}`}>
                  <div className="reservations-header">
                    <h4 className="reservations-title">Mes Réservations</h4>
                  </div>

                  {user.moniteur_assigne && (
                    <div className="assigned-monitor-card">
                      <div className="assigned-monitor-icon">👨‍🏫</div>
                      <div className="assigned-monitor-info">
                        <strong>Moniteur Assigné : {user.moniteur_assigne.nom} {user.moniteur_assigne.prenom}</strong>
                        <p>📞 Tél: {user.moniteur_assigne.telephone}</p>
                        <span className="assigned-monitor-status">Statut: Accepté</span>
                      </div>
                    </div>
                  )}

                  {user.reservations && user.reservations.length > 0 ? (
                    user.reservations.map((r) => (
                      <div className="reservation-card" key={r.id}>
                        <div className="reservation-header">
                          <div>
                            <h5 className="reservation-type">{r.type}</h5>
                            <span className={`reservation-badge ${r.status}`}>
                              {r.status === 'confirmed' ? '✅ Confirmé' :
                                r.status === 'pending' ? '⏳ En attente' : '❌ Annulé'}
                            </span>
                          </div>
                        </div>
                        <p className="reservation-details">
                          <strong>Permis:</strong> {r.permis?.title || "Permis"}
                        </p>
                        <div className="reservation-date">
                          📅 {r.date} à {r.time}
                        </div>
                        <div className="reservation-actions">
                          <button
                            className="reservation-cancel-btn"
                            onClick={async () => {
                              if (window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
                                try {
                                  const api = (await import("../api.jsx")).default;
                                  await api.delete(`/reservations/${r.id}`);

                                  toast.success('Réservation annulée avec succès');
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
                    <div className="empty-state">
                      <div className="empty-state-icon">📅</div>
                      <h4>Aucune réservation</h4>
                      <p>Vous n'avez pas encore de réservations</p>
                    </div>
                  )}
                </div>

                {/* Paiements */}
                <div className={`candidate-tab-pane ${activeTab === 'paiements' ? 'active' : ''}`}>
                  <h4 className="profile-section-title">Historique des Paiements</h4>

                  {user.paiements && user.paiements.length > 0 ? (
                    user.paiements.map((p) => (
                      <div className="payment-card" key={p.id}>
                        <div className="payment-info">
                          <h5 className="payment-amount">{p.montant} Dh</h5>
                          <div className="payment-date">
                            📅 {p.date}
                          </div>
                          <span className="payment-status">{p.status}</span>
                        </div>
                        <button
                          className="payment-download-btn"
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
                    <div className="empty-state">
                      <div className="empty-state-icon">💳</div>
                      <h4>Aucun paiement</h4>
                      <p>Vous n'avez effectué aucun paiement pour le moment</p>
                    </div>
                  )}
                </div>

                {/* Profil */}
                <div className={`candidate-tab-pane ${activeTab === 'profil' ? 'active' : ''}`}>
                  <h4 className="profile-section-title">Mon Profil</h4>

                  <div className="profile-info-card">
                    <div className="profile-card-header">
                      <span>👤</span> Informations Personnelles
                    </div>
                    <div className="profile-info-grid">
                      <div className="profile-info-item">
                        <strong>Nom :</strong>
                        <span> {user.nom}</span>
                      </div>
                      <div className="profile-info-item">
                        <strong>Prénom :</strong>
                        <span> {user.prenom}</span>
                      </div>
                      <div className="profile-info-item">
                        <strong>Email :</strong>
                        <span> {user.email}</span>
                      </div>
                      <div className="profile-info-item">
                        <strong>Téléphone :</strong>
                        <span> {user.telephone}</span>
                      </div>
                      <div className="profile-info-item">
                        <strong>Date de naissance :</strong>
                        <span> {user.date_naissance ? new Date(user.date_naissance).toLocaleDateString('fr-FR') : 'Non renseignée'}</span>
                      </div>
                      <div className="profile-info-item">
                        <strong>Carte Nationale (CIN) :</strong>
                        <span> {user.carte_nationale || 'Non renseignée'}</span>
                      </div>
                      <div className="profile-info-item">
                        <strong>Adresse :</strong>
                        <span> {user.adresse || 'Non renseignée'}</span>
                      </div>
                      <div className="profile-info-item">
                        <strong>Méthode de paiement :</strong>
                        <span> {user.methode_paiement ? user.methode_paiement.charAt(0).toUpperCase() + user.methode_paiement.slice(1) : 'Non renseignée'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="profile-info-card">
                    <div className="profile-card-header">
                      <span>🚗</span> Formation
                    </div>
                    <div className="profile-info-item">
                      <strong>Catégorie du permis :</strong>
                      <span> Permis {user.categorie_permis}</span>
                    </div>
                  </div>

                  <button className="profile-edit-btn" onClick={handleEditClick}>
                    ✏ Modifier les informations
                  </button>

                  <div className="download-section">
                    <h5 className="download-section-title">Téléchargements</h5>
                    <button
                      className="download-btn"
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
                      className="download-btn"
                      onClick={() => setActiveTab('paiements')}
                    >
                      🧾 Reçu des paiements
                    </button>
                    {user.cours_completes && user.paiements_completes && user.examen_reussi ? (
                      <button
                        className="download-btn success"
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
