import React, { useState } from "react";
import axios from "axios";

export default function Paiement() {
  const [amount, setAmount] = useState(100); // exemple : 100 dh
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/payment/create", {
        amount,
      });

      // CMI redirection URL
      window.location.href = res.data.payment_url;

    } catch (err) {
      alert("Erreur de paiement");
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h2>Paiement sécurisé</h2>

      <label className="form-label">Montant à payer</label>
      <input
        type="number"
        className="form-control"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      <button
        className="btn btn-primary mt-3"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Chargement..." : "Payer Maintenant"}
      </button>
    </div>
  );
}
