import React from "react";
import "../assets/css/style.scss";

export default function Examens() {
  return (
    <section className="examens-page">

      <h1 className="title">Réservez Votre Examen</h1>

      <div className="examens-header">
        <p>Passez votre examen du code ou de conduite en toute confiance</p>
      </div>

      <div className="examens-container">

        {/* -------- Examen Code -------- */}
        <div className="examen-card">

          <div className="price-box">
            <h1>300 Dh</h1>
            <span>1 heure</span>
          </div>

          <h3 className="card-title">Examen Code</h3>

          <p className="description">
            Examen théorique du code de la route – 40 questions
          </p>

          <div className="pre-requis">
            <h4>Ce qui est inclus :</h4>
            <ul>
              <li>Avoir étudié le code</li>
              <li>Carte d'identité valide</li>
              <li>Convocation (fournie)</li>
              <li>Arriver 15 min en avance</li>
            </ul>
          </div>

          <button className="btn-reserver">Réserver l'examen</button>
        </div>

        {/* -------- Examen Conduite -------- */}
        <div className="examen-card">

          <div className="price-box">
            <h1>200 Dh</h1>
            <span>45 minutes</span>
          </div>

          <h3 className="card-title">Examen Conduite</h3>

          <p className="description">
            Examen pratique de conduite – permis B
          </p>

          <div className="pre-requis">
            <h4>Ce qui est inclus :</h4>
            <ul>
              <li>Avoir réussi le code</li>
              <li>Minimum 20h de conduite</li>
              <li>Carte d'identité valide</li>
              <li>Livret d'apprentissage</li>
            </ul>
          </div>

          <button className="btn-reserver">Réserver l'examen</button>
        </div>

      </div>
    </section>
  );
}
