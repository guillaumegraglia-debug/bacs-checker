import React, { useState } from "react";
import "./index.css";

export default function App() {
  // États Module 1
  const [surface, setSurface] = useState("");
  const [usage, setUsage] = useState("");
  const [chauffage, setChauffage] = useState("");
  const [clim, setClim] = useState("");
  const [gtb, setGtb] = useState("non");

  // États Module 2
  const [construction, setConstruction] = useState("");
  const [renovation, setRenovation] = useState("");
  const [assujetti, setAssujetti] = useState(false);

  const verifierAssujettissement = () => {
    if (surface >= 1000) {
      setAssujetti(true);
    } else {
      setAssujetti(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-emerald-100 flex items-center justify-center p-6">
      <div className="app-container bg-white shadow-xl rounded-2xl p-10 w-full max-w-5xl">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-10 flex items-center justify-center gap-2">
          🚀 Vérificateur BACS
        </h1>

        <p className="text-gray-700 text-center mb-8">
          Bienvenue dans l’outil de test du décret BACS ⚡  
          Remplis les informations ci-dessous pour savoir si ton bâtiment est
          assujetti.
        </p>

        {/* --------- MODULE 1 --------- */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-sky-700 mb-6">🏢 Module 1 — Données générales</h2>
          <div className="form-row">
            <div>
              <label className="label">Surface du bâtiment (m²)</label>
              <input
                type="number"
                className="input"
                value={surface}
                onChange={(e) => setSurface(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Usage principal</label>
              <select
                className="select"
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
              >
                <option value="">-- Choisir --</option>
                <option>Bureaux</option>
                <option>Enseignement</option>
                <option>Commerce</option>
                <option>Hospitalier</option>
                <option>Autre</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="label">Système de chauffage</label>
              <select
                className="select"
                value={chauffage}
                onChange={(e) => setChauffage(e.target.value)}
              >
                <option value="">-- Choisir --</option>
                <option>Chaudière gaz</option>
                <option>Chaudière fioul</option>
                <option>Réseau de chaleur</option>
                <option>Pompe à chaleur</option>
              </select>
            </div>
            <div>
              <label className="label">Climatisation</label>
              <select
                className="select"
                value={clim}
                onChange={(e) => setClim(e.target.value)}
              >
                <option value="">-- Choisir --</option>
                <option>Oui</option>
                <option>Non</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="label">GTB existante</label>
              <select
                className="select"
                value={gtb}
                onChange={(e) => setGtb(e.target.value)}
              >
                <option value="non">Non</option>
                <option value="partielle">Partielle</option>
                <option value="totale">Totale</option>
              </select>
            </div>
          </div>
        </div>

        {/* --------- MODULE 2 --------- */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-emerald-700 mb-6">📅 Module 2 — Caractéristiques temporelles</h2>
          <div className="form-row">
            <div>
              <label className="label">Date de construction</label>
              <input
                type="date"
                className="input"
                value={construction}
                onChange={(e) => setConstruction(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Dernière rénovation énergétique</label>
              <input
                type="date"
                className="input"
                value={renovation}
                onChange={(e) => setRenovation(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* --------- BOUTON + RESULTAT --------- */}
        <div className="text-center">
          <button className="btn" onClick={verifierAssujettissement}>
            Vérifier l’assujettissement
          </button>
        </div>

        {assujetti && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2">
            ✅ <span className="font-semibold">Bâtiment assujetti au décret BACS</span>
          </div>
        )}

        {!assujetti && surface !== "" && (
          <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded-xl flex items-center gap-2">
            ❌ <span className="font-semibold">Bâtiment non assujetti</span>
          </div>
        )}
      </div>
    </div>
  );
}
