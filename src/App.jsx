import React, { useState } from "react";
import "./index.css";

export default function App() {
  const [surface, setSurface] = useState("");
  const [date, setDate] = useState("");
  const [usage, setUsage] = useState("");
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
            Bienvenue dans l’outil de test du décret BACS. <span>⚡</span>
          </p>

          {/* --- FORMULAIRE COMPLET --- */}
          <div className="form-grid">
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label">Usage principal</label>
              <select
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                className="select"
              >
                <option value="">-- Choisir --</option>
                <option value="bureau">Bureaux</option>
                <option value="enseignement">Enseignement</option>
                <option value="sante">Santé</option>
                <option value="commerce">Commerce</option>
                <option value="industrie">Industrie</option>
              </select>
            </div>

            <div>
              <label className="label">Système GTB existant ?</label>
              <select className="select">
                <option value="">-- Choisir --</option>
                <option value="oui">Oui</option>
                <option value="non">Non</option>
              </select>
            </div>
          </div>

          {/* --- ACTION --- */}
          <button onClick={checkAssujettissement} className="btn">
            Vérifier l’assujettissement
          </button>

          {/* --- RESULTAT --- */}
          {assujetti !== null && (
            <div className={`result ${assujetti ? "ok" : "ko"}`}>
              {assujetti
                ? "✅ Bâtiment assujetti au décret BACS"
                : "❌ Non assujetti"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
