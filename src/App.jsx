import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Calculator from "./calculator.jsx";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const resetPage = () => window.location.reload();

  return (
    <BrowserRouter>
      {/* El contenedor principal decide si aplicamos la clase 'dark' */}
      <div className={`${isDarkMode ? "dark" : ""} min-h-screen flex flex-col font-sans transition-colors duration-300`}>
        <div className="flex-grow flex flex-col bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
          
          {/* Navbar */}
          <header className="bg-red-600 dark:bg-red-800 text-white shadow-md transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
              <h1 className="text-xl font-bold font-pokemon tracking-tighter">PokeChampions</h1>
              <nav className="flex items-center gap-4 font-semibold text-sm md:text-base">
                <Link to="/" className="hover:text-yellow-300 transition-colors">Calculator</Link>
                <Link to="/builder" className="hover:text-yellow-300 transition-colors">Builder</Link>
                <Link to="/ocr" className="hover:text-yellow-300 transition-colors">OCR</Link>
                <Link to="/tcg" className="hover:text-yellow-300 transition-colors">TCG View</Link>
                
                {/* Switch de Modo Oscuro con iconos profesionales */}
                <div className="flex items-center gap-3 bg-slate-100/10 dark:bg-slate-700/30 p-2 rounded-xl border border-white/20">
                    <span className={`text-xs font-bold uppercase transition-colors ${!isDarkMode ? "text-yellow-200" : "text-white/40"}`}>Luz</span>
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="w-16 h-8 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center p-1 relative transition-all"
                        title="Alternar Modo Oscuro/Claro"
                    >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform transform ${isDarkMode ? "translate-x-8 bg-white" : "bg-slate-900"}`}>
                            {isDarkMode ? (
                                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.364a1 1 0 011.415 0l.707.707a1 1 0 01-1.414 1.415l-.707-.707a1 1 0 010-1.415zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-2.364 4.22a1 1 0 010 1.415l-.707.707a1 1 0 01-1.415-1.414l.707-.707a1 1 0 011.415 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-2.364a1 1 0 01-1.415 0l-.707-.707a1 1 0 011.414-1.415l.707.707a1 1 0 010 1.415zM4 10a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1zm2.364-4.22a1 1 0 010-1.415l.707-.707a1 1 0 011.415 1.414l-.707.707a1 1 0 01-1.415 0zM10 5a5 5 0 100 10 5 5 0 000-10z" /></svg>
                            ) : (
                                <svg className="w-4 h-4 text-slate-100" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                            )}
                        </div>
                    </button>
                    <span className={`text-xs font-bold uppercase transition-colors ${isDarkMode ? "text-slate-100" : "text-white/40"}`}>Noche</span>
                </div>
              </nav>
            </div>
          </header>

          {/* Contenido Principal */}
          <main className="flex-grow max-w-6xl mx-auto w-full p-4">
            <Routes>
              <Route path="/" element={<Calculator />} />
              <Route path="/builder" element={<div className="text-center mt-20 text-2xl">Página Builder en construcción...</div>} />
              <Route path="/ocr" element={<div className="text-center mt-20 text-2xl">Página OCR en construcción...</div>} />
              <Route path="/tcg" element={<div className="text-center mt-20 text-2xl">Página TCG View en construcción...</div>} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-slate-800 dark:bg-black text-white pt-8 pb-4 text-center transition-colors duration-300">
            <div className="flex flex-col items-center justify-center gap-4">
              <button 
                onClick={resetPage}
                className="w-12 h-12 rounded-full bg-white border-4 border-black flex items-center justify-center relative overflow-hidden animate-spin-slow cursor-pointer hover:scale-110 transition-transform"
                title="Reiniciar página"
              >
                <div className="absolute top-0 w-full h-1/2 bg-red-600 border-b-4 border-black"></div>
                <div className="absolute w-4 h-4 bg-white border-4 border-black rounded-full z-10"></div>
              </button>
              <p className="font-semibold text-lg">Desarrollado por Arnau Pich Alburquerque</p>
              <p className="text-xs text-slate-400 mt-2 max-w-2xl px-4">
                Pokémon and All Respective Names are Trademark & © of Nintendo 1996-2024. 
                This is a fan-made project for educational purposes.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}