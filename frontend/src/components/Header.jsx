import React from "react";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import "../assets/css/style.scss";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Header = () => {
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <header className="header fixed-top bg-white shadow-sm" style={{ zIndex: 1000 }}>
      {/* Barre supérieure */}
      <div className="top-bar d-flex justify-content-between align-items-center px-3 py-1 text-white">
        <div className="contact-info d-flex align-items-center gap-3">
          <span>
            <i className="bi bi-telephone"></i> 0631212766
          </span>
          <span>
            <i className="bi bi-geo-alt"></i> Rue de Hassan 2, Agadir
          </span>
        </div>
        <div className="hours">
          Ouvert du <strong>Lundi au Samedi</strong> : 8h - 20h
        </div>
      </div>

      {/* Navbar principale */}
      <Navbar expand="lg" className="bg-white shadow-sm py-3">
        <Container>
          <Navbar.Brand href="#" className="d-flex align-items-center">
            <img src={logo} alt="Drive UP Logo" height="50" className="me-2" />
            <div>
              <h5 className="m-0 fw-bold text-primary">Drive UP</h5>
              <small className="text-muted">Learn. Progress. Succeed.</small>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar" className="justify-content-end">
            <Nav className="align-items-center gap-3">
              <Nav.Link href="#permis">Nos Permis</Nav.Link>
              <Nav.Link href="#examens">Examens</Nav.Link>
              <Nav.Link href="#moniteurs">Moniteurs</Nav.Link>
              <Nav.Link href="#apropos">À propos</Nav.Link>

              {user ? (
                <Dropdown>
                  <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                    👤 {user.prenom} {user.nom}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/dashboard">Tableau de Bord</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout} className="text-danger">Se déconnecter</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button as={Link} to="/compte" variant="primary">Mon Compte</Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
export default Header;