import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/css/style.scss";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    telephone: '',
    carte_nationale: '',
    adresse: '',
    email: '',
    password: '',
    password_confirmation: '',
    methode_paiement: 'carte',
    categorie_permis: '',
    photo_identite: null,
    recto_carte_nationale: null,
    verso_carte_nationale: null,
    certificat_medical: null,
    role: 'candidate'
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ status: false, message: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "file" ? files[0] : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setStatus({ status: false, message: '' });

    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: "La confirmation du mot de passe ne correspond pas" });
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          data.append(key, formData[key]);
        }
      });

      const response = await axios.post(
        "http://127.0.0.1:8000/api/register",
        data
      );

      if (response.data.status) {
        setStatus({ status: true, message: response.data.message });

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setTimeout(() => navigate("/dashboard"), 2000);
      }

    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        setStatus({ status: false, message: "Veuillez corriger les erreurs" });
      } else {
        setStatus({
          status: false,
          message: error.response?.data?.message || "Erreur serveur"
        });
      }
    }

    setLoading(false);
  };

  const getCurrentDateForMaxAge = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="title">Créer Votre Compte Drive UP</h2>
        <p className="subtitle">
          Remplissez le formulaire pour créer votre compte et accéder à nos services
        </p>

        {status.message && (
          <div className={`status-message ${status.status ? "success" : "error"}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">

          {/* ─────────────── 1. INFORMATIONS PERSONNELLES ─────────────── */}
          <div className="section-header">
            <span className="number">1</span>
            <h3>Vos Informations Personnelles</h3>
          </div>

          <div className="form-group">
            <label>Nom *</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className={errors.nom ? "error" : ""}
            />
            {errors.nom && <span className="error-text">{errors.nom[0]}</span>}
          </div>

          <div className="form-group">
            <label>Prénom *</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              className={errors.prenom ? "error" : ""}
            />
            {errors.prenom && <span className="error-text">{errors.prenom[0]}</span>}
          </div>

          <div className="form-group">
            <label>Date de naissance *</label>
            <input
              type="date"
              name="date_naissance"
              value={formData.date_naissance}
              onChange={handleChange}
              required
              max={getCurrentDateForMaxAge()}
              className={errors.date_naissance ? "error" : ""}
            />
            {errors.date_naissance && (
              <span className="error-text">{errors.date_naissance[0]}</span>
            )}
          </div>

          <div className="form-group">
            <label>Téléphone *</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              required
              maxLength="10"
              pattern="[0-9]{10}"
              className={errors.telephone ? "error" : ""}
            />
            {errors.telephone && (
              <span className="error-text">{errors.telephone[0]}</span>
            )}
          </div>

          <div className="form-group">
            <label>N° Carte Nationale *</label>
            <input
              type="text"
              name="carte_nationale"
              value={formData.carte_nationale}
              onChange={handleChange}
              required
              className={errors.carte_nationale ? "error" : ""}
            />
            {errors.carte_nationale && (
              <span className="error-text">{errors.carte_nationale[0]}</span>
            )}
          </div>

          <div className="form-group">
            <label>Adresse *</label>
            <input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              required
              className={errors.adresse ? "error" : ""}
            />
            {errors.adresse && <span className="error-text">{errors.adresse[0]}</span>}
          </div>

          <div className="form-group full">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={errors.email ? "error" : ""}
            />
            {errors.email && <span className="error-text">{errors.email[0]}</span>}
          </div>

          <div className="form-group">
            <label>Mot de passe *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className={errors.password ? "error" : ""}
            />
            {errors.password && <span className="error-text">{errors.password[0]}</span>}
          </div>

          <div className="form-group">
            <label>Confirmer le mot de passe *</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              minLength="6"
              className={errors.password_confirmation ? "error" : ""}
            />
            {errors.password_confirmation && (
              <span className="error-text">{errors.password_confirmation}</span>
            )}
          </div>

          {/* ─────────────── 2. MÉTHODE DE PAIEMENT ─────────────── */}
          <div className="section-header mt-4">
            <span className="number">2</span>
            <h3>Méthode de paiement</h3>
          </div>

          <div className="payment-options">
            <label className="payment-box">
              <input
                type="radio"
                name="methode_paiement"
                value="carte"
                checked={formData.methode_paiement === "carte"}
                onChange={handleChange}
              />
              <span>Carte Bancaire</span>
            </label>

            <label className="payment-box">
              <input
                type="radio"
                name="methode_paiement"
                value="virement"
                checked={formData.methode_paiement === "virement"}
                onChange={handleChange}
              />
              <span>Virement Bancaire</span>
            </label>
          </div>

          {/* ─────────────── 3. UPLOAD DOCUMENTS ─────────────── */}
          <div className="section-header mt-4">
            <span className="number">3</span>
            <h3>Documents à fournir</h3>
          </div>

          <div className="upload-grid">
            <div className="upload-item">
              <label>Photo d'identité</label>
              <input type="file" name="photo_identite" onChange={handleChange} />
              {errors.photo_identite && (
                <span className="error-text">{errors.photo_identite[0]}</span>
              )}
            </div>

            <div className="upload-item">
              <label>Recto carte nationale</label>
              <input type="file" name="recto_carte_nationale" onChange={handleChange} />
              {errors.recto_carte_nationale && (
                <span className="error-text">{errors.recto_carte_nationale[0]}</span>
              )}
            </div>

            <div className="upload-item">
              <label>Verso carte nationale</label>
              <input type="file" name="verso_carte_nationale" onChange={handleChange} />
              {errors.verso_carte_nationale && (
                <span className="error-text">{errors.verso_carte_nationale[0]}</span>
              )}
            </div>

            <div className="upload-item">
              <label>Certificat médical</label>
              <input type="file" name="certificat_medical" onChange={handleChange} />
              {errors.certificat_medical && (
                <span className="error-text">{errors.certificat_medical[0]}</span>
              )}
            </div>
          </div>

          {/* ─────────────── 4. CATÉGORIE PERMIS ─────────────── */}
          <div className="section-header mt-4">
            <span className="number">4</span>
            <h3>Catégorie du permis</h3>
          </div>

          <div className="form-group full mt-2">
            <select
              name="categorie_permis"
              value={formData.categorie_permis}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              <option value="A">A — Moto</option>
              <option value="A1">A1 — Cyclomoteur</option>
              <option value="B">B — Voiture</option>
              <option value="C">C — Camion</option>
              <option value="D">D — Transport voyageurs</option>
              <option value="EC">EC — Semi-remorque</option>
            </select>
            {errors.categorie_permis && (
              <span className="error-text">{errors.categorie_permis[0]}</span>
            )}
          </div>

          <button type="submit" className="register-btn big" disabled={loading}>
            {loading ? "INSCRIPTION EN COURS..." : "VALIDER MON INSCRIPTION →"}
          </button>
        </form>

        <p className="return-login">
          ← <Link to="/compte">Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}
