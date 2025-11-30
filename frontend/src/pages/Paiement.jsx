import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Paiement() {
  const [montant, setMontant] = useState(""); // montant à payer
  const [motif, setMotif] = useState(""); // motif du paiement
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!montant || montant <= 0) {
      alert("Veuillez entrer un montant valide");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Vous devez être connecté pour effectuer un paiement");
        navigate("/compte");
        return;
      }

      const res = await axios.post("http://127.0.0.1:8000/api/paiements", {
        montant: parseInt(montant),
        date: new Date().toISOString().split('T')[0], // Date actuelle au format YYYY-MM-DD
        motif: motif || "Paiement pour formation auto-école"
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });

      alert("✅ Paiement effectué avec succès!");
      // Rediriger vers le dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error("Erreur de paiement:", err);
      if (err.response?.status === 401) {
        alert("Session expirée. Veuillez vous reconnecter.");
        navigate("/compte");
      } else {
        alert("❌ Erreur lors du paiement: " + (err.response?.data?.message || "Erreur inconnue"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title mb-4">💳 Paiement sécurisé</h2>

              <form onSubmit={handlePayment}>
                <div className="mb-3">
                  <label className="form-label">Montant à payer (Dh)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={montant}
                    onChange={e => setMontant(e.target.value)}
                    placeholder="Ex: 1000"
                    required
                    min="1"
                  />
                  <small className="text-muted">Minimum: 1 Dh</small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Motif du paiement (optionnel)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={motif}
                    onChange={e => setMotif(e.target.value)}
                    placeholder="Ex: Inscription Permis B"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Traitement en cours..." : "💳 Payer Maintenant"}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary w-100 mt-2"
                  onClick={() => navigate("/dashboard")}
                  disabled={loading}
                >
                  ← Retour au tableau de bord
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
