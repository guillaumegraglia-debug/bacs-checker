import React, { useState } from "react";

export default function BACSForm() {
  const [data, setData] = useState({
    buildingType: "",
    heating: "",
    cooling: "",
    ventilation: "",
    ecs: "",
  });

  const n = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  const total =
    n(data.heating) + n(data.cooling) + n(data.ventilation) + n(data.ecs);

  const assujetti = data.buildingType === "tertiaire" && total > 290;

  return (
    <div>
      <label className="label">Type de bâtiment</label>
      <select
        className="select"
        value={data.buildingType}
        onChange={(e) => setData({ ...data, buildingType: e.target.value })}
      >
        <option value="">-- Sélectionnez --</option>
        <option value="tertiaire">Tertiaire</option>
        <option value="autre">Autre</option>
      </select>

      <div className="form-row">
        <div>
          <label className="label">Chauffage (kW)</label>
          <input
            className="input"
            type="number"
            min="0"
            value={data.heating}
            onChange={(e) => setData({ ...data, heating: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Climatisation (kW)</label>
          <input
            className="input"
            type="number"
            min="0"
            value={data.cooling}
            onChange={(e) => setData({ ...data, cooling: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Ventilation (kW)</label>
          <input
            className="input"
            type="number"
            min="0"
            value={data.ventilation}
            onChange={(e) =>
              setData({ ...dat
