import React, { useState, useEffect, useRef } from "react";

export default function TcgView() {
  // Estados para la búsqueda y visualización de cartas
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedTerm, setSearchedTerm] = useState(""); // Memoria para saber qué estamos viendo ahora mismo
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Estados para el Modal (Visor de carta)
  const [selectedCard, setSelectedCard] = useState(null);

  // Estados para el desplegable predictivo
  const [pokemonList, setPokemonList] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Descargar la lista de Pokémon para el predictivo
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1302")
      .then(res => res.json())
      .then(data => setPokemonList(data.results))
      .catch(err => console.error("Error cargando lista predictiva:", err));
  }, []);

  // Cerrar el desplegable al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Función base para descargar las cartas de la API
  const fetchCards = async (term) => {
    if (!term.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setSearchedTerm(term); // Guardamos la palabra exacta que generó esta búsqueda
    setIsDropdownOpen(false);
    
    try {
      const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:"*${term}*"&pageSize=20`);
      const data = await res.json();
      setCards(data.data || []);
    } catch (error) {
      console.error("Error buscando cartas:", error);
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar el submit del formulario (cuando pulsas Enter o "Buscar")
  const handleSearchForm = (e) => {
    e.preventDefault();
    fetchCards(searchTerm);
  };

  // Manejar el clic en una sugerencia del desplegable
  const handleSelectPredictive = (name) => {
    const cleanName = name.replace("-", " ");
    setSearchTerm(cleanName);
    fetchCards(cleanName);
  };

  // Función para reiniciar por completo la búsqueda con la "X" roja
  const handleClear = () => {
    setSearchTerm("");
    setSearchedTerm("");
    setCards([]);
    setHasSearched(false);
  };

  // Filtro para el desplegable predictivo
  const filteredList = pokemonList.filter(poke => 
    poke.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lógica del Botón: Si hemos buscado algo y el texto de la barra es igual al que buscamos, mostramos la X
  const isViewingCurrentSearch = hasSearched && searchTerm.toLowerCase() === searchedTerm.toLowerCase();

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mt-6 transition-colors duration-300 relative min-h-[600px]">
      
      {/* Cabecera y Buscador */}
      <div className="flex flex-col items-center mb-8 border-b-4 border-blue-500 pb-8 pt-4">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 font-pokemon tracking-wider">TCG Card Viewer</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center max-w-lg">
          Busca cualquier Pokémon y explora sus cartas del Juego de Cartas Coleccionables en alta calidad.
        </p>

        {/* Formulario y Desplegable */}
        <form onSubmit={handleSearchForm} className="w-full max-w-xl flex shadow-lg rounded-xl">
          
          <div className="relative flex-grow" ref={dropdownRef}>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onClick={() => setIsDropdownOpen(true)}
              placeholder="Ej: Charizard, Lugia, Pikachu..."
              className="w-full p-4 pl-6 border-none bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-lg transition-colors rounded-l-xl z-10 relative"
            />

            {/* Desplegable Predictivo */}
            {isDropdownOpen && searchTerm && (
              <ul className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl shadow-2xl max-h-60 overflow-y-auto left-0">
                {filteredList.length > 0 ? (
                  filteredList.map((poke) => (
                    <li 
                      key={poke.name}
                      onClick={() => handleSelectPredictive(poke.name)}
                      className="p-3 hover:bg-blue-50 dark:hover:bg-slate-600 cursor-pointer capitalize border-b border-slate-100 dark:border-slate-600 last:border-0 font-medium text-slate-700 dark:text-slate-200"
                    >
                      {poke.name.replace("-", " ")}
                    </li>
                  ))
                ) : (
                  <li className="p-3 text-slate-500 dark:text-slate-400 text-center font-medium">No hay coincidencias.</li>
                )}
              </ul>
            )}
          </div>

          {/* Botón Dinámico (Buscar o Limpiar) */}
          {isViewingCurrentSearch ? (
            <button 
              type="button"
              onClick={handleClear}
              className="bg-red-500 hover:bg-red-600 text-white px-8 font-bold text-xl transition-colors flex items-center justify-center rounded-r-xl"
              title="Borrar búsqueda"
            >
              ✕
            </button>
          ) : (
            <button 
              type="submit"
              disabled={isLoading || !searchTerm.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 font-bold text-lg transition-colors flex items-center justify-center disabled:bg-blue-400 rounded-r-xl"
            >
              {isLoading ? "⏳" : "Buscar"}
            </button>
          )}
        </form>
      </div>

      {/* Estado de Carga */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="font-bold text-slate-500 dark:text-slate-400 animate-pulse">Buscando en la base de datos...</p>
        </div>
      )}

      {/* Cuadrícula de Resultados */}
      {!isLoading && hasSearched && cards.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl font-bold text-slate-400 dark:text-slate-500">No se encontraron cartas para "{searchedTerm}".</p>
        </div>
      )}

      {!isLoading && cards.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {cards.map((card) => (
            <div 
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <img 
                src={card.images.small} 
                alt={card.name} 
                className="w-full rounded-xl shadow-md group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300"
              />
              <div className="mt-3 text-center">
                <p className="font-bold text-sm text-slate-800 dark:text-white truncate w-full">{card.name}</p>
                <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">{card.set.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- MODAL VISOR DE CARTA ---------------- */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelectedCard(null)}>
          <div 
            className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="w-full max-w-sm shrink-0">
              <img 
                src={selectedCard.images.large} 
                alt={selectedCard.name} 
                className="w-full rounded-2xl shadow-2xl drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white">{selectedCard.name}</h3>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{selectedCard.supertype} - {selectedCard.subtypes?.join(", ")}</p>
                </div>
                <button onClick={() => setSelectedCard(null)} className="text-slate-400 hover:text-red-500 text-2xl font-bold bg-slate-100 dark:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors">✕</button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-600">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Expansión / Set</span>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedCard.set.images?.symbol && (
                      <img src={selectedCard.set.images.symbol} alt="symbol" className="w-5 h-5 object-contain" />
                    )}
                    <span className="font-bold text-slate-700 dark:text-slate-200">{selectedCard.set.name}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-600">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Rareza</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{selectedCard.rarity || "Desconocida"}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-600">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Ilustrador</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200 truncate block" title={selectedCard.artist}>{selectedCard.artist || "-"}</span>
                  </div>
                </div>

                {selectedCard.tcgplayer?.prices && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800/50 text-center mt-4">
                    <span className="block text-[10px] font-bold text-green-600 dark:text-green-400 uppercase">Precio Estimado (Mercado USD)</span>
                    <span className="text-2xl font-black text-green-700 dark:text-green-300">
                      ${Object.values(selectedCard.tcgplayer.prices)[0]?.market?.toFixed(2) || "---"}
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}