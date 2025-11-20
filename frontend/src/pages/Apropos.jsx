import React from "react";
import "../assets/css/style.scss";
import logo from "../assets/logo.png";

export default function Apropos() {
  return (
    <section>
  
      
    <div className="apropos-container">
      <div className="section ">
              <img 
        src={logo} 
        alt="Drive UP" 
        className="apropos-image"
        style={{ width: "50px" }} 
      />
      <h2>Drive UP</h2>
      <p>Votre auto-école de confiance depuis 2005</p>
      </div>

      <div className="section">
        <h3>Catégories de Permis</h3>
        <ul>
          <li>Permis B - Véhicules Légers</li>
          <li>Permis A - Motocycles</li>
          <li>Permis C - Poids Lourds</li>
          <li>Permis D - Transport Personnes</li>
        </ul>
      </div>

      <div className="section">
        <h3>Informations</h3>
        <ul>
          <li>À propos</li>
          <li>Tarifs</li>
          <li>Nos moniteurs</li>
          <li>FAQ</li>
          <li>Espace Moniteurs</li>
        </ul>
      </div>

      <div className="section">
        <h3>Contact</h3>
        <p>Rue de Hassan 2</p>
        <p>Agadir, Maroc</p>
        <p>Tel: 0631212766</p>
        <p>Email: contact@driveup.ma</p>
      </div>
    </div>

    </section>
  );
}




     
 