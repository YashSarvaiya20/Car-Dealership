import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-xl p-8 shadow-2xl border border-slate-700 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">
          Car Dealership System
        </h1>
        <p className="text-slate-400 mb-6">
          Project Setup Step 1 complete. Frontend is connected and styled using Vite and Tailwind CSS.
        </p>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white font-medium rounded-lg shadow-lg shadow-blue-500/20"
          >
            Count: {count}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
