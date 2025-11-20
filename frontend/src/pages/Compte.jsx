import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/style.scss";

export default function Compte() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/login", {
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
        navigate("/dashboard"); // Rediriger vers le dashboard
      } else {
        setError(data.message || "Erreur de connexion");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="moncompte-container">
      <div className="moncompte-card">
        <h3 className="moncompte-title">Connexion à Votre Compte</h3>
        <p className="moncompte-subtitle">
          Connectez-vous avec votre email et mot de passe
        </p>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <label className="form-label">Adresse Email</label>
          <div className="input-group mb-3">
            <span className="input-group-text bg-light">
              <i className="bi bi-envelope"></i>
            </span>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="votre.email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
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
              name="password"
              className="form-control"
              placeholder=".........."
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
  
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Connexion..." : "SE CONNECTER →"}
          </button>
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