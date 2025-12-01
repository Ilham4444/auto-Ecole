import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Utiliser l'instance API configurée

export default function Examens() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState(null);
  const [reservationStep, setReservationStep] = useState(0);
  const [availableDays, setAvailableDays] = useState([]);
  const [selectedDayObj, setSelectedDayObj] = useState(null); // Objet date complet
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const examCategories = [
    {
      id: "code",
      title: "Examen Théorique (Code)",
      price: "500 Dh",
      hours: "40 min",
      description: "Épreuve théorique officielle du Code de la Route.",
      features: [
        "40 Questions QCM",
        "35 Bonnes réponses requises",
        "Résultat immédiat",
        "Salle d'examen agréée",
        "Tablette individuelle"
      ],
      buttonText: "Réserver",
      type: "code"
    },
    {
      id: "conduite",
      title: "Examen Pratique (Conduite)",
      price: "1000 Dh",
      hours: "30 min",
      description: "Épreuve pratique de conduite en circulation.",
      features: [
        "Vérifications intérieures/extérieures",
        "Manoeuvres obligatoires",
        "Conduite en agglomération",
        "Conduite hors agglomération",
        "Accompagnement par moniteur"
      ],
      buttonText: "Réserver",
      type: "conduite"
    }
  ];

  // Charger les créneaux quand un examen est sélectionné
  useEffect(() => {
    if (selectedExam && reservationStep === 1) {
      fetchSlots(selectedExam.type);
    }
  }, [selectedExam, reservationStep]);

  const fetchSlots = async (type) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/examens/disponibles?type=${type}`);
      if (response.data.success) {
        setAvailableDays(response.data.creneaux || []);
      }
    } catch (err) {
      console.error("Erreur chargement créneaux:", err);
      setError(err.response?.data?.message || "Impossible de charger les créneaux.");
      setAvailableDays([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReservation = (exam) => {
    setSelectedExam(exam);
    if (!user) {
      setReservationStep(0); // Connexion requise
    } else {
      setReservationStep(1); // Choix de la date
    }
  };

  const handleNextStep = () => {
    if (reservationStep < 3) {
      setReservationStep(reservationStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (reservationStep > 1) {
      setReservationStep(reservationStep - 1);
    } else {
      setSelectedExam(null);
      setReservationStep(0);
      setAvailableDays([]);
      setSelectedDayObj(null);
      setSelectedTime("");
    }
  };

  const handleConfirmReservation = async () => {
    if (!selectedDayObj || !selectedTime || !selectedExam) return;

    try {
      const payload = {
        type: selectedExam.type,
        date: selectedDayObj.date,
        time: selectedTime,
        permis_id: user.categorie_permis_id || 1 // Fallback ou gérer dynamiquement
      };

      const response = await api.post('/examens/reserver', payload);

      if (response.data.success) {
        alert(`✅ Réservation confirmée !\n\nExamen: ${selectedExam.title}\nDate: ${selectedDayObj.date_formatted}\nHeure: ${selectedTime}`);

        // Reset et redirection
        setSelectedExam(null);
        setReservationStep(0);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Erreur réservation:", err);
      alert(`❌ Erreur: ${err.response?.data?.message || "Échec de la réservation"}`);
    }
  };

  const renderReservationModal = () => {
    if (!selectedExam) return null;

    return (
      <Modal show={true} onHide={() => {
        setSelectedExam(null);
        setReservationStep(0);
        setAvailableDays([]);
        setSelectedDayObj(null);
        setSelectedTime("");
      }} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {reservationStep === 0 ? "Connexion Requise" : `Réserver : ${selectedExam.title}`}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Étape 0: Connexion requise */}
          {reservationStep === 0 && (
            <div className="text-center">
              <div className="alert alert-warning">
                <p>Vous devez être connecté pour réserver un examen.</p>
              </div>
              <div className="d-flex gap-3 justify-content-center">
                <Button variant="outline-secondary" onClick={() => setSelectedExam(null)}>
                  Annuler
                </Button>
                <Button variant="primary" href="/compte">
                  Se Connecter
                </Button>
              </div>
            </div>
          )}

          {/* Étape 1 : Choix de la date */}
          {reservationStep === 1 && (
            <div>
              <div className="text-center mb-4">
                <h5 className="fw-semibold mb-3">Choisissez une date</h5>
                <p className="text-muted">Sélectionnez un jour disponible pour votre examen</p>

                {/* Indicateur d'étapes */}
                <div className="d-flex justify-content-center align-items-center gap-2 my-3">
                  <span className="badge rounded-circle bg-primary text-white p-3">1</span>
                  <div style={{ width: "30px", height: "3px", background: "#ccc" }}></div>
                  <span className="badge rounded-circle bg-secondary text-white-50 p-3">2</span>
                  <div style={{ width: "30px", height: "3px", background: "#ccc" }}></div>
                  <span className="badge rounded-circle bg-secondary text-white-50 p-3">3</span>
                </div>
              </div>

              {loading && <div className="text-center"><div className="spinner-border text-primary"></div></div>}
              {error && <div className="alert alert-danger">{error}</div>}

              {!loading && !error && (
                <Row className="g-3">
                  {availableDays.length === 0 ? (
                    <p className="text-center text-muted">Aucun créneau disponible pour le moment.</p>
                  ) : (
                    availableDays.map((day) => (
                      <Col key={day.date} md={6}>
                        <Card
                          className={`p-3 text-center ${selectedDayObj?.date === day.date ? 'border-primary border-2' : 'border-light'}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedDayObj(day);
                            setSelectedTime(""); // Reset time on date change
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <span>{day.date_formatted}</span>
                            {selectedDayObj?.date === day.date && (
                              <i className="bi bi-check-circle-fill text-primary fs-5"></i>
                            )}
                          </div>
                        </Card>
                      </Col>
                    ))
                  )}
                </Row>
              )}
            </div>
          )}

          {/* Étape 2 : Choix de l'heure */}
          {reservationStep === 2 && (
            <div>
              <h6 className="mb-3">Choisissez un horaire pour le {selectedDayObj?.date_formatted}</h6>

              <div className="d-flex flex-wrap gap-2 mt-3 mb-4">
                {selectedDayObj?.horaires.map((h, index) => (
                  <Button
                    key={index}
                    variant={selectedTime === h.time ? "primary" : "outline-primary"}
                    size="sm"
                    onClick={() => h.disponible && setSelectedTime(h.time)}
                    disabled={!h.disponible}
                    className="d-flex flex-column align-items-center"
                    style={{ minWidth: "80px" }}
                  >
                    <span>{h.time}</span>
                    <span style={{ fontSize: "0.7rem" }}>
                      {h.disponible ? `${h.places_restantes} places` : "Complet"}
                    </span>
                  </Button>
                ))}
              </div>

              <div className="bg-light p-3 rounded">
                <h6>Résumé :</h6>
                <p className="mb-1"><strong>Examen:</strong> {selectedExam.title}</p>
                <p className="mb-1"><strong>Date:</strong> {selectedDayObj?.date_formatted}</p>
                <p className="mb-0"><strong>Heure:</strong> {selectedTime || "..."}</p>
              </div>
            </div>
          )}

          {/* Étape 3 : Confirmation */}
          {reservationStep === 3 && (
            <div className="text-center">
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success display-4"></i>
                <h5 className="mt-3">Confirmer la réservation</h5>
                <div className="bg-light p-3 rounded text-start mx-auto" style={{ maxWidth: "400px" }}>
                  <p><strong>Examen:</strong> {selectedExam.title}</p>
                  <p><strong>Date:</strong> {selectedDayObj?.date_formatted}</p>
                  <p><strong>Heure:</strong> {selectedTime}</p>
                  <p className="text-danger mb-0"><small>* Annulation possible jusqu'à 48h avant.</small></p>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          {reservationStep > 0 && (
            <Button variant="outline-secondary" onClick={handlePreviousStep}>
              Retour
            </Button>
          )}

          {reservationStep === 1 && (
            <Button
              variant="primary"
              onClick={handleNextStep}
              disabled={!selectedDayObj}
            >
              Continuer
            </Button>
          )}

          {reservationStep === 2 && (
            <Button
              variant="primary"
              onClick={handleNextStep}
              disabled={!selectedTime}
            >
              Continuer
            </Button>
          )}

          {reservationStep === 3 && (
            <Button variant="success" onClick={handleConfirmReservation}>
              Confirmer la réservation
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <section className="permis-section py-5 bg-light" id="Examens">
      <Container>
        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary">Réserver un Examen</h2>
          <p className="lead text-muted">
            Sélectionnez votre type d'examen et réservez votre créneau en ligne
          </p>
          <hr className="my-4 mx-auto" style={{ width: "100px", borderWidth: "2px", borderColor: "#1e3a8a" }} />
        </div>

        <Row className="justify-content-center g-4">
          {examCategories.map((exam) => {
            // Logique d'éligibilité simplifiée pour l'affichage (la vraie vérif est serveur)
            // On laisse tout clickable, l'API renverra une erreur si non éligible
            const isAllowed = true;

            return (
              <Col key={exam.id} md={6} lg={5}>
                <Card className="h-100 shadow-sm border-0 permis-card">
                  <Card.Header className="bg-primary text-white text-center py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="mb-0 fw-bold">{exam.price}</h4>
                      <span className="badge bg-light text-dark fs-6">{exam.hours}</span>
                    </div>
                  </Card.Header>

                  <Card.Body className="d-flex flex-column">
                    <h5 className="card-title text-center mb-3 fw-bold">{exam.title}</h5>
                    <p className="card-text flex-grow-1 text-muted">{exam.description}</p>

                    <div className="mt-3">
                      <h6 className="text-primary fw-semibold mb-2">Détails de l'épreuve :</h6>
                      <ul className="list-unstyled">
                        {exam.features.map((feature, index) => (
                          <li key={index} className="mb-2 d-flex align-items-start">
                            <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto pt-3">
                      <Button
                        variant="primary"
                        className="w-100 py-2 fw-semibold"
                        onClick={() => handleReservation(exam)}
                        disabled={!isAllowed}
                      >
                        {exam.buttonText}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        {renderReservationModal()}
      </Container>
    </section>
  );
}
