
import React from "react";
import "../assets/css/style.scss";

export default function Register() {
  return (
    <div className="moncompte-container">
      <div className="moncompte-card">
        <h3 className="moncompte-title text-center">Créer un Compte</h3>
        <p className="moncompte-subtitle text-center">
          Remplissez vos informations pour créer votre espace candidat
        </p>

        {/* --- FORMULAIRE 1 : Informations personnelles --- */}
        <div className="section-title mt-4 mb-2">
          <h5> Informations personnelles</h5>
        </div>

        <form>
          <label className="form-label">Nom </label>
          <input type="text" className="form-control mb-3" />

          <label className="form-label">Prénom</label>
          <input type="text" className="form-control mb-3" />

          <label className="form-label">Numéro de Carte Nationale (CIN)</label>
          <input type="text" className="form-control mb-3" />

          <label className="form-label">Date de naissance</label>
          <input type="date" className="form-control mb-3" />

          <label className="form-label">Adresse complète</label>
          <input type="text" className="form-control mb-4" />

          <label className="form-label">Email</label>
          <input type="email" className="form-control mb-3" />

          <label className="form-label">Numéro de téléphone</label>
          <input type="tel" className="form-control mb-3" />
          
          <label className="form-label">Mot de passe</label>
          <input type="password" className="form-control mb-3" />

          <label className="form-label"> Confirmer mot de passe</label>
          <input type="password" className="form-control mb-3" />
        </form>

        {/* --- FORMULAIRE 2 : Documents à télécharger --- */}
        <div className="section-title mt-4 mb-2">
          <h5> Télécharger vos documents</h5>
        </div>

        <form>
          <label className="form-label">Carte Nationale — Recto</label>
          <input type="file" className="form-control mb-3" accept="image/*,.pdf" />

          <label className="form-label">Carte Nationale — Verso</label>
          <input type="file" className="form-control mb-3" accept="image/*,.pdf" />

          <label className="form-label">Certificat médical</label>
          <input type="file" className="form-control mb-3" accept="image/*,.pdf" />

          <label className="form-label">Photo personnelle</label>
          <input type="file" className="form-control mb-4" accept="image/*" />
        </form>

        {/* --- FORMULAIRE 3 : Choix de la catégorie de permis --- */}
        <div className="section-title mt-4 mb-2">
          <h5> Choisir votre catégorie de permis</h5>
        </div>

        <form>
          <label className="form-label">Catégorie du permis</label>
          <select className="form-select mb-4">
            <option value="">— Sélectionner une catégorie —</option>
            <option value="A">A — Moto</option>
            <option value="A1">A1 — Cyclomoteur</option>
            <option value="B">B — Voiture</option>
            <option value="C">C — Camion</option>
            <option value="D">D — Transport voyageurs</option>
            <option value="EC">EC — Semi-remorque</option>
          </select>
        </form>

        {/* --- BOUTON --- */}
        <button className="btn btn-primary w-100 mb-3">
          CRÉER MON COMPTE →
        </button>

        <p className="moncompte-footer text-center">
          Vous avez déjà un compte ? <br />
          <a href="/compte" className="text-primary">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}
