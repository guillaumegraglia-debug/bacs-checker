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
  const lines = [];

  lines.push(`Bâtiment : ${formData.buildingName || "Non renseigné"}`);
  lines.push(`Type : ${formData.buildingType || "Non renseigné"}`);
  lines.push(`Puissance totale CVC : ${totalPower} kW`);
  lines.push(`Statut : ${statut}`);
  lines.push(`Échéance : ${echeance}`);

  lines.push(
    `GTB actuelle : ${gtb.currentClass} – ${gtb.classUpgrade}`
  );

  lines.push(
    `CAPEX estimé : ${eco.capex.toFixed(0)} € | Économies : ${eco.annualSavingEuro.toFixed(
      0
    )} €/an | ROI : ${
      Number.isFinite(eco.roiYears)
        ? eco.roiYears.toFixed(1) + " ans"
        : "non calculable"
    }`
  );

  if (planActions && planActions.length) {
    lines.push("\nPlan d'actions :");
    planActions.forEach((a, i) => lines.push(`${i + 1}. ${a}`));
  }

  if (derogations?.possible) {
    lines.push("\nDérogations possibles :");
    if (derogations.roi) lines.push("- ROI > 10 ans");
    if (derogations.technical) lines.push("- Difficulté technique");
    if (derogations.heritage) lines.push("- Patrimoine protégé");
  }

  return lines.join("\n");
}
