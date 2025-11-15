
import React from "react";
import "../assets/css/style.scss";

export default function Compte() {
  return (
    <div className="moncompte-container">
      <div className="moncompte-card">
        <h3 className="moncompte-title">Connexion à Votre Compte</h3>
        <p className="moncompte-subtitle">
          Connectez-vous avec votre email et mot de passe
        </p>

        <form>
          {/* Email */}
          <label className="form-label">Adresse Email</label>
          <div className="input-group mb-3">
            <span className="input-group-text bg-light">
              <i className="bi bi-envelope"></i>
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="votre.email@example.com"
            />
          </div>

          {/* Mot de passe */}
          <label className="form-label">Mot de passe</label>
          <div className="input-group mb-4">
            <span className="input-group-text bg-light">
              <i className="bi bi-lock"></i>
            </span>
            <input
              type="password"
              className="form-control"
              placeholder=".........."
            />
          </div>

          <button className="btn btn-primary w-100">SE CONNECTER →</button>
        </form>

        <p className="moncompte-footer">
          Vous n'avez pas encore de compte ? <br />
          <a href="/register" className="text-primary">

            Créez votre compte gratuitement
          </a>
        </p>
      </div>
    </div>
  );
}
