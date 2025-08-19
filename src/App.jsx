import BACSForm from "./BACSForm";

export default function App() {
  return (
    <div className="app-container">
      <div className="card">
        <h1>Vérification Décret BACS</h1>
        <p>Complétez les informations pour savoir si vous êtes assujetti.</p>

        {/* >>> ICI on rend le formulaire <<< */}
        <BACSForm />
      </div>
    </div>
  );
}
