import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form, Badge } from "react-bootstrap";
import { useUser } from "../context/UserContext"; // Import du contexte

export default function Permis() {
  const { user } = useUser(); // Récupérer l'utilisateur connecté
  const [selectedPermis, setSelectedPermis] = useState(null);
  const [reservationStep, setReservationStep] = useState(0);
  const [selectedType, setSelectedType] = useState(""); // Code ou Conduite
  const [selectedDay, setSelectedDay] = useState(""); // Jour de réservation
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const permisCategories = [
    {
      id: 1,
      title: "Permis B - Véhicules Légers",
      category: "B",
      price: "4500 Dh",
      hours: "30 heures",
      description: "Formation complète pour conduire les voitures, camionnettes et véhicules légers (PT AC ≤ 3,5 tonnes)",
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
      category: "A",
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
      category: "C",
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
      category: "D",
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
      category: "A1",
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
      category: "EB",
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

  const availableDays = [
    { date: "2025-12-01", day: "Lundi 1 Décembre 2025" },
    { date: "2025-12-02", day: "Mardi 2 Décembre 2025" },
    { date: "2025-12-03", day: "Mercredi 3 Décembre 2025" },
    { date: "2025-12-04", day: "Jeudi 4 Décembre 2025" },
    { date: "2025-12-05", day: "Vendredi 5 Décembre 2025" },
    { date: "2025-12-08", day: "Lundi 8 Décembre 2025" },
    { date: "2025-12-09", day: "Mardi 9 Décembre 2025" }
  ];

  const handleReservation = (permis) => {
    setSelectedPermis(permis);
    if (!user) {
      setReservationStep(0); // Étape de connexion
    } else {
      setReservationStep(1); // Première étape de réservation
    }
  };

  const handleLogin = () => {
    setReservationStep(1);
  };

  const handleNextStep = () => {
    if (reservationStep < 4) {
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

 const handleConfirmReservation = async () => {
    try {
      const api = (await import('../api.jsx')).default;
      const selectedDayObj = availableDays.find(d => d.date === selectedDay);
      
      const reservationData = {
        permis_id: selectedPermis.id,
        monitor: "Moniteur Auto",
        date: selectedDay,
        time: selectedTime,
        type: selectedType,
      };
      const response = await api.post('/reservations', reservationData);
      if (response.data.status) {
        alert(`✅ Réservation confirmée avec succès!\n\nFormation: ${selectedPermis.title}\nType: ${selectedType === 'code' ? 'Séance de Code' : 'Séance de Conduite'}\nDate: ${selectedDayObj?.day}\nHeure: ${selectedTime}`);
        
        setSelectedPermis(null);
        setReservationStep(0);
        setSelectedType("");
        setSelectedDay("");
        setSelectedDate("");
        setSelectedTime("");
        
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors || "Une erreur est survenue";
      alert(`❌ Erreur: ${typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage}`);
    }
  };

  const renderReservationModal = () => {
    if (!selectedPermis) return null;

    return (
      <Modal show={true} onHide={() => {
        setSelectedPermis(null);
        setReservationStep(0);
        setSelectedType("");
        setSelectedDay("");
        setSelectedTime("");
      }} size="lg" centered>
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
                <Button variant="primary" href="/compte">
                  Se Connecter
                </Button>
              </div>
            </div>
          )}

          {/* Étape 1 : Choix du type de séance */}
          {reservationStep === 1 && (
            <div>
              <div className="text-center mb-4">
                <h5 className="fw-bold text-primary">
                  Réserver : {selectedPermis.title}
                </h5>

                {/* Indicateur d'étapes */}
                <div className="d-flex justify-content-center align-items-center gap-2 my-3">
                  <span className="badge rounded-circle bg-primary text-white p-3">1</span>
                  <div style={{ width: "30px", height: "3px", background: "#ccc" }}></div>
                  <span className="badge rounded-circle bg-secondary text-white-50 p-3">2</span>
                  <div style={{ width: "30px", height: "3px", background: "#ccc" }}></div>
                  <span className="badge rounded-circle bg-secondary text-white-50 p-3">3</span>
                  <div style={{ width: "30px", height: "3px", background: "#ccc" }}></div>
                  <span className="badge rounded-circle bg-secondary text-white-50 p-3">4</span>
                </div>

                <h5 className="fw-semibold mb-3">Type de séance</h5>
                <p className="text-muted">Souhaitez-vous réserver une séance de code ou de conduite ?</p>
              </div>

              <Row className="g-4">
                {/* Carte Séance de Code */}
                <Col md={6}>
                  <Card
                    className={`text-center p-4 shadow-sm border-2 ${selectedType === 'code' ? 'border-primary' : 'border-light'}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedType('code')}
                  >
                    <div className="mb-3">
                      <span className="bg-primary bg-opacity-10 p-3 rounded-circle">
                        <i className="bi bi-book fs-3 text-primary"></i>
                      </span>
                    </div>
                    <h5 className="fw-bold">Séance de Code</h5>
                    <p className="text-muted mb-0">Apprenez le code de la route en classe</p>
                    {selectedType === 'code' && (
                      <div className="mt-2">
                        <i className="bi bi-check-circle-fill text-primary fs-4"></i>
                      </div>
                    )}
                  </Card>
                </Col>

                {/* Carte Séance de Conduite */}
                <Col md={6}>
                  <Card
                    className={`text-center p-4 shadow-sm border-2 ${selectedType === 'conduite' ? 'border-primary' : 'border-light'}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedType('conduite')}
                  >
                    <div className="mb-3">
                      <span className="bg-primary bg-opacity-10 p-3 rounded-circle">
                        <i className="bi bi-car-front fs-3 text-primary"></i>
                      </span>
                    </div>
                    <h5 className="fw-bold">Séance de Conduite</h5>
                    <p className="text-muted mb-0">Pratiquez la conduite avec un moniteur</p>
                    {selectedType === 'conduite' && (
                      <div className="mt-2">
                        <i className="bi bi-check-circle-fill text-primary fs-4"></i>
                      </div>
                    )}
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {/* Étape 2: Choix du jour */}
          {reservationStep === 2 && (
            <div>
              <div className="text-center mb-4">
                <h5 className="fw-semibold mb-3">Choisissez un jour</h5>
                <p className="text-muted">Sélectionnez une date disponible pour votre séance de {selectedType}</p>
              </div>

              <Row className="g-3">
                {availableDays.map((dayObj) => (
                  <Col key={dayObj.date} md={6}>
                    <Card
                      className={`p-3 text-center ${selectedDay === dayObj.date ? 'border-primary border-2' : 'border-light'}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedDay(dayObj.date)}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <span>{dayObj.day}</span>
                        {selectedDay === dayObj.date && (
                          <i className="bi bi-check-circle-fill text-primary fs-5"></i>
                        )}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* Étape 3: Choix de l'heure */}
          {reservationStep === 3 && (
            <div>
              <h6 className="mb-3">Choisissez un horaire</h6>

              <div className="mb-4">
                <h6 className="text-primary">{availableDays.find(d => d.date === selectedDay)?.day}</h6>
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
                <p className="mb-1"><strong>Type:</strong> {selectedType === 'code' ? 'Séance de Code' : 'Séance de Conduite'}</p>
                <p className="mb-1"><strong>Date:</strong> {availableDays.find(d => d.date === selectedDay)?.day}</p>
                <p className="mb-0"><strong>Horaire:</strong> {selectedTime}</p>
              </div>
            </div>
          )}

          {/* Étape 4: Confirmation */}
          {reservationStep === 4 && (
            <div className="text-center">
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success display-4"></i>
                <h5 className="mt-3">Confirmer la réservation</h5>
                <div className="bg-light p-3 rounded text-start">
                  <p><strong>Formation:</strong> {selectedPermis.title}</p>
                  <p><strong>Prix:</strong> {selectedPermis.price}</p>
                  <p><strong>Type:</strong> {selectedType === 'code' ? 'Séance de Code' : 'Séance de Conduite'}</p>
                  <p><strong>Date:</strong> {availableDays.find(d => d.date === selectedDay)?.day}</p>
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
              disabled={!selectedType}
            >
              Continuer
            </Button>
          )}

          {reservationStep === 2 && (
            <Button
              variant="primary"
              onClick={handleNextStep}
              disabled={!selectedDay}
            >
              Continuer
            </Button>
          )}

          {reservationStep === 3 && (
            <Button
              variant="primary"
              onClick={handleNextStep}
              disabled={!selectedTime}
            >
              Continuer
            </Button>
          )}

          {reservationStep === 4 && (
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
          {permisCategories.map((permis) => {
            // Logique de restriction : si connecté, on ne peut cliquer que sur son permis
            const isAllowed = !user || user.categorie_permis === permis.category;
            const cardStyle = isAllowed ? {} : { filter: "blur(2px)", opacity: 0.6, pointerEvents: "none" };

            return (
              <Col key={permis.id} md={6} lg={4}>
                <Card className="h-100 shadow-sm border-0 permis-card" style={cardStyle}>
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
                        disabled={!isAllowed}
                      >
                        {isAllowed ? permis.buttonText : "Non disponible"}
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