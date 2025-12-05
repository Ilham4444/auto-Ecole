import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Form, Badge, Alert } from 'react-bootstrap';
import { toast } from "react-toastify";
import "../assets/css/AdminDashboard.css";

export default function AdminDashboard() {
    const [candidates, setCandidates] = useState([]);
    const [monitors, setMonitors] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [selectedMonitor, setSelectedMonitor] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/compte");
            return;
        }
        loadData();
    }, [navigate]);

    const loadData = async () => {
        try {
            const token = localStorage.getItem("token");
            const api = (await import('../api.jsx')).default;

            const [candidatesRes, monitorsRes, assignmentsRes, reservationsRes] = await Promise.all([
                api.get('/admin/candidates'),
                api.get('/admin/monitors'),
                api.get('/admin/assignments'),
                api.get('/reservations')
            ]);

            setCandidates(candidatesRes.data.candidates || []);
            setMonitors(monitorsRes.data.monitors || []);
            setAssignments(assignmentsRes.data.assignments || []);
            setReservations(reservationsRes.data || []);
            setLoading(false);
        } catch (error) {
            console.error("Erreur chargement données admin", error);
            if (error.response && error.response.status === 403) {
                toast.error("Accès refusé. Vous n'avez pas les droits administrateur.");
                navigate("/");
            } else {
                toast.error("Erreur de chargement des données.");
            }
            setLoading(false);
        }
    };

    const handleAssignClick = (candidate) => {
        setSelectedCandidate(candidate);
        setSelectedMonitor("");
        setShowAssignModal(true);
    };

    const handleAssignSubmit = async () => {
        if (!selectedMonitor) {
            toast.warning("Veuillez sélectionner un moniteur");
            return;
        }

        try {
            const api = (await import('../api.jsx')).default;
            const response = await api.post('/admin/assign', {
                candidat_id: selectedCandidate.id,
                monitor_id: selectedMonitor
            });

            if (response.data.status) {
                toast.success(response.data.message);
                setShowAssignModal(false);
                loadData(); // Recharger les données
            }
        } catch (error) {
            console.error("Erreur assignation", error);
            const errorMsg = error.response?.data?.message || "Erreur lors de l'assignation";
            toast.error(errorMsg);
        }
    };

    const handleUnassign = async (monitorId, candidatId) => {
        try {
            const api = (await import('../api.jsx')).default;
            const response = await api.delete(`/admin/assign/${monitorId}/${candidatId}`);

            if (response.data.status) {
                toast.success(response.data.message);
                loadData(); // Recharger les données
            }
        } catch (error) {
            console.error("Erreur suppression assignation", error);
            toast.error("Erreur lors de la suppression");
        }
    };

    // Filtrer les moniteurs compatibles avec la catégorie du candidat sélectionné
    const getCompatibleMonitors = () => {
        if (!selectedCandidate) return monitors;

        return monitors.filter(monitor => {
            // Si le moniteur n'a pas de spécialité définie, il peut enseigner tous les permis
            if (!monitor.specialite_permis) return true;
            // Sinon, la spécialité doit correspondre
            return monitor.specialite_permis === selectedCandidate.categorie_permis;
        });
    };

    const getCandidateMonitor = (candidate) => {
        if (candidate.moniteur && candidate.moniteur.length > 0) {
            const monitor = candidate.moniteur[0];
            return `${monitor.nom} ${monitor.prenom}`;
        }
        return null;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="ms-3">Chargement...</p>
            </div>
        );
    }

    return (
        <>
            <div className="dashboard-container">
                <div className="dashboard-header d-flex justify-content-between align-items-center">
                    <div>
                        <h2>🔧 Administration</h2>
                        <p>Gestion des Assignations et des Utilisateurs</p>
                    </div>
                    <button className="action-btn primary" onClick={() => navigate("/")}>
                        🏠 Accueil
                    </button>
                </div>

                {/* STATISTIQUES */}
                <div className="stats-grid">
                    <div className="stat-card primary">
                        <div className="stat-icon">👥</div>
                        <div className="stat-label">Candidats Inscrits</div>
                        <div className="stat-value">{candidates.length}</div>
                    </div>
                    <div className="stat-card success">
                        <div className="stat-icon">🚗</div>
                        <div className="stat-label">Moniteurs</div>
                        <div className="stat-value">{monitors.length}</div>
                    </div>
                    <div className="stat-card warning">
                        <div className="stat-icon">📋</div>
                        <div className="stat-label">Assignations</div>
                        <div className="stat-value">{assignments.length}</div>
                    </div>
                    <div className="stat-card danger">
                        <div className="stat-icon">⚠</div>
                        <div className="stat-label">Non Assignés</div>
                        <div className="stat-value">{candidates.filter(c => !getCandidateMonitor(c)).length}</div>
                    </div>
                    <div className="stat-card info">
                        <div className="stat-icon">📅</div>
                        <div className="stat-label">Réservations</div>
                        <div className="stat-value">{reservations.length}</div>
                    </div>
                </div>

                {/* ONGLETS */}
                <div className="dashboard-section mt-4">
                    <ul className="nav nav-tabs mb-4">
                        <li className="nav-item">
                            <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#candidats">
                                👥 Candidats
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#moniteurs">
                                🚗 Moniteurs
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#assignations">
                                📋 Assignations
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#reservations">
                                📅 Réservations
                            </button>
                        </li>
                    </ul>

                    <div className="tab-content">
                        {/* ONGLET CANDIDATS */}
                        <div className="tab-pane fade show active" id="candidats">
                            <h3>Liste des Candidats</h3>
                            {candidates.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">👥</div>
                                    <h4>Aucun candidat</h4>
                                    <p>Aucun candidat n'est inscrit pour le moment.</p>
                                </div>
                            ) : (
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Nom</th>
                                            <th>Email</th>
                                            <th>Téléphone</th>
                                            <th>Permis</th>
                                            <th>Moniteur Assigné</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {candidates.map(candidate => {
                                            const assignedMonitor = getCandidateMonitor(candidate);
                                            return (
                                                <tr key={candidate.id}>
                                                    <td>{candidate.nom} {candidate.prenom}</td>
                                                    <td>{candidate.email}</td>
                                                    <td>{candidate.telephone}</td>
                                                    <td>
                                                        <span className="status-badge completed">{candidate.categorie_permis || 'N/A'}</span>
                                                    </td>
                                                    <td>
                                                        {assignedMonitor ? (
                                                            <span className="status-badge confirmed">{assignedMonitor}</span>
                                                        ) : (
                                                            <span className="status-badge pending">Non assigné</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {!assignedMonitor && (
                                                            <button
                                                                className="action-btn primary"
                                                                onClick={() => handleAssignClick(candidate)}
                                                            >
                                                                ➕ Assigner
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* ONGLET MONITEURS */}
                        <div className="tab-pane fade" id="moniteurs">
                            <h3>Liste des Moniteurs</h3>
                            {monitors.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">🚗</div>
                                    <h4>Aucun moniteur</h4>
                                    <p>Aucun moniteur n'est enregistré.</p>
                                </div>
                            ) : (
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Nom</th>
                                            <th>Email</th>
                                            <th>Téléphone</th>
                                            <th>Spécialité</th>
                                            <th>Nombre d'élèves</th>
                                            <th>Élèves</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {monitors.map(monitor => (
                                            <tr key={monitor.id}>
                                                <td>{monitor.nom} {monitor.prenom}</td>
                                                <td>{monitor.email}</td>
                                                <td>{monitor.telephone}</td>
                                                <td>
                                                    <span className="status-badge completed">
                                                        {monitor.specialite_permis || 'Non définie'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="status-badge confirmed">{monitor.eleves_count || 0}</span>
                                                </td>
                                                <td>
                                                    {monitor.eleves && monitor.eleves.length > 0 ? (
                                                        <small>
                                                            {monitor.eleves.map(e => `${e.nom} ${e.prenom}`).join(', ')}
                                                        </small>
                                                    ) : (
                                                        <small className="text-muted">Aucun élève</small>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* ONGLET ASSIGNATIONS */}
                        <div className="tab-pane fade" id="assignations">
                            <h3>Toutes les Assignations</h3>
                            {assignments.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">📋</div>
                                    <h4>Aucune assignation</h4>
                                    <p>Aucune assignation en cours.</p>
                                </div>
                            ) : (
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Moniteur</th>
                                            <th>Spécialité</th>
                                            <th>Candidat</th>
                                            <th>Permis</th>
                                            <th>Date d'assignation</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignments.map(assignment => (
                                            <tr key={assignment.assignment_id}>
                                                <td>{assignment.monitor_nom} {assignment.monitor_prenom}</td>
                                                <td>
                                                    <span className="status-badge completed">{assignment.monitor_specialite || 'N/A'}</span>
                                                </td>
                                                <td>{assignment.candidat_nom} {assignment.candidat_prenom}</td>
                                                <td>
                                                    <span className="status-badge completed">{assignment.candidat_permis || 'N/A'}</span>
                                                </td>
                                                <td>
                                                    <small>{new Date(assignment.assigned_at || assignment.created_at).toLocaleDateString()}</small>
                                                </td>
                                                <td>
                                                    <button
                                                        className="action-btn danger"
                                                        onClick={() => handleUnassign(assignment.monitor_id, assignment.candidat_id)}
                                                    >
                                                        🗑 Retirer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* ONGLET RÉSERVATIONS */}
                        <div className="tab-pane fade" id="reservations">
                            <h3>Toutes les Réservations</h3>
                            {reservations.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">📅</div>
                                    <h4>Aucune réservation</h4>
                                    <p>Aucune réservation n'a été effectuée pour le moment.</p>
                                </div>
                            ) : (
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Candidat</th>
                                            <th>Type</th>
                                            <th>Date</th>
                                            <th>Heure</th>
                                            <th>Statut</th>
                                            <th>Permis</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reservations.map(reservation => (
                                            <tr key={reservation.id}>
                                                <td>{reservation.user ? `${reservation.user.nom} ${reservation.user.prenom}` : 'N/A'}</td>
                                                <td>{reservation.type || 'N/A'}</td>
                                                <td>
                                                    <small>{new Date(reservation.date).toLocaleDateString()}</small>
                                                </td>
                                                <td>{reservation.time}</td>
                                                <td>
                                                    <span className={`status-badge ${reservation.status === 'confirmed' ? 'confirmed' :
                                                            reservation.status === 'rejected' ? 'cancelled' :
                                                                'pending'
                                                        }`}>
                                                        {reservation.status === 'confirmed' ? 'Confirmé' :
                                                            reservation.status === 'rejected' ? 'Refusé' :
                                                                'En attente'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="status-badge completed">
                                                        {reservation.permis?.title || reservation.permis?.name || 'N/A'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALE D'ASSIGNATION */}
            <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Assigner un Moniteur</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCandidate && (
                        <>
                            <p>
                                <strong>Candidat:</strong> {selectedCandidate.nom} {selectedCandidate.prenom}
                            </p>
                            <p>
                                <strong>Catégorie de permis:</strong> <span className="status-badge completed">{selectedCandidate.categorie_permis || 'N/A'}</span>
                            </p>

                            <Form.Group className="mb-3">
                                <Form.Label>Sélectionner un Moniteur</Form.Label>
                                <Form.Select
                                    value={selectedMonitor}
                                    onChange={(e) => setSelectedMonitor(e.target.value)}
                                >
                                    <option value="">-- Choisir un moniteur --</option>
                                    {getCompatibleMonitors().map(monitor => (
                                        <option key={monitor.id} value={monitor.id}>
                                            {monitor.nom} {monitor.prenom}
                                            {monitor.specialite_permis && ` (${monitor.specialite_permis})`}
                                            {` - ${monitor.eleves_count || 0} élève(s)`}
                                        </option>
                                    ))}
                                </Form.Select>
                                {selectedCandidate.categorie_permis && (
                                    <Form.Text className="text-muted">
                                        Seuls les moniteurs compatibles avec le permis {selectedCandidate.categorie_permis} sont affichés
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleAssignSubmit}>
                        ✅ Confirmer l'assignation
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
