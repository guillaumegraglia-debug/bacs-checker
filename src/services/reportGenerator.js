export async function generateReport({
  formData,
  totalPower,
  assujetti,
  echeance,
  statut,
  gtb,
  eco,
  planActions,
  derogations,
}) {
  const list = (items) => items.map((item) => `- ${item}`).join("\n");

  const roi =
    Number.isFinite(eco.roiYears) ? `${eco.roiYears.toFixed(1)} ans` : "non calculable";

  const plan = planActions?.length ? list(planActions) : "Aucun plan d'action fourni.";

  const derogs = derogations?.possible
    ? list([
        ...(derogations.roi ? ["ROI > 10 ans"] : []),
        ...(derogations.technical ? ["Difficulté technique"] : []),
        ...(derogations.heritage ? ["Patrimoine protégé"] : []),
      ])
    : "Aucune dérogation identifiée.";

  return `## Rapport de diagnostic économique et réglementaire des systèmes BACS

### 1. Introduction
Ce rapport évalue la nécessité et l'intérêt de déployer un système d'automatisation et de contrôle des bâtiments pour **${formData.buildingName || "un bâtiment non renseigné"}**. 
Le diagnostic s'appuie sur les données déclarées et sur des hypothèses standards pour présenter une analyse réglementaire et économique.

### 2. Rappel de la réglementation
Les bâtiments tertiaires dont la puissance CVC dépasse 290 kW sont soumis au décret BACS. 
La mise en conformité doit être achevée au plus tard : **${echeance}**.
Les systèmes doivent atteindre au minimum la classe **${gtb.requiredClass}** de la norme EN 15232-1 et assurer les fonctions de supervision, de régulation et d'optimisation énergétique.

### 3. Hypothèses issues des données
- Puissance totale installée : **${totalPower} kW**
- Statut d'assujettissement : **${assujetti ? "assujetti" : "non assujetti"}** (${statut})
- Classe GTB actuelle : **${gtb.currentClass}** (${gtb.classUpgrade})
- Consommation CVC estimée : **${eco.cvcKwhYear.toFixed(0)} kWh/an**

### 4. Approches économiques
- CAPEX estimé : **${eco.capex.toFixed(0)} €**
- Économies d'énergie attendues : **${eco.annualSavingEuro.toFixed(0)} €/an**
- Retour sur investissement simple : **${roi}**

### 5. Plan d’actions recommandé
${plan}

### 6. Dérogations envisageables
${derogs}

### 7. Conclusion
Le projet permettrait d'améliorer la performance énergétique du site et de respecter les obligations réglementaires. 
Une analyse plus fine des coûts et des gains réels est recommandée afin de confirmer ces estimations et de planifier le déploiement du BACS.
`;
}

