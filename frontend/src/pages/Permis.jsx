import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form, Badge } from "react-bootstrap";

export default function Permis() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPermis, setSelectedPermis] = useState(null);
  const [reservationStep, setReservationStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedMonitor, setSelectedMonitor] = useState("");

  const permisCategories = [
    {
      id: 1,
      title: "Permis B - Véhicules Légers",
      price: "4500 Dh",
      hours: "30 heures",
      description: "Formation complète pour conduire les voitures, camionnettes et véhicules légers (PTAC ≤ 3,5 tonnes)",
      features: [
        "20h de code de la route",
        "30h de conduite pratique",
        "Véhicule à double commande",
        "Examen code et conduite inclus",
        "Dossier administratif complet"
      ],
      buttonText: "Réserver"
    },
    {
      id: 2,
      title: "Permis A - Motocycles",
      price: "3800 Dh",
      hours: "20 heures",
      description: "Formation pour conduire les motos et motocyclettes de toutes cylindrées",
      features: [
        "15h de code spécifique moto",
        "20h de conduite pratique",
        "Équipement de sécurité fourni",
        "Piste de maniabilité",
        "Circulation en conditions réelles"
      ],
      buttonText: "Réserver"
    },
    {
      id: 3,
      title: "Permis C - Poids Lourds",
      price: "8500 Dh",
      hours: "40 heures",
      description: "Formation pour conduire les camions et véhicules de transport de marchandises (PTAC > 3,5 tonnes)",
      features: [
        "25h de code professionnel",
        "40h de conduite poids lourds",
        "Manoeuvres spécifiques",
        "Formation FIMO/FCO",
        "Stage en conditions réelles"
      ],
      buttonText: "Réserver"
    },
    {
      id: 4,
      title: "Permis D - Transport de Personnes",
      price: "9000 Dh",
      hours: "35 heures",
      description: "Formation pour conduire les autobus et véhicules de transport en commun (>9 places)",
      features: [
        "Code transport de personnes",
        "35h de conduite autobus",
        "Sécurité des passagers",
        "Gestion d'urgences",
        "Carte de qualification obligatoire"
      ],
      buttonText: "Réserver"
    },
    {
      id: 5,
      title: "Permis A1 - Motos Légères",
      price: "2500 Dh",
      hours: "12 heures",
      description: "Formation pour conduire les motocyclettes légères jusqu'à 125cc (dès 16 ans)",
      features: [
        "10h de code de la route",
        "12h de conduite pratique",
        "Équipement inclus",
        "Âge minimum: 16 ans",
        "Maniabilité et circulation"
      ],
      buttonText: "Réserver"
    },
    {
      id: 6,
      title: "Permis EB - Remorque",
      price: "2000 Dh",
      hours: "8 heures",
      description: "Extension du permis B pour tracter une remorque ou caravane (PTAC > 750 kg)",
      features: [
        "Formation aux manœuvres",
        "8h de conduite spécifique",
        "Attelage et dételage",
        "Marche arrière",
        "Permis B requis"
      ],
      buttonText: "Réserver"
    }
  ];

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const handleReservation = (permis) => {
    setSelectedPermis(permis);
    if (!isLoggedIn) {
      setReservationStep(0); // Étape de connexion
    } else {
      setReservationStep(1); // Première étape de réservation
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setReservationStep(1);
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
      setSelectedPermis(null);
      setReservationStep(0);
    }
  };

  const handleConfirmReservation = () => {
    alert(`Réservation confirmée pour ${selectedPermis.title}  le vendredi 5 décembre 2025 à ${selectedTime}`);
    setSelectedPermis(null);
    setReservationStep(0);
    setSelectedDate("");
    setSelectedTime("");
  };

  const renderReservationModal = () => {
    if (!selectedPermis) return null;

    return (
      <Modal show={true} onHide={() => { setSelectedPermis(null); setReservationStep(0); }} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {reservationStep === 0 ? "Connexion Requise" : `Réserver : ${selectedPermis.title}`}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {/* Étape 0: Connexion requise */}
          {reservationStep === 0 && (
            <div className="text-center">
              <div className="mb-4">
                <h5 className="text-primary">{selectedPermis.title}</h5>
                <p className="text-muted">{selectedPermis.description}</p>
                <div className="bg-light p-3 rounded">
                  <h6 className="mb-3">Ce qui est inclus :</h6>
                  {selectedPermis.features.map((feature, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="alert alert-warning">
                <Form.Check 
                  type="checkbox"
                  label="Vous n'avez pas de compte. Veuillez vous connecter ou créer un compte pour effectuer une réservation."
                  className="mb-3"
                />
              </div>
              
              <div className="d-flex gap-3 justify-content-center">
                <Button variant="outline-secondary" onClick={() => setSelectedPermis(null)}>
                  Annuler
                </Button>
                <Button variant="primary" onClick={handleLogin}>
                  Se Connecter
                </Button>
              </div>
            </div>
          )}

          {/* Étape 1: Choix du moniteur */}
          {reservationStep === 1 && (
            <div>
              <h6 className="mb-3">Choisissez votre moniteur</h6>
              <Row className="g-3">
                {monitors.map((monitor) => (
                  <Col md={6} key={monitor.id}>
                    <Card 
                      className={`cursor-pointer ${selectedMonitor === monitor.name ? 'border-primary' : ''}`}
                      onClick={() => setSelectedMonitor(monitor.name)}
                    >
                      <Card.Body>
                        <h6 className="fw-bold">{monitor.name}</h6>
                        <p className="text-muted mb-2">{monitor.experience}</p>
                        <Badge bg="success" className="mb-2">{monitor.rating}</Badge>
                        <div>
                          {monitor.specialties.map((specialty, index) => (
                            <Badge key={index} bg="light" text="dark" className="me-1 mb-1">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              
              <div className="mt-4 text-center">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Ouvert du Lundi au Samedi : 8h - 20h
                </small>
              </div>
            </div>
          )}

          {/* Étape 2: Choix de la date et heure */}
          {reservationStep === 2 && (
            <div>
              <h6 className="mb-3">Choisissez un horaire</h6>
              
              <div className="mb-4">
                <h6 className="text-primary">vendredi 5 décembre 2025</h6>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {timeSlots.map((time, index) => (
                    <Button
                      key={index}
                      variant={selectedTime === time ? "primary" : "outline-primary"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-light p-3 rounded">
                <h6>Résumé de votre réservation:</h6>
                <p className="mb-1"><strong>Permis:</strong> {selectedPermis.title}</p>
                <p className="mb-1"><strong>Moniteur:</strong> {selectedMonitor}</p>
                <p className="mb-0"><strong>Horaire:</strong> {selectedTime}</p>
              </div>
            </div>
          )}

          {/* Étape 3: Confirmation */}
          {reservationStep === 3 && (
            <div className="text-center">
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success display-4"></i>
                <h5 className="mt-3">Confirmer la réservation</h5>
                <div className="bg-light p-3 rounded text-start">
                  <p><strong>Formation:</strong> {selectedPermis.title}</p>
                  <p><strong>Prix:</strong> {selectedPermis.price}</p>
                  <p><strong>Moniteur:</strong> {selectedMonitor}</p>
                  <p><strong>Date:</strong> vendredi 5 décembre 2025</p>
                  <p><strong>Heure:</strong> {selectedTime}</p>
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
              disabled={!selectedMonitor}
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
    <section className="permis-section py-5 bg-light" id="Permis">
      <Container>
        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary">Nos Catégories de Permis</h2>
          <p className="lead text-muted">
            Choisissez votre catégorie de permis et démarrez votre formation complète
          </p>
          <hr className="my-4 mx-auto" style={{ width: "100px", borderWidth: "2px", borderColor: "#1e3a8a" }} />
        </div>

        <Row className="g-4">
          {permisCategories.map((permis) => (
            <Col key={permis.id} md={6} lg={4}>
              <Card className="h-100 shadow-sm border-0 permis-card">
                <Card.Header className="bg-primary text-white text-center py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 fw-bold">{permis.price}</h4>
                    <span className="badge bg-light text-dark fs-6">{permis.hours}</span>
                  </div>
                </Card.Header>
                
                <Card.Body className="d-flex flex-column">
                  <h5 className="card-title text-center mb-3 fw-bold">{permis.title}</h5>
                  <p className="card-text flex-grow-1 text-muted">{permis.description}</p>
                  
                  <div className="mt-3">
                    <h6 className="text-primary fw-semibold mb-2">Ce qui est inclus :</h6>
                    <ul className="list-unstyled">
                      {permis.features.map((feature, index) => (
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
                      onClick={() => handleReservation(permis)}
                    >
                      {permis.buttonText}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {renderReservationModal()}
      </Container>
    </section>
  );
}