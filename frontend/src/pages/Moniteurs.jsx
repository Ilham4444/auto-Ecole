import React from "react";
import "../assets/css/style.scss";
import moniteur1 from "../assets/Moniteur1.jpg";
import moniteur2 from "../assets/Moniteur2.jpg";
import moniteur4 from "../assets/Moniteur4.jpg";

export default function Moniteurs() {
  const moniteurs = [
    {
      id: 1,
      nom: "Youssef El Amrani",
      experience: "12 ans d'expérience",
      image: moniteur1,
      rating: "4.9",
      reviews: 156,
      skills: ["Débutants", "Conduite urbaine", "Autoroute"],
    },
    {
      id: 2,
      nom: "Fatima Zahra Bennani",
      experience: "8 ans d'expérience",
      image: moniteur2,
      rating: "4.8",
      reviews: 203,
      skills: ["Conduite accompagnée", "Manœuvres", "Perfectionnement"],
    },
    {
      id: 3,
      nom: "Mohammed Alaoui",
      experience: "15 ans d'expérience",
      image: moniteur4,
      rating: "4.9",
      reviews: 189,
      skills: ["Conduite sportive", "Éco-conduite", "Préparation examen"],
    },
    /*{
      id: 4,
      nom: "Karima El Idrissi",
      experience: "10 ans d'expérience",
      image: "/src/assets/Moniteur3.jpg",
      rating: "4.9",
      reviews: 175,
      skills: ["Débutants", "Conduite de nuit", "Stationnement"],
    },*/
  ];

  return (
    <section className="moniteurs-section">
      <div className="container">
        <h2 className="title">Nos Moniteurs Experts</h2>
        <p className="subtitle">
          Une équipe passionnée et pédagogique à votre service.
        </p>

        <div className="moniteurs-grid">
          {moniteurs.map((m) => (
            <div className="moniteur-card" key={m.id}>
              <div className="moniteur-img-wrapper">
                <img src={m.image} alt={m.nom} className="moniteur-img" />
              </div>
              <div className="moniteur-info">
                <h3 className="moniteur-nom">{m.nom}</h3>
                <p className="moniteur-exp">{m.experience}</p>

                <p className="moniteur-rating">
                  ⭐ {m.rating} <span>({m.reviews}) avis</span>
                </p>

                <div className="moniteur-skills">
                  {m.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
