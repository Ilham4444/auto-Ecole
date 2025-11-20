import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/css/style.scss";

export default function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    date_naissance: "",
    telephone: "",
    carte_nationale: "",
    adresse: "",
    email: "",
    password: "",
    password_confirmation: "",
    methode_paiement: "carte",
    categorie_permis: "B"
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setErrors(data.errors || {});
      }
    } catch (err) {
      setErrors({ general: "Erreur de connexion au serveur" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="title">Créer Votre Compte Drive UP</h2>
        <p className="subtitle">
          Remplissez le formulaire pour créer votre compte et accéder à nos services
        </p>

        <form onSubmit={handleSubmit} className="form-grid">
          {/* 1. INFORMATIONS PERSONNELLES */}
          <div className="section-header">
            <span className="number">1</span>
            <h3>Vos Informations Personnelles</h3>
          </div>

          <div className="form-group">
            <label>Nom</label>
            <input 
              type="text" 
              name="nom"
              placeholder="Nom" 
              value={formData.nom}
              onChange={handleChange}
              className={errors.nom ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label>Prénom</label>
            <input 
              type="text" 
              name="prenom"
              placeholder="Prénom" 
              value={formData.prenom}
              onChange={handleChange}
              className={errors.prenom ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label>Date de naissance</label>
            <input 
              type="date" 
              name="date_naissance"
              value={formData.date_naissance}
              onChange={handleChange}
              className={errors.date_naissance ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input 
              type="tel" 
              name="telephone"
              placeholder="06..." 
            />
          </div>

          <div className="form-group">
            <label>N° Carte Nationale</label>
            <input 
              type="text" 
              name="carte_nationale"
              placeholder="Ex : AB123456" 
              value={formData.carte_nationale}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Adresse</label>
            <input 
              type="text" 
              name="adresse"
              placeholder="Votre adresse complète" 
            />
          </div>

          <div className="form-group full">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              placeholder="exemple@email.com" 
            />
          </div>

          <div className="form-group">
            <label>Mot de passe (Min. 6)</label>
            <input 
              type="password" 
              name="password"
            />
          </div>

          <div className="form-group">
            <label>Confirmer mot de passe</label>
            <input 
              type="password" 
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
            />
          </div>

          {/* 2. MÉTHODE DE PAIEMENT */}
          <div className="section-header mt-4">
            <span className="number">2</span>
            <h3>Choisissez votre méthode de paiement</h3>
          </div>

          <div className="payment-options">
            <label className="payment-box">
              <input 
                type="radio" 
                name="methode_paiement" 
                value="carte"
                checked={formData.methode_paiement === 'carte'}
                onChange={handleChange}
              />
              <span className="logos">
                <img src="/visa.png" alt="Visa" />
                <img src="/mastercard.png" alt="Mastercard" />
              </span>
              <span>Carte Bancaire</span>
            </label>

            <label className="payment-box">
              <input 
                type="radio" 
                name="methode_paiement" 
                value="virement"
                checked={formData.methode_paiement === 'virement'}
                onChange={handleChange}
              />
              <span className="bank-icon">🏛️</span>
              <span>Virement Bancaire</span>
            </label>
          </div>

          {/* 4. CATÉGORIE PERMIS */}
          <div className="section-header mt-4">
            <span className="number">3</span>
            <h3>Choisissez votre catégorie de permis</h3>
          </div>

          <div className="form-group full mt-2">
            <select 
              name="categorie_permis"
            >
              <option value="A">A — Moto</option>
              <option value="A1">A1 — Cyclomoteur</option>
              <option value="B">B — Voiture</option>
              <option value="C">C — Camion</option>
              <option value="D">D — Transport voyageurs</option>
              <option value="EC">EC — Semi-remorque</option>
            </select>
          </div>

          <button type="submit" className="register-btn big" disabled={loading}>
            {loading ? "Inscription en cours..." : "VALIDER MON INSCRIPTION →"}
          </button>
        </form>

        <p className="return-login">
          ← <Link to="/compte">Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}