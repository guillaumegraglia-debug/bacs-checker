import React, { useMemo, useState } from "react";
import Input from "./components/Input";

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
    roi: false, // coche "ROI > 10 ans" déclaratif
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

  // --- Module 1 : règle d'assujettissement / échéance
  const isTertiaire = formData.buildingType === "tertiaire";
  const assujetti = isTertiaire && totalPower > 290;
  const echeance =
    formData.constructionDate === "after2021"
      ? "Obligation dès la mise en service (bâtiment neuf)."
      : formData.constructionDate === "before2021"
      ? "Obligation au 1er janvier 2025 (bâtiment existant)."
      : "Précisez la date de construction pour déterminer l'échéance exacte.";

  // --- Module 2 : paramètres économiques (éditables)
  const [eco, setEco] = useState({
    capexPerKW: 80, // €/kW (par défaut, ajustable)
    cvcKwhPerKW: 1200, // kWh/kW/an si conso inconnue (approx.)
    energyPrice: 0.16, // €/kWh moyen
    savingPct: 15, // % d'économie CVC
    knownCvcKwh: "", // conso CVC réelle si connue (kWh/an)
  });

  // Estimation de conso CVC annuelle (kWh/an)
  const cvcKwhYear = useMemo(() => {
    const known = numOrZero(eco.knownCvcKwh);
    if (known > 0) return known;
    return totalPower * eco.cvcKwhPerKW;
  }, [eco.knownCvcKwh, eco.cvcKwhPerKW, totalPower]);

  // CAPEX estimé (ordre de grandeur)
  const capex = useMemo(() => {
    return totalPower * eco.capexPerKW; // € (simplifié)
  }, [totalPower, eco.capexPerKW]);

  // Économies annuelles estimées (en €)
  const annualSavingEuro = useMemo(() => {
    const gain = (eco.savingPct / 100) * cvcKwhYear * eco.energyPrice;
    return Math.max(0, gain);
  }, [eco.savingPct, cvcKwhYear, eco.energyPrice]);

  // ROI simple (années)
  const roiYears = useMemo(() => {
    if (annualSavingEuro <= 0) return Infinity;
    return capex / annualSavingEuro;
  }, [capex, annualSavingEuro]);

  // Gap de classe GTB
  const requiredClass = "B";
  const currentClass = formData.gtb === "none" ? "aucune" : formData.gtb;
  const classUpgrade =
    formData.gtb === "A" || formData.gtb === "B"
      ? "Conforme (vérifier fonctionnalités minimales)."
      : `Mise à niveau requise vers classe ${requiredClass}.`;

  // Dérogation potentielle (déclarée ou calculée)
  const derogationByROI = roiYears > 10 || formData.roi === true;
  const derogationByTech = formData.technicalIssue === true;
  const derogationByHeritage = formData.heritage === true;
  const derogationPossible =
    assujetti && (derogationByROI || derogationByTech || derogationByHeritage);

  // Messages statut
  const statutMessage = !isTertiaire
    ? "❌ Non assujetti : bâtiment non tertiaire."
    : totalPower <= 290
    ? "❌ Non assujetti : puissance totale ≤ 290 kW."
    : "✅ Assujetti : décret BACS applicable.";

  return (
    <div className="max-w-4xl w-full mx-auto p-6 bg-white shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold mb-1 text-primary">
        Vérifiez si votre bâtiment est concerné par le décret BACS
      </h1>
      <p className="text-sm text-secondary mb-6">
        Module 1 (éligibilité) + Module 2 (diagnostic détaillé).
      </p>

      {/* --- FORMULAIRE --- */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Partie gauche */}
        <div>
          <label className="block mb-2 font-medium">Nom du bâtiment</label>
          <Input
            type="text"
            className="mb-4"
            placeholder="Ex : Tour Alpha"
            value={formData.buildingName}
            onChange={(e) =>
              setFormData({ ...formData, buildingName: e.target.value })
            }
          />

          <label className="block mb-2 font-medium">Type de bâtiment</label>
          <select
            className="w-full p-2 border rounded mb-4"
            value={formData.buildingType}
            onChange={(e) =>
              setFormData({ ...formData, buildingType: e.target.value })
            }
          >
            <option value="">-- Sélectionnez --</option>
            <option value="tertiaire">Tertiaire</option>
            <option value="autre">Autre</option>
          </select>

          <label className="block mb-2 font-medium">Date de construction</label>
          <select
            className="w-full p-2 border rounded mb-4"
            value={formData.constructionDate}
            onChange={(e) =>
              setFormData({ ...formData, constructionDate: e.target.value })
            }
          >
            <option value="">-- Sélectionnez --</option>
            <option value="before2021">Avant 21 juillet 2021</option>
            <option value="after2021">Après 21 juillet 2021</option>
          </select>

          {[ 
            { key: "heating", label: "Chauffage (kW)" },
            { key: "cooling", label: "Climatisation (kW)" },
            { key: "ventilation", label: "Ventilation (kW)" },
            { key: "ecs", label: "ECS couplée (kW) - optionnel" },
          ].map(({ key, label }) => (
            <div key={key} className="mb-4">
              <label className="block mb-2 font-medium">{label}</label>
              <Input
                type="number"
                inputMode="decimal"
                value={formData[key]}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
                placeholder="0"
                min="0"
              />
            </div>
          ))}

          <p className="mb-4 font-semibold">
            Puissance totale : {isNaN(totalPower) ? "-" : totalPower} kW
          </p>

          <label className="block mb-2 font-medium">Situations particulières</label>
          <div className="mb-4 space-y-1">
            <label className="block">
              <Input
                type="checkbox"
                checked={formData.heritage}
                onChange={(e) =>
                  setFormData({ ...formData, heritage: e.target.checked })
                }
              />
              Bâtiment classé / patrimoine
            </label>
            <label className="block">
              <Input
                type="checkbox"
                checked={formData.technicalIssue}
                onChange={(e) =>
                  setFormData({ ...formData, technicalIssue: e.target.checked })
                }
              />
              Impossibilité technique
            </label>
            <label className="block">
              <Input
                type="checkbox"
                checked={formData.roi}
                onChange={(e) =>
                  setFormData({ ...formData, roi: e.target.checked })
                }
              />
              ROI estimé &gt; 10 ans (déclaratif)
            </label>
          </div>

          <label className="block mb-2 font-medium">Système GTB existant</label>
          <select
            className="w-full p-2 border rounded mb-6"
            value={formData.gtb}
            onChange={(e) =>
              setFormData({ ...formData, gtb: e.target.value })
            }
          >
            <option value="none">Aucun</option>
            <option value="D">Classe D</option>
            <option value="C">Classe C</option>
            <option value="B">Classe B</option>
            <option value="A">Classe A</option>
          </select>
        </div>

        {/* Partie droite - Diagnostic */}
        <div className="p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-bold mb-2">Diagnostic automatique</h2>
          <p className="mb-2">{statutMessage}</p>

          {assujetti && (
            <>
              <p className="mb-4 text-sm text-gray-700">{echeance}</p>

              {/* Classe GTB */}
              <div className="mb-4 p-3 bg-white border rounded">
                <p className="font-semibold">Classe GTB minimale : B</p>
                <p className="text-sm text-gray-700">
                  Existant : <strong>{currentClass}</strong> → {classUpgrade}
                </p>
              </div>

              {/* Fonctionnalités */}
              <div className="mb-4 p-3 bg-white border rounded">
                <p className="font-semibold mb-1">
                  Fonctionnalités minimales (arrêté 24/04/2023) :
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>Mesure & enregistrement continu des consommations (CVC/ECS/éclairage si intégré).</li>
                  <li>Adaptation automatique à la demande (occupation, horaires, consignes).</li>
                  <li>Détection des dérives & alertes d’inefficience.</li>
                  <li>Arrêt/démarrage & régulation par zone/fonction.</li>
                  <li>Interopérabilité via protocoles ouverts (BACnet/KNX/Modbus...).</li>
                </ul>
              </div>

              {/* Mini-éco */}
              <div className="mb-4 p-3 bg-white border rounded">
                <p className="font-semibold mb-2">Mini-éco (paramétrable)</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <label className="block">
                    CAPEX (€/kW)
                    <Input
                      type="number"
                      value={eco.capexPerKW}
                      onChange={(e) =>
                        setEco({ ...eco, capexPerKW: Number(e.target.value) })
                      }
                      min="0"
                    />
                  </label>
                  <label className="block">
                    Conso CVC (kWh/kW/an)
                    <Input
                      type="number"
                      value={eco.cvcKwhPerKW}
                      onChange={(e) =>
                        setEco({ ...eco, cvcKwhPerKW: Number(e.target.value) })
                      }
                      min="0"
                    />
                  </label>
                  <label className="block">
                    Prix énergie (€/kWh)
                    <Input
                      type="number"
                      step="0.01"
                      value={eco.energyPrice}
                      onChange={(e) =>
                        setEco({ ...eco, energyPrice: Number(e.target.value) })
                      }
                      min="0"
                    />
                  </label>
                  <label className="block">
                    Gain attendu (%)
                    <Input
                      type="number"
                      value={eco.savingPct}
                      onChange={(e) =>
                        setEco({ ...eco, savingPct: Number(e.target.value) })
                      }
                      min="0"
                      max="40"
                    />
                  </label>
                  <label className="block col-span-2">
                    Conso CVC réelle (kWh/an) (optionnel)
                    <Input
                      type="number"
                      value={eco.knownCvcKwh}
                      onChange={(e) =>
                        setEco({ ...eco, knownCvcKwh: e.target.value })
                      }
                      min="0"
                      placeholder="Laisser vide pour estimer"
                    />
                  </label>
                </div>

                <div className="mt-3 text-sm">
                  <p>
                    CAPEX estimé :{" "}
                    <strong>{capex.toLocaleString("fr-FR")} €</strong>
                  </p>
                  <p>
                    Économies annuelles estimées :{" "}
                    <strong>{annualSavingEuro.toLocaleString("fr-FR")} €</strong>
                  </p>
                  <p>
                    ROI simple :{" "}
                    <strong>
                      {roiYears === Infinity ? "—" : roiYears.toFixed(1)} an(s)
                    </strong>{" "}
                    {roiYears > 10 && (
                      <span className="text-amber-600">(&gt; 10 ans)</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Plan d’actions */}
              <div className="mb-4 p-3 bg-secondary/10 border border-secondary/40 rounded">
                <p className="font-semibold mb-1">Plan d’actions recommandé</p>
                <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                  <li>Audit express : points de comptage, segmentation des zones, relevé protocoles existants.</li>
                  <li>Cadrage GTB : exigences <strong>classe B</strong>, fonctionnalités arrêtées, interopérabilité (BACnet/KNX/Modbus).</li>
                  <li>Spécifications & CCTP : architecture, bus, cybersécurité, recette & KPIs.</li>
                  <li>Déploiement par zones, réglages, formation exploitation.</li>
                  <li>Suivi de performance (3–6 mois), ajustements fins.</li>
                </ol>
              </div>

              {/* Dérogations */}
              {derogationPossible && (
                <div className="p-3 border rounded bg-amber-50">
                  <p className="font-semibold text-amber-700">
                    Dérogation potentielle
                  </p>
                  <ul className="list-disc list-inside text-sm text-amber-800">
                    {derogationByROI && (
                      <li>
                        TRI &gt; 10 ans (à documenter : hypothèses, prix énergie, gains).
                      </li>
                    )}
                    {derogationByTech && (
                      <li>
                        Impossibilité technique (justifications + variantes étudiées).
                      </li>
                    )}
                    {derogationByHeritage && (
                      <li>
                        Patrimoine protégé (avis ABF / contraintes spécifiques).
                      </li>
                    )}
                  </ul>
                  <p className="text-xs mt-1">
                    Remarque : une <strong>note de faisabilité</strong> et un{" "}
                    <strong>mémo économique</strong> sont nécessaires pour constituer
                    le dossier.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
