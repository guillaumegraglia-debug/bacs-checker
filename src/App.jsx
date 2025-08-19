export default function App() {
  return (
    <div className="app-container">
      {/* Titre principal */}
      <h1 style={{
        fontSize: "2rem",
        fontWeight: "700",
        marginBottom: "20px",
        textAlign: "center",
        background: "linear-gradient(90deg, #2563eb, #22c55e)",
        WebkitBackgroundClip: "text",
        color: "transparent"
      }}>
        Vérificateur BACS
      </h1>

      {/* Carte */}
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 4px 30px rgba(0,0,0,0.08)"
      }}>
        <p>Bienvenue dans l’outil de test du décret BACS. 🚀</p>
        <p>Ici viendra le formulaire.</p>
      </div>
    </div>
  )
}
