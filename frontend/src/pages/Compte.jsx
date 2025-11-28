import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/css/style.scss";
import { useUser } from "../context/UserContext"; // ← IMPORT CONTEXTE

export default function Compte() {
  const { loginUser } = useUser(); // ← Fonction du contexte
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
        mode: "cors",
      });

      const data = await response.json();

      if (response.ok && data.status) {
        // 🔥 Met à jour le contexte + localStorage
        loginUser(data.user, data.token);

        // 🔥 Redirection vers dashboard
        navigate("/dashboard");
      } else {
        setError(data.message || "Email ou mot de passe incorrect");
      }
    } catch (err) {
      setError("Connexion échouée.");
    }

    setLoading(false);
  };

  return (
    <div className="moncompte-container">
      <div className="moncompte-card">
        <h3>Connexion à Votre Compte</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control mb-3"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Mot de passe</label>
          <input
            type="password"
            name="password"
            className="form-control mb-4"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Connexion..." : "SE CONNECTER →"}
          </button>
        </form>

        <p className="mt-4">
          Pas de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}
