import BACSForm from "./BACSForm";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-4 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <img src="/logo-bacs.svg" alt="BACS" className="h-8 w-8" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">
              BACS Checker
            </h1>
            <p className="text-xs md:text-sm text-slate-500">
              Vérification d’assujettissement & diagnostic (Décret BACS)
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 pb-12">
        <BACSForm />
      </main>
    </div>
  );
}
