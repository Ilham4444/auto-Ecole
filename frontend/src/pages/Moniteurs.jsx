import React from "react";
import "../assets/css/style.scss";

export default function Moniteurs() {
  const moniteurs = [
    {
      id: 1,
      nom: "Youssef El Amrani",
      experience: "12 ans d'expérience",
      image: "/images/moniteurs/youssef.jpg",
    },
    {
      id: 2,
      nom: "Fatima Zahra Bennani",
      experience: "8 ans d'expérience",
      image: "/images/moniteurs/fatima.jpg",
    },
    {
      id: 3,
      nom: "Mohammed Alaoui",
      experience: "15 ans d'expérience",
      image: "/images/moniteurs/mohammed.jpg",
    },
    {
      id: 4,
      nom: "Karima El Idrissi",
      experience: "10 ans d'expérience",
      image: "/images/moniteurs/karima.jpg",
    },
  ];

  return (
    <section className="moniteurs-section">
      <h2 className="text-primary mb-3 title">Nos Moniteurs Experts</h2>
      <p className="subtitle">
        Une équipe passionnée et pédagogique à votre service.
      </p>

      <div className="moniteurs-grid">
        {moniteurs.map((m) => (
          <div className="moniteur-card" key={m.id}>
            <img src={m.image} alt={m.nom} className="moniteur-img" />
            <h3 className="moniteur-nom">{m.nom}</h3>
            <p className="moniteur-exp">{m.experience}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

