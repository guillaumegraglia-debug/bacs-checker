import React, { useMemo, useState } from "react";

/* Pictos inline (pas de dépendances) */
const Icon = ({ d, size=18, color="#cfe0ff" }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d={d} />
  </svg>
);
const icoBuilding = "M4 22h16v-2H4v2Zm2-4h12V2H6v16Zm2-6h3V9H8v3Zm0-5h3V4H8v3Zm5 5h3V9h-3v3Zm0-5h3V4h-3v3Z";
const icoBolt = "M11 21h-1l1-7H7L13 3h1l-1 7h4l-6 11z";
const icoCalendar = "M7 2h2v2h6V2h2v2h3v18H4V4h3V2Zm13 8H4v10h16V10Z";
const icoCheck = "M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z";
const icoWarn = "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z";
const icoX = "M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.41 4.3 19.71 2.89 18.3 9.17 12 2.89 5.71 4.3 4.29 10.59 10.59 16.89 4.3z";

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

  const n = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  const totalPower = n(formData.heating) + n(formData.cooling) + n(formData.ventilation) + n(formData.ecs);

  // Module 1
  const isTertiaire = formData.buildingType === "tertiaire";
  const assujetti = isTertiaire && totalPower > 290;
  const echeance =
    formData.constructionDate === "after2021"
      ? "Obligation dès la mise en service (bâtiment neuf)."
      : formData.constructionDate === "before2021"
      ? "Obligation au 1er janvier 2025 (bâtiment existant)."
      : "Précisez la date de construction pour déterminer l'échéance exacte.";

  // Module 2 (paramètres éco)
  const [eco, setEco] = useState({
    capexPerKW: 80,
    cvcKwhPerKW: 1200,
    energyPrice: 0.16,
    savingPct: 15,
    knownCvcKwh: "",
  });

  const cvcKwhYear = useMemo(() => {
    const known = n(eco.knownCvcKwh);
    return known > 0 ? known : totalPower * eco.cvcKwhPerKW;
  }, [eco.knownCvcKwh, eco.cvcKwhPerKW, totalPower]);

  const capex = useMemo(() => totalPower * eco.capexPerKW, [totalPower, eco.capexPerKW]);
  const annualSavingEuro = useMemo(() => Math.max(0, (eco.savingPct / 100) * cvcKwhYear * eco.energyPrice), [eco.savingPct, cvcKwhYear, eco.energyPrice]);
  const roiYears = useMemo(() => (annualSavingEuro <= 0 ? Infinity : capex / annualSavingEuro), [capex, annualSavingEuro]);

  const requiredClass = "B";
  const currentClass = formData.gtb === "none" ? "aucune" : formData.gtb;
  const classUpgrade = (formData.gtb === "A" || formData.gtb === "B") ? "Conforme (vérifier fonctionnalités minimales)." : `Mise à niveau requise vers classe ${requiredClass}.`;

  const derogationByROI = roiYears > 10 || formData.roi === true;
  const derogationPossible = assujetti && (derogationByROI || formData.technicalIssue || formData.heritage);

  const statutMessage = !isTertiaire
    ? "Non assujetti : bâtiment non tertiaire."
    : totalPower <= 290
    ? "Non assujetti : puissance totale ≤ 290 kW."
    : "Assujetti : décret BACS applicable.";

  return (
    <div className="grid grid-2">
      {/* FORMULAIRE */}
      <section className="card">
        <div style={{display:'flex',alignItems:'center',gap:10, marginBottom:8}}>
          <Icon d={icoBuilding} />
          <div className="h2">Module 1 · Éligibilité</div>
        </div>
        <div className="sub">Renseignez les caractéristiques du bâtiment.</div>
        <div className="divider"></div>

        <label className="label">Nom du bâtiment</label>
        <input className="input" placeholder="Ex : Tour Alpha"
               value={formData.buildingName}
               onChange={(e)=>setFormData({...formData, buildingName:e.target.value})} />

        <label className="label">Type de bâtiment</label>
        <select className="select" value={formData.buildingType}
                onChange={(e)=>setFormData({...formData, buildingType:e.target.value})}>
          <option value="">-- Sélectionnez --</option>
          <option value="tertiaire">Tertiaire</option>
          <option value="autre">Autre</option>
        </select>

        <label className="label">Date de construction</label>
        <select className="select" value={formData.constructionDate}
                onChange={(e)=>setFormData({...formData, constructionDate:e.target.value})}>
          <option value="">-- Sélectionnez --</option>
          <option value="before2021">Avant 21 juillet 2021</option>
          <option value="after2021">Après 21 juillet 2021</option>
        </select>

        <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
          <div>
            <label className="label">Chauffage (kW)</label>
            <input type="number" className="input" min="0" placeholder="0"
                   value={formData.heating}
                   onChange={(e)=>setFormData({...formData, heating:e.target.value})}/>
          </div>
          <div>
            <label className="label">Climatisation (kW)</label>
            <input type="number" className="input" min="0" placeholder="0"
                   value={formData.cooling}
                   onChange={(e)=>setFormData({...formData, cooling:e.target.value})}/>
          </div>
          <div>
            <label className="label">Ventilation (kW)</label>
            <input type="number" className="input" min="0" placeholder="0"
                   value={formData.ventilation}
                   onChange={(e)=>setFormData({...formData, ventilation:e.target.value})}/>
          </div>
          <div>
            <label className="label">ECS couplée (kW) — optionnel</label>
            <input type="number" className="input" min="0" placeholder="0"
                   value={formData.ecs}
                   onChange={(e)=>setFormData({...formData, ecs:e.target.value})}/>
          </div>
        </div>

        <p className="sub" style={{display:'flex',alignItems:'center',gap:8, marginTop:8}}>
          <Icon d={icoBolt} color="#7dd3fc" />
          Puissance totale : <span className="kpi">{isNaN(totalPower) ? "—" : `${totalPower} kW`}</span>
        </p>

        <div className="divider"></div>

        <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
          <label className="check">
            <input type="checkbox" checked={formData.heritage}
                   onChange={(e)=>setFormData({...formData, heritage:e.target.checked})}/>
            Bâtiment classé / patrimoine
          </label>
          <label className="check">
            <input type="checkbox" checked={formData.technicalIssue}
                   onChange={(e)=>setFormData({...formData, technicalIssue:e.target.checked})}/>
            Impossibilité technique
          </label>
          <label className="check">
            <input type="checkbox" checked={formData.roi}
                   onChange={(e)=>setFormData({...formData, roi:e.target.checked})}/>
            ROI estimé &gt; 10 ans
          </label>
        </div>

        <label className="label" style={{marginTop:10}}>Système GTB existant</label>
        <select className="select" value={formData.gtb}
                onChange={(e)=>setFormData({...formData, gtb:e.target.value})}>
          <option value="none">Aucun</option>
          <option value="D">Classe D</option>
          <option value="C">Classe C</option>
          <option value="B">Classe B</option>
          <option value="A">Classe A</option>
        </select>
      </section>

      {/* DIAGNOSTIC */}
      <section className="card">
        <div style={{display:'flex',alignItems:'center',gap:10, marginBottom:8}}>
          <Icon d={icoCalendar} />
          <div className="h2">Module 2 · Diagnostic</div>
        </div>
        <div className="sub">Résultat, fonctionnalités minimales & mini-économie.</div>
        <div className="divider"></div>

        <div style={{marginBottom:10}}>
          {assujetti ? (
            <span className="badge badge-ok"><Icon d={icoCheck}/> Assujetti</span>
          ) : (
            <span className="badge badge-ko"><Icon d={icoX}/> Non assujetti</span>
          )}
        </div>

        <div className="card" style="padding:12px;margin-bottom:12px">
          <div style={{fontWeight:700, marginBottom:4}}>{statutMessage}</div>
          {assujetti && <div className="sub">{echeance}</div>}
        </div>

        {assujetti && (
          <>
            <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
              <div className="card" style="padding:12px">
                <div className="sub">Classe GTB minimale</div>
                <div className="kpi">B</div>
                <div className="sub" style={{marginTop:6}}>
                  Existant : <b>{currentClass}</b> → {classUpgrade}
                </div>
              </div>
              <div className="card" style="padding:12px">
                <div className="sub">Dérogation potentielle</div>
                {derogationPossible ? (
                  <span className="badge badge-warn"><Icon d={icoWarn}/> À justifier (ROI&gt;10 ans / technique / patrimoine)</span>
                ) : (
                  <span className="badge badge-ok"><Icon d={icoCheck}/> Aucune identifiée</span>
                )}
              </div>
            </div>

            <div className="card" style="padding:12px; margin-top:12px">
              <div className="h2" style="font-size:.95rem">Fonctionnalités minimales (arrêté 24/04/2023)</div>
              <ul style="margin:8px 0 0 18px; color:#cfe0ff">
                <li>Mesure & enregistrement continu des consommations.</li>
                <li>Adaptation automatique à la demande (occupation, horaires, consignes).</li>
                <li>Détection des dérives & alertes.</li>
                <li>Arrêt/démarrage & régulation par zone.</li>
                <li>Interopérabilité (BACnet / KNX / Modbus…).</li>
              </ul>
            </div>

            <div className="card" style="padding:12px; margin-top:12px">
              <div className="h2" style="font-size:.95rem">Mini-éco (paramétrable)</div>
              <div className="grid" style={{gridTemplateColumns:'1fr 1fr', marginTop:8}}>
                <label className="label">CAPEX (€/kW)</label>
                <input className="input" type="number" min="0"
                       value={eco.capexPerKW}
                       onChange={(e)=>setEco({...eco, capexPerKW:Number(e.target.value)})}/>
                <label className="label">Conso CVC (kWh/kW/an)</label>
                <input className="input" type="number" min="0"
                       value={eco.cvcKwhPerKW}
                       onChange={(e)=>setEco({...eco, cvcKwhPerKW:Number(e.target.value)})}/>
                <label className="label">Prix énergie (€/kWh)</label>
                <input className="input" type="number" min="0" step="0.01"
                       value={eco.energyPrice}
                       onChange={(e)=>setEco({...eco, energyPrice:Number(e.target.value)})}/>
                <label className="label">Gain attendu (%)</label>
                <input className="input" type="number" min="0" max="40"
                       value={eco.savingPct}
                       onChange={(e)=>setEco({...eco, savingPct:Number(e.target.value)})}/>
                <label className="label" style={{gridColumn:'1 / -1'}}>Conso CVC réelle (kWh/an) — optionnel</label>
                <input className="input" type="number" min="0"
                       value={eco.knownCvcKwh}
                       onChange={(e)=>setEco({...eco, knownCvcKwh:e.target.value})}
                       placeholder="Laisser vide pour estimer"/>
              </div>

              <div style="margin-top:10px">
                <div>CAPEX estimé : <b>{capex.toLocaleString("fr-FR")} €</b></div>
                <div>Économies annuelles : <b>{annualSavingEuro.toLocaleString("fr-FR")} €</b></div>
                <div>ROI simple : <b>{roiYears===Infinity ? "—" : roiYears.toFixed(1)} an(s)</b> {roiYears>10 && <span style={{color:'#fde68a'}}> ( &gt; 10 ans )</span>}</div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* CTA bas de page */}
      <div className="grid" style={{gridTemplateColumns:'1fr', alignItems:'center'}}>
        <div className="card" style="display:flex; justify-content:space-between; align-items:center; gap:12px; padding:14px;">
          <div className="sub">Besoin d’un rapport client (PDF) ? — Module 3 à venir</div>
          <div>
            <button className="btn btn-ghost" onClick={(e)=>e.preventDefault()}>Aperçu</button>
            <button className="btn btn-primary" style={{marginLeft:10}}>Exporter (bientôt)</button>
          </div>
        </div>
      </div>
    </div>
  );
}
