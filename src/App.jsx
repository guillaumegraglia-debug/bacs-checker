import BACSForm from "./BACSForm";

export default function App() {
  return (
    <>
      <header className="hero">
        <div className="container">
          <div className="brand">
            <img src="/logo-bacs.svg" alt="BACS" />
            <div>
              <h1>BACS Checker</h1>
              <small>Assujettissement & diagnostic — Décret BACS</small>
            </div>
          </div>
        </div>
      </header>

      <main className="container" style={{padding: '28px 0 60px'}}>
        <BACSForm />
      </main>
    </>
  );
}
