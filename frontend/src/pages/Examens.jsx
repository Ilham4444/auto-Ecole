import React from "react";
import "../assets/css/style.scss";

export default function Examens() {
  return (
    <section className="examens-page">
      <h1 className="text-center mb-4">Réservez Votre Examen</h1>

      <div className="examens-container">

        {/* ---- EXAMEN CODE ---- */}
        <div className="examen-card">
          <span className="badge">Examen Officiel</span>

  
          <div className="price-top">
            <h1>300 Dh</h1>
            <span className="hours">1 heure</span>
          </div>

          <h3>Examen Code</h3>
          <p className="description">
            Examen théorique du code de la route – 40 questions
          </p>

          <div className="pre-requis">
            <h4>Prérequis :</h4>
            <ul>
              <li>Avoir étudié le code</li>
              <li>Carte d’identité valide</li>
              <li>Convocation (fournie)</li>
            </ul>
          </div>

          <button className="btn-primary">Réserver</button>
        </div>

        {/* ---- EXAMEN CONDUITE ---- */}
        <div className="examen-card">
          <span className="badge">Examen Officiel</span>

          {/* PRIX EXACTEMENT B7AL PERMIS */}
          <div className="price-top">
            <h1>200 Dh</h1>
            <span className="hours">45 minutes</span>
          </div>

          <h3>Examen Conduite</h3>
          <p className="description">
            Examen pratique de conduite – permis B
          </p>

          <div className="pre-requis">
            <h4>Prérequis :</h4>
            <ul>
              <li>Avoir réussi le code</li>
              <li>Minimum 20h de conduite</li>
              <li>Carte d’identité valide</li>
            </ul>
          </div>

          <button className="btn-primary">Réserver</button>
        </div>

      </div>
    </section>
  );
}
