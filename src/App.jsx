import BACSForm from "./BACSForm";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Titre principal */}
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
          🏢 BACS Checker — Décret BACS
        </h1>

        {/* Notre gros formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <BACSForm />
        </div>
      </div>
    </div>
  );
}
