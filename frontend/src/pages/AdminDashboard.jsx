import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Form, Table, Badge, Alert } from 'react-bootstrap';

export default function AdminDashboard() {
    const [candidates, setCandidates] = useState([]);
    const [monitors, setMonitors] = useState([]);
    const [assignments, setAssignments] = useState([]);
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

            const [candidatesRes, monitorsRes, assignmentsRes] = await Promise.all([
                api.get('/admin/candidates'),
                api.get('/admin/monitors'),
                api.get('/admin/assignments')
            ]);

            setCandidates(candidatesRes.data.candidates || []);
            setMonitors(monitorsRes.data.monitors || []);
            setAssignments(assignmentsRes.data.assignments || []);
            setLoading(false);
        } catch (error) {
            console.error("Erreur chargement données admin", error);
            if (error.response && error.response.status === 403) {
                alert("Accès refusé. Vous n'avez pas les droits administrateur.");
                navigate("/");
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
            alert("Veuillez sélectionner un moniteur");
            return;
        }

        try {
            const api = (await import('../api.jsx')).default;
            const response = await api.post('/admin/assign', {
                candidat_id: selectedCandidate.id,
                monitor_id: selectedMonitor
            });

            if (response.data.status) {
                alert("✅ " + response.data.message);
                setShowAssignModal(false);
                loadData(); // Recharger les données
            }
        } catch (error) {
            console.error("Erreur assignation", error);
            const errorMsg = error.response?.data?.message || "Erreur lors de l'assignation";
            alert("❌ " + errorMsg);
        }
    };

    const handleUnassign = async (monitorId, candidatId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir retirer cette assignation ?")) {
            return;
        }

        try {
            const api = (await import('../api.jsx')).default;
            const response = await api.delete(`/admin/assign/${monitorId}/${candidatId}`);

            if (response.data.status) {
                alert("✅ " + response.data.message);
                loadData(); // Recharger les données
            }
        } catch (error) {
            console.error("Erreur suppression assignation", error);
            alert("❌ Erreur lors de la suppression");
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
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p>Chargement...</p>
            </div>
        );
    }

    return (
        <>
            <div className="dashboard-container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>🔧 Administration - Gestion des Assignations</h2>
                    <button className="btn btn-outline-primary" onClick={() => navigate("/")}>
                        🏠 Accueil
                    </button>
                </div>

                {/* STATISTIQUES */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="dashboard-card p-3 bg-primary text-white">
                            <h6>Candidats Inscrits</h6>
                            <h3>{candidates.length}</h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="dashboard-card p-3 bg-success text-white">
                            <h6>Moniteurs</h6>
                            <h3>{monitors.length}</h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="dashboard-card p-3 bg-info text-white">
                            <h6>Assignations</h6>
                            <h3>{assignments.length}</h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="dashboard-card p-3 bg-warning text-dark">
                            <h6>Non Assignés</h6>
                            <h3>{candidates.filter(c => !getCandidateMonitor(c)).length}</h3>
                        </div>
                    </div>
                </div>

                {/* ONGLETS */}
                <ul className="nav nav-tabs">
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
                </ul>

                <div className="tab-content p-3 border border-top-0">
                    {/* ONGLET CANDIDATS */}
                    <div className="tab-pane fade show active" id="candidats">
                        <h4>Liste des Candidats</h4>
                        {candidates.length === 0 ? (
                            <Alert variant="info">Aucun candidat inscrit</Alert>
                        ) : (
                            <Table striped bordered hover responsive>
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
                                                    <Badge bg="primary">{candidate.categorie_permis || 'N/A'}</Badge>
                                                </td>
                                                <td>
                                                    {assignedMonitor ? (
                                                        <Badge bg="success">{assignedMonitor}</Badge>
                                                    ) : (
                                                        <Badge bg="secondary">Non assigné</Badge>
                                                    )}
                                                </td>
                                                <td>
                                                    {!assignedMonitor && (
                                                        <Button
                                                            size="sm"
                                                            variant="primary"
                                                            onClick={() => handleAssignClick(candidate)}
                                                        >
                                                            ➕ Assigner
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        )}
                    </div>

                    {/* ONGLET MONITEURS */}
                    <div className="tab-pane fade" id="moniteurs">
                        <h4>Liste des Moniteurs</h4>
                        {monitors.length === 0 ? (
                            <Alert variant="info">Aucun moniteur enregistré</Alert>
                        ) : (
                            <Table striped bordered hover responsive>
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
                                                <Badge bg="info">
                                                    {monitor.specialite_permis || 'Non définie'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge bg="success">{monitor.eleves_count || 0}</Badge>
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
                            </Table>
                        )}
                    </div>

                    {/* ONGLET ASSIGNATIONS */}
                    <div className="tab-pane fade" id="assignations">
                        <h4>Toutes les Assignations</h4>
                        {assignments.length === 0 ? (
                            <Alert variant="info">Aucune assignation</Alert>
                        ) : (
                            <Table striped bordered hover responsive>
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
                                                <Badge bg="info">{assignment.monitor_specialite || 'N/A'}</Badge>
                                            </td>
                                            <td>{assignment.candidat_nom} {assignment.candidat_prenom}</td>
                                            <td>
                                                <Badge bg="primary">{assignment.candidat_permis || 'N/A'}</Badge>
                                            </td>
                                            <td>
                                                <small>{new Date(assignment.assigned_at || assignment.created_at).toLocaleDateString()}</small>
                                            </td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => handleUnassign(assignment.monitor_id, assignment.candidat_id)}
                                                >
                                                    🗑 Retirer
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
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
                                <strong>Catégorie de permis:</strong> <Badge bg="primary">{selectedCandidate.categorie_permis || 'N/A'}</Badge>
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
