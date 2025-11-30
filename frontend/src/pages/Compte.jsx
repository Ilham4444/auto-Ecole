import React, { useState } from "react";
<<<<<<< Updated upstream
import { useNavigate, Link } from "react-router-dom";
=======
import { useNavigate } from "react-router-dom";
>>>>>>> Stashed changes
import "../assets/css/style.scss";
import { useUser } from "../context/UserContext";
import api from "../api";

export default function Compte() {
<<<<<<< Updated upstream
  const { loginUser } = useUser();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
=======
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
>>>>>>> Stashed changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
<<<<<<< Updated upstream
      const response = await api.post("/login", formData);

      if (response.data.status) {
        // Stocker le token et les infos utilisateur
        loginUser(response.data.user, response.data.token);

        // Redirection vers dashboard
        navigate("/dashboard");
      } else {
        setError(response.data.message || "Email ou mot de passe incorrect");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError(
        err.response?.data?.message || "Connexion échouée. Vérifiez vos identifiants."
      );
    }

    setLoading(false);
=======
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
>>>>>>> Stashed changes
  };

  return (
    <div className="moncompte-container">
      <div className="moncompte-card">
        <h3>Connexion à Votre Compte</h3>

<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
        </p>
      </div>
    </div>
  );
}