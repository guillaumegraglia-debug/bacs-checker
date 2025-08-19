import React, { useState } from "react";
import "./index.css";

export default function App() {
  const [surface, setSurface] = useState("");
  const [assujetti, setAssujetti] = useState(null);

  const checkAssujettissement = () => {
    if (surface >= 1000) {
      setAssujetti(true);
    } else {
      setAssujetti(false);
    }
  };

  return (
    <div className="page-bg">
      <div className="app-container">
        <h1 className="title">🚀 Vérificateur BACS</h1>

        <div className="card">
          <p className="intro">
            Bienvenue dans l’outil de test du décret BACS. 
            <span className="emoji">⚡</span>
          </p>

          {/* --- FORMULAIRE --- */}
          <div className="form-row">
            <div>
              <label className="label">Surface du bâtiment (m²)</label>
              <input
                type="number"
                value={surface}
                onChange={(e) => setSurface(e.target.value)}
                className="input"
                placeholder="Ex : 1500"
              />
            </div>

            <div>
              <label className="label">Date de construction</label>
              <input
                type="date"
                className="input"
              />
            </div>
          </div>

          <button onClick={checkAssujettissement} className="btn">
            Vérifier l’assujettissement
          </button>

          {/* --- RESULTAT --- */}
          {assujetti !== null && (
            <div className={`result ${assujetti ? "ok" : "ko"}`}>
              {assujetti ? "✅ Bâtiment assujetti au décret BACS" : "❌ Non assujetti"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
