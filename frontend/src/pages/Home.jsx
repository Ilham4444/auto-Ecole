import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "../assets/css/style.scss";
import heroImage from "../assets/hero.jpg"; // 👉 remplace par ton image réelle

export default function Home() {
  return (
    <section className="hero-section py-5">
      <Container>
        <Row className="align-items-center">
          {/* Texte principal */}
          <Col lg={6} className="mb-4 mb-lg-0">
            <h1 className="fw-bold display-5 mb-3">
              Obtenez Votre Permis en Toute{" "}
              <span className="text-primary">Confiance</span>
            </h1>
            <p className="text-secondary mb-4">
              Réservez vos heures de conduite et votre examen de permis en ligne.
              Instructeurs expérimentés, taux de réussite de 85%.
            </p>

            <div className="d-flex gap-3 flex-wrap">
              <Button variant="primary" className="rounded-pill px-4 py-2">
                Réserver une leçon
              </Button>
              <Button
                variant="outline-primary"
                className="rounded-pill px-4 py-2"
              >
                Passer l'examen
              </Button>
            </div>

            {/* Statistiques */}
            <div className="d-flex gap-5 mt-5 flex-wrap stats">
              <div>
                <h4 className="fw-bold text-primary mb-0">85%</h4>
                <p className="text-muted mb-0">Taux de réussite</p>
              </div>
              <div>
                <h4 className="fw-bold text-primary mb-0">2000+</h4>
                <p className="text-muted mb-0">Élèves formés</p>
              </div>
              <div>
                <h4 className="fw-bold text-primary mb-0">38.9/40</h4>
                <p className="text-muted mb-0">Note moyenne</p>
              </div>
            </div>
          </Col>

          {/* Image principale */}
          <Col lg={6}>
            <div className="position-relative">
              <img
                src={heroImage}
                alt="Conduite"
                className="img-fluid rounded-4 shadow-sm"
              />

              {/* Carte flottante */}
              <Card className="position-absolute bottom-0 end-0 m-3 shadow-sm rounded-4 info-card">
                <Card.Body className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-primary fs-4"></i>
                  <div>
                    <h6 className="mb-0 fw-bold">Formation complète</h6>
                    <small className="text-muted">
                      Code + Conduite inclus
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

