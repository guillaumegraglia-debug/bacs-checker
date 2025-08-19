import React, { useState } from "react";

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

  const [result, setResult] = useState("");

  const numOrZero = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  // Calcul de la puissance totale
  const totalPower =
    numOrZero(formData.heating) +
    numOrZero(formData.cooling) +
    numOrZero(formData.ventilation) +
    numOrZero(formData.ecs);

  // Fonction de calcul de l'assujettissement
  const calculateResult = () => {
    if (!formData.buildingType) {
      setResult("Veuillez sélectionner un type de bâtiment.");
      return;
    }

    if (formData.buildingType !== "tertiaire") {
      setResult("❌ Non assujetti : bâtiment non tertiaire.");
      return;
    }

    if (!Number.isFinite(totalPower) || totalPower <= 290) {
      setResult("❌ Non assujetti : puissance totale inférieure ou égale à 290 kW.");
      return;
    }

    let message = "";
    if (formData.constructionDate === "after2021") {
      message = "✅ Assujetti : bâtiment neuf, obligation immédiate (dès construction).";
    } else if (formData.constructionDate === "before2021") {
      message = "✅ Assujetti : bâtiment existant, obligation au 1er janvier 2025.";
    } else {
      message = "✅ Assujetti : précisez la date de construction pour l'échéance exacte.";
    }

    if (formData.heritage || formData.technicalIssue || formData.roi) {
      message += " ⚠️ Dérogation potentielle (justificatifs requis).";
    }
    setResult(message);
  };

  return (
    <div className="max-w-2xl w-full mx-auto p-6 bg-white shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold mb-2">
        Vérifiez si votre bâtiment est concerné par le décret BACS
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Renseignez les informations pour calculer votre statut d'assujettissement.
      </p>

      {/* Nom du bâtiment */}
      <label className="block mb-2 font-medium">Nom du bâtiment</label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        placeholder="Ex : Tour Alpha"
        value={formData.buildingName}
        onChange={(e) =>
          setFormData({ ...formData, buildingName: e.target.value })
        }
      />

      {/* Type de bâtiment */}
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

      {/* Date de construction */}
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

      {/* Puissances */}
      {[
        { key: "heating", label: "Chauffage (kW)" },
        { key: "cooling", label: "Climatisation (kW)" },
        { key: "ventilation", label: "Ventilation (kW)" },
        { key: "ecs", label: "ECS couplée (kW) - optionnel" },
      ].map(({ key, label }) => (
        <div key={key} className="mb-4">
          <label className="block mb-2 font-medium">{label}</label>
          <input
            type="number"
            inputMode="decimal"
            className="w-full p-2 border rounded"
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

      {/* Situations particulières */}
      <label className="block mb-2 font-medium">Situations particulières</label>
      <div className="mb-4 space-y-1">
        <label className="block">
          <input
            type="checkbox"
            checked={formData.heritage}
            onChange={(e) =>
              setFormData({ ...formData, heritage: e.target.checked })
            }
          />{" "}
          Bâtiment classé / patrimoine
        </label>
        <label className="block">
          <input
            type="checkbox"
            checked={formData.technicalIssue}
            onChange={(e) =>
              setFormData({ ...formData, technicalIssue: e.target.checked })
            }
          />{" "}
          Impossibilité technique
        </label>
        <label className="block">
          <input
            type="checkbox"
            checked={formData.roi}
            onChange={(e) =>
              setFormData({ ...formData, roi: e.target.checked })
            }
          />{" "}
          ROI estimé &gt; 10 ans
        </label>
      </div>

      {/* GTB existant */}
      <label className="block mb-2 font-medium">Système GTB existant</label>
      <select
        className="w-full p-2 border rounded mb-6"
        value={formData.gtb}
        onChange={(e) => setFormData({ ...formData, gtb: e.target.value })}
      >
        <option value="none">Aucun</option>
        <option value="D">Classe D</option>
        <option value="C">Classe C</option>
        <option value="B">Classe B</option>
        <option value="A">Classe A</option>
      </select>

      {/* Bouton */}
      <button
        onClick={calculateResult}
        className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
      >
        Calculer mon statut
      </button>

      {/* Résultat */}
      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h2 className="text-lg font-bold">Résultat :</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
