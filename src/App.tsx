import { ConductForm } from './components/ConductForm';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Registro Escolar de Conductas
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            FEP Mare de Déu del Roser
          </p>
        </header>

        <main>
          <ConductForm />
        </main>

        <footer className="mt-16 text-center text-slate-400 text-sm">
          <p>&copy; 2026 Escola Roser Les Planes • Sistema de Comunicación Institucional</p>
        </footer>
      </div>
    </div>
  );
}
