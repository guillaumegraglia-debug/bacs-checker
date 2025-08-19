import React, { useMemo, useState } from "react";

/* --- Petits pictos inline --- */
const IconBuilding = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M4 20h16v2H4zM6 8h4v4H6V8zm0-6h12v18H4V2h2zm6 6h4v4h-4V8z"/>
  </svg>
);
const IconPower = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M11 21h-1l1-7H7l6-11h1l-1 7h4l-6 11z"/>
  </svg>
);
const IconCalendar = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2Zm13 8H4v10h16V10Z"/>
  </svg>
);

export default function BACSForm() {
  const [formData, setFormData] = useState({
    buildingName: "",
    buildingType: "",
    constructionDate: "",
    heating: "",
    cooling: "",
    ventilation: "",
    ecs: "",
    heritage: false,
    technicalIssue: false,
    roi: false,
    gtb: "none",
  });

  const numOrZero = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const totalPower =
    numOrZero(formData.heating) +
    numOrZero(formData.cooling) +
    numOrZero(formData.ventilation) +
    numOrZero(formData.ecs);

  // Module 1
  const isTertiaire = formData.buildingType === "tertiaire";
  const assujetti = isTertiaire && totalPower > 290;
  const echeance =
    formData.constructionDate === "after2021"
      ? "Obligation dès la mise en service (bâtiment neuf)."
      : formData.constructionDate === "before2021"
      ? "Obligation au 1er janvier 2025 (bâtiment existant)."
      : "Précisez la date de construction pour déterminer l'échéance exacte.";

  // Module 2 (éco)
  const [eco, setEco] = useState({
    capexPerKW: 80,
    cvcKwhPerKW: 1200,
    energyPrice: 0.16,
    savingPct: 15,
    knownCvcKwh: "",
  });

  const cvcKwhYear = useMemo(() => {
    const known = numOrZero(eco.knownCvcKwh);
    return known > 0 ? known : totalPower * eco.cvcKwhPerKW;
  }, [eco.knownCvcKwh, eco.cvcKwhPerKW, totalPower]);

  const capex = useMemo(() => totalPower * eco.capexPerKW, [totalPower, eco.capexPerKW]);

  const annualSavingEuro = useMemo(() => {
    const gain = (eco.savingPct / 100) * cvcKwhYear * eco.energyPrice;
    return Math.max(0, gain);
  }, [eco.savingPct, cvcKwhYear, eco.energyPrice]);

  const roiYears = useMemo(() => (annualSavingEuro <= 0 ? Infinity : capex / annualSavingEuro), [capex, annualSavingEuro]);

  const requiredClass = "B";
  const currentClass = formData.gtb === "none" ? "aucune" : formData.gtb;
  const classUpgrade =
    formData.gtb === "A" || formData.gtb === "B"
      ? "Conforme (vérifier fonctionnalités minimales)."
      : `Mise à niveau requise vers classe ${requiredClass}.`;

  const derogationByROI = roiYears > 10 || formData.roi === true;
  const derogationByTech = formData.technicalIssue === true;
  const derogationByHeritage = formData.heritage === true;
  const derogationPossible = assujetti && (derogationByROI || derogationByTech || derogationByHeritage);

  const statutMessage = !isTertiaire
    ? "❌ Non assujetti : bâtiment non tertiaire."
    : totalPower <= 290
    ? "❌ Non assujetti : puissance totale ≤ 290 kW."
    : "✅ Assujetti : décret BACS applicable.";

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Colonne formulaire */}
      <section className="card p-5 md:p-6">
        <div className="flex items-center gap-2 mb-3">
          <IconBuilding className="h-5 w-5 text-slate-600" />
          <span className="section-title">Module 1 · Éligibilité</span>
        </div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Caractéristiques du bâtiment
        </h2>

        <label className="label">Nom du bâtiment</label>
        <input
          className="input mb-4"
          placeholder="Ex : Tour Alpha"
          value={formData.buildingName}
          onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
        />

        <label className="label">Type de bâtiment</label>
        <select
          className="select mb-4"
          value={formData.buildingType}
          onChange={(e) => setFormData({ ...formData, buildingType: e.target.value })}
        >
          <option value="">-- Sélectionnez --</option>
          <option value="tertiaire">Tertiaire</option>
          <option value="autre">Autre</option>
        </select>

        <label className="label">Date de construction</label>
        <select
          className="select mb-4"
          value={formData.constructionDate}
          onChange={(e) => setFormData({ ...formData, constructionDate: e.target.value })}
        >
          <option value="">-- Sélectionnez --</option>
          <option value="before2021">Avant 21 juillet 2021</option>
          <option value="after2021">Après 21 juillet 2021</option>
        </select>

        <div className="grid grid-cols-2 gap-4">
          {[
            { key: "heating", label: "Chauffage (kW)" },
            { key: "cooling", label: "Climatisation (kW)" },
            { key: "ventilation", label: "Ventilation (kW)" },
            { key: "ecs", label: "ECS (kW) - optionnel" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input
                type="number"
                inputMode="decimal"
                className="input"
                value={formData[key]}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                placeholder="0"
                min="0"
              />
            </div>
          ))}
        </div>

        <p className="mt-3 text-sm text-slate-700 flex items-center gap-2">
          <IconPower className="h-4 w-4 text-blue-600" />
          <span>Puissance totale : <strong>{isNaN(totalPower) ? "-" : totalPower} kW</strong></span>
        </p>

        <div className="mt-4">
          <label className="label">Situations particulières</label>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.heritage}
                onChange={(e) => setFormData({ ...formData, heritage: e.target.checked })}
              />
              <span className="text-sm">Bâtiment classé / patrimoine</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.technicalIssue}
                onChange={(e) => setFormData({ ...formData, technicalIssue: e.target.checked })}
              />
              <span className="text-sm">Impossibilité technique</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.roi}
                onChange={(e) => setFormData({ ...formData, roi: e.target.checked })}
              />
              <span className="text-sm">ROI estimé &gt; 10 ans</span>
            </label>
          </div>
        </div>

        <div className="mt-4">
          <label className="label">Système GTB existant</label>
          <select
            className="select"
            value={formData.gtb}
            onChange={(e) => setFormData({ ...formData, gtb: e.target.value })}
          >
            <option value="none">Aucun</option>
            <option value="D">Classe D</option>
            <option value="C">Classe C</option>
            <option value="B">Classe B</option>
            <option value="A">Classe A</option>
          </select>
        </div>
      </section>

      {/* Colonne diagnostic */}
      <section className="card p-5 md:p-6">
        <div className="flex items-center gap-2 mb-3">
          <IconCalendar className="h-5 w-5 text-slate-600" />
          <span className="section-title">Module 2 · Diagnostic</span>
        </div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Résultat & recommandations
        </h2>

        <div className="mb-3">
          {assujetti ? (
            <span className="badge-ok">Assujetti</span>
          ) : (
            <span className="badge-ko">Non assujetti</span>
          )}
        </div>

        <div className="card p-4 mb-4">
          <p className="text-slate-800">{statutMessage}</p>
          {assujetti && <p className="text-sm text-slate-600 mt-1">{echeance}</p>}
        </div>

        {assujetti && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="card p-4">
                <p className="text-sm text-slate-500 mb-1">Classe GTB minimale</p>
                <p className="text-lg font-semibold">B</p>
                <p className="text-sm text-slate-600 mt-2">
                  Existant : <strong>{currentClass}</strong> → {classUpgrade}
                </p>
              </div>
              <div className="card p-4">
                <p className="text-sm text-slate-500 mb-1">Dérogation potentielle</p>
                {derogationPossible ? (
                  <span className="badge-warn">À justifier (ROI &gt; 10 ans / technique / patrimoine)</span>
                ) : (
                  <span className="badge-ok">Aucune identifiée</span>
                )}
              </div>
            </div>

            <div className="card p-4 mt-4">
              <p className="text-sm font-semibold mb-2">Fonctionnalités minimales</p>
              <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                <li>Mesure & enregistrement continu des conso (CVC/ECS/éclairage si intégré).</li>
                <li>Adaptation automatique à la demande (occupation, horaires, consignes).</li>
                <li>Détection des dérives & alertes.</li>
                <li>Arrêt/démarrage & régulation par zone/fonction.</li>
                <li>Interopérabilité (BACnet / KNX / Modbus…).</li>
              </ul>
            </div>

            <div className="card p-4 mt-4">
              <p className="text-sm font-semibold mb-3">Mini-éco (paramétrable)</p>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm">
                  CAPEX (€/kW)
                  <input
                    type="number"
                    className="input mt-1"
                    value={eco.capexPerKW}
                    onChange={(e) => setEco({ ...eco, capexPerKW: Number(e.target.value) })}
                    min="0"
                  />
                </label>
                <label className="text-sm">
                  Conso CVC (kWh/kW/an)
                  <input
                    type="number"
                    className="input mt-1"
                    value={eco.cvcKwhPerKW}
                    onChange={(e) => setEco({ ...eco, cvcKwhPerKW: Number(e.target.value) })}
                    min="0"
                  />
                </label>
                <label className="text-sm">
                  Prix énergie (€/kWh)
                  <input
                    type="number"
                    step="0.01"
                    className="input mt-1"
                    value={eco.energyPrice}
                    onChange={(e) => setEco({ ...eco, energyPrice: Number(e.target.value) })}
                    min="0"
                  />
                </label>
                <label className="text-sm">
                  Gain attendu (%)
                  <input
                    type="number"
                    className="input mt-1"
                    value={eco.savingPct}
                    onChange={(e) => setEco({ ...eco, savingPct: Number(e.target.value) })}
                    min="0" max="40"
                  />
                </label>
                <label className="text-sm md:col-span-2">
                  Conso CVC réelle (kWh/an) (optionnel)
                  <input
                    type="number"
                    className="input mt-1"
                    value={eco.knownCvcKwh}
                    onChange={(e) => setEco({ ...eco, knownCvcKwh: e.target.value })}
                    min="0"
                    placeholder="Laisser vide pour estimer"
                  />
                </label>
              </div>

              <div className="mt-3 text-sm">
                <p>CAPEX estimé : <strong>{capex.toLocaleString("fr-FR")} €</strong></p>
                <p>Économies annuelles : <strong>{annualSavingEuro.toLocaleString("fr-FR")} €</strong></p>
                <p>ROI simple : <strong>{roiYears === Infinity ? "—" : roiYears.toFixed(1)} an(s)</strong> {roiYears > 10 && <span className="text-amber-600">(> 10 ans)</span>}</p>
              </div>
            </div>
          </>
        )}
      </section>

      {/* CTA bas de page */}
      <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Besoin d’un rapport PDF client ? (Module 3)
        </p>
        <div className="flex gap-2">
          <a className="btn-ghost" href="#" onClick={(e) => e.preventDefault()}>
            Voir un aperçu
          </a>
          <button className="btn-primary">Exporter (bientôt)</button>
        </div>
      </div>
    </div>
  );
}
