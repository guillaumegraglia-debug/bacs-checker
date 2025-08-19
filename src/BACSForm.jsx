{result && (
  <div className="mt-10 space-y-6">
    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
      📊 Résultats du diagnostic
    </h2>

    <div className="grid gap-6 md:grid-cols-2">
      {/* Échéance */}
      <div className="p-5 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow">
        <h3 className="font-semibold text-blue-800 mb-2">📅 Échéance</h3>
        <p className="text-gray-700">{result.echeance}</p>
      </div>

      {/* Classe GTB */}
      <div className="p-5 bg-gradient-to-br from-green-100 to-green-50 rounded-xl shadow">
        <h3 className="font-semibold text-green-800 mb-2">⚡ Classe GTB requise</h3>
        <p className="text-gray-700">{result.classe}</p>
      </div>
    </div>

    {/* Fonctions minimales */}
    <div className="p-5 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl shadow">
      <h3 className="font-semibold text-yellow-800 mb-3">🛠️ Fonctions minimales</h3>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        {result.fonctions.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
    </div>

    {/* Mini étude économique */}
    <div className="p-5 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl shadow">
      <h3 className="font-semibold text-purple-800 mb-2">💰 Étude économique</h3>
      <p className="text-gray-700">{result.economie}</p>
    </div>

    {/* Plan d’actions */}
    <div className="p-5 bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl shadow">
      <h3 className="font-semibold text-pink-800 mb-2">🚀 Plan d’actions recommandé</h3>
      <p className="text-gray-700">{result.actions}</p>
    </div>

    {/* Dérogations */}
    {result.derogations && (
      <div className="p-5 bg-gradient-to-br from-red-100 to-red-50 rounded-xl shadow">
        <h3 className="font-semibold text-red-800 mb-2">⚠️ Cas de dérogation</h3>
        <p className="text-gray-700">{result.derogations}</p>
      </div>
    )}
  </div>
)}
