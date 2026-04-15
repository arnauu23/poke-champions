import React, { useState, useEffect, useRef } from "react";

const TYPE_DATA = {
  normal: { bg: "bg-[#A8A77A]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/normal.svg" },
  fire: { bg: "bg-[#EE8130]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/fire.svg" },
  water: { bg: "bg-[#6390F0]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/water.svg" },
  electric: { bg: "bg-[#F7D02C]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/electric.svg" },
  grass: { bg: "bg-[#7AC74C]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/grass.svg" },
  ice: { bg: "bg-[#96D9D6]", icon: "https://cdn.jsdelivr.gh/duiker101/pokemon-type-svg-icons/icons/ice.svg" },
  fighting: { bg: "bg-[#C22E28]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/fighting.svg" },
  poison: { bg: "bg-[#A33EA1]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/poison.svg" },
  ground: { bg: "bg-[#E2BF65]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/ground.svg" },
  flying: { bg: "bg-[#A98FF3]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/flying.svg" },
  psychic: { bg: "bg-[#F95587]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/psychic.svg" },
  bug: { bg: "bg-[#A6B91A]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/bug.svg" },
  rock: { bg: "bg-[#B6A136]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/rock.svg" },
  ghost: { bg: "bg-[#735797]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/ghost.svg" },
  dragon: { bg: "bg-[#6F35FC]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/dragon.svg" },
  dark: { bg: "bg-[#705746]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/dark.svg" },
  steel: { bg: "bg-[#B7B7CE]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/steel.svg" },
  fairy: { bg: "bg-[#D685AD]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/fairy.svg" }
};

const GENS = [
  { id: "Gen 1 (Kanto)", range: [1, 151] },
  { id: "Gen 2 (Johto)", range: [152, 251] },
  { id: "Gen 3 (Hoenn)", range: [252, 386] },
  { id: "Gen 4 (Sinnoh)", range: [387, 493] },
  { id: "Gen 5 (Unova)", range: [494, 649] },
  { id: "Gen 6 (Kalos)", range: [650, 721] },
  { id: "Gen 7 (Alola)", range: [722, 809] },
  { id: "Gen 8 (Galar)", range: [810, 905] },
  { id: "Gen 9 (Paldea)", range: [906, 1025] }
];

// Lista predefinida de los objetos competitivos más usados
const COMPETITIVE_ITEM_IDS = [
    "life-orb", "choice-band", "choice-specs", "choice-scarf", "assault-vest", "eviolite", "leftovers", "focus-sash", 
    "sitrus-berry", "lum-berry", "weakness-policy", "expert-belt", "rocky-helmet", "black-sludge", "poison-barb", 
    "lagging-tail", "iron-ball", "king's-rock", "focus-band", "lens", "quick-claw", "safety-goggles", "terrain-extender"
];

const NATURES = [
  { name: "Hardy (Fuerte - Neutra)", up: null, down: null },
  { name: "Lonely (Huraña)", up: "attack", down: "defense" },
  { name: "Brave (Audaz)", up: "attack", down: "speed" },
  { name: "Adamant (Firme)", up: "attack", down: "special-attack" },
  { name: "Naughty (Pícara)", up: "attack", down: "special-defense" },
  { name: "Bold (Osada)", up: "defense", down: "attack" },
  { name: "Docile (Dócil - Neutra)", up: null, down: null },
  { name: "Relaxed (Plácida)", up: "defense", down: "speed" },
  { name: "Impish (Agitada)", up: "defense", down: "special-attack" },
  { name: "Lax (Floja)", up: "defense", down: "special-defense" },
  { name: "Timid (Miedosa)", up: "speed", down: "attack" },
  { name: "Hasty (Activa)", up: "speed", down: "defense" },
  { name: "Serious (Seria - Neutra)", up: null, down: null },
  { name: "Jolly (Alegre)", up: "speed", down: "special-attack" },
  { name: "Naive (Ingenua)", up: "speed", down: "special-defense" },
  { name: "Modest (Modesta)", up: "special-attack", down: "attack" },
  { name: "Mild (Afable)", up: "special-attack", down: "defense" },
  { name: "Quiet (Mansa)", up: "special-attack", down: "speed" },
  { name: "Bashful (Tímida - Neutra)", up: null, down: null },
  { name: "Rash (Alocada)", up: "special-attack", down: "special-defense" },
  { name: "Calm (Serena)", up: "special-defense", down: "attack" },
  { name: "Gentle (Amable)", up: "special-defense", down: "defense" },
  { name: "Sassy (Grosera)", up: "special-defense", down: "speed" },
  { name: "Careful (Cauta)", up: "special-defense", down: "special-attack" },
  { name: "Quirky (Rara - Neutra)", up: null, down: null }
];

export default function Calculator() {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [pokemonDetails, setPokemonDetails] = useState(null);
  
  const [isShiny, setIsShiny] = useState(false);
  const [gender, setGender] = useState("male"); 

  const [selectedTypes, setSelectedTypes] = useState([]); 
  const [selectedGen, setSelectedGen] = useState(null);
  const [filteredTypeNames, setFilteredTypeNames] = useState([]); 

  const [level, setLevel] = useState(50);
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false); // Estado para dropdown personalizado
  const [selectedNature, setSelectedNature] = useState(NATURES[0].name);
  const [isNatureDropdownOpen, setIsNatureDropdownOpen] = useState(false); // Estado para dropdown personalizado
  const [selectedAbility, setSelectedAbility] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [ivs, setIvs] = useState({ hp: 31, attack: 31, defense: 31, "special-attack": 31, "special-defense": 31, speed: 31 });
  const [evs, setEvs] = useState({ hp: 0, attack: 0, defense: 0, "special-attack": 0, "special-defense": 0, speed: 0 });
  
  const [itemList, setItemList] = useState([]);
  const [itemSearchTerm, setItemSearchTerm] = useState("");
  const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);

  const dropdownRef = useRef(null);
  const itemDropdownRef = useRef(null);
  const levelDropdownRef = useRef(null); // Ref para dropdown personalizado
  const natureDropdownRef = useRef(null); // Ref para dropdown personalizado

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1302")
      .then(res => res.json())
      .then(data => setPokemonList(data.results))
      .catch(err => console.error(err));

    fetch("https://pokeapi.co/api/v2/item?limit=2000")
      .then(res => res.json())
      .then(data => {
        // Filtrar inmediatamente para solo objetos competitivos
        const filteredItems = data.results.filter(item => COMPETITIVE_ITEM_IDS.includes(item.name));
        setItemList(filteredItems);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
        if (itemDropdownRef.current && !itemDropdownRef.current.contains(event.target)) setIsItemDropdownOpen(false);
        if (levelDropdownRef.current && !levelDropdownRef.current.contains(event.target)) setIsLevelDropdownOpen(false); // Clic fuera para dropdown nivel
        if (natureDropdownRef.current && !natureDropdownRef.current.contains(event.target)) setIsNatureDropdownOpen(false); // Clic fuera para dropdown naturaleza
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedPokemon) {
      fetch(selectedPokemon.url)
        .then(res => res.json())
        .then(async data => {
          
          let abilitiesTranslated = [];
          if (data.abilities && data.abilities.length > 0) {
            abilitiesTranslated = await Promise.all(
              data.abilities.map(async (a) => {
                try {
                  const abilityRes = await fetch(a.ability.url);
                  const abilityData = await abilityRes.json();
                  
                  // Fortificado con ?. para prevenir errores si no hay traducciones
                  const esObj = abilityData.names?.find(n => n.language.name === 'es');
                  const enName = a.ability.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                  const esName = esObj ? esObj.name : enName;
                  
                  // Fortificado con ?. para prevenir errores si no hay entradas de texto
                  const esEntry = abilityData.flavor_text_entries?.find(e => e.language.name === 'es');
                  const enEntry = abilityData.flavor_text_entries?.find(e => e.language.name === 'en');
                  let desc = "Sin descripción disponible.";
                  if (esEntry) desc = esEntry.flavor_text.replace(/\n|\f/g, ' ');
                  else if (enEntry) desc = enEntry.flavor_text.replace(/\n|\f/g, ' ');
                  
                  return { id: a.ability.name, label: `${enName} / ${esName}`, desc };
                } catch (e) {
                  const enName = a.ability.name?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || "Unknown";
                  return { id: a.ability.name || "unknown", label: enName, desc: "Sin descripción." };
                }
              })
            );
          }

          data.customAbilities = abilitiesTranslated;
          setPokemonDetails(data);
          
          setIsShiny(false);
          setGender("male");
          
          if (abilitiesTranslated.length > 0) setSelectedAbility(abilitiesTranslated[0].id);
        })
        .catch(err => console.error("Error cargando Pokémon:", err));
    }
  }, [selectedPokemon]);

  const handleSelectItem = (item) => {
    fetch(item.url)
      .then(res => res.json())
      .then(data => {
        // Fortificado con ?. para prevenir errores si no hay traducciones de objeto
        const esName = data.names?.find(n => n.language.name === 'es')?.name || data.name;
        const enName = data.names?.find(n => n.language.name === 'en')?.name || data.name;
        
        // Fortificado con ?. para prevenir errores si no hay entradas de texto de objeto
        const esEntry = data.flavor_text_entries?.find(e => e.language.name === 'es');
        const enEntry = data.flavor_text_entries?.find(e => e.language.name === 'en');
        let desc = "Sin descripción disponible.";
        if (esEntry) desc = esEntry.text.replace(/\n|\f/g, ' ');
        else if (enEntry) desc = enEntry.text.replace(/\n|\f/g, ' ');

        setSelectedItemDetails({
          enName: data.name,
          label: `${enName.charAt(0).toUpperCase() + enName.slice(1)} / ${esName}`,
          icon: data.sprites?.default || "", // Previene error si no hay sprite del objeto
          desc: desc
        });
      })
      .catch(err => console.error("Error cargando Objeto:", err));
      
    setItemSearchTerm("");
    setIsItemDropdownOpen(false);
  };

  const removeSelectedItem = () => setSelectedItemDetails(null);

  useEffect(() => {
    if (selectedTypes.length === 0) {
      setFilteredTypeNames([]);
      return;
    }
    Promise.all(selectedTypes.map(t => fetch(`https://pokeapi.co/api/v2/type/${t}`).then(res => res.json())))
      .then(results => {
        let names = results[0].pokemon.map(p => p.pokemon.name);
        if (results.length === 2) {
          const names2 = results[1].pokemon.map(p => p.pokemon.name);
          names = names.filter(n => names2.includes(n));
        }
        setFilteredTypeNames(names);
      })
      .catch(err => console.error("Error filtrando tipos:", err));
  }, [selectedTypes]);

  const handleTypeClick = (type) => {
    setSelectedGen(null);
    setSearchTerm("");
    setIsDropdownOpen(true);
    setSelectedTypes(prev => {
      if (prev.includes(type)) return prev.filter(t => t !== type);
      if (prev.length >= 2) return [prev[1], type];
      return [...prev, type];
    });
  };

  const handleGenClick = (gen) => {
    setSelectedTypes([]);
    setSearchTerm("");
    setIsDropdownOpen(true);
    if (selectedGen === gen.id) setSelectedGen(null);
    else setSelectedGen(gen.id);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  const exportToShowdown = () => {
    if (!pokemonDetails) return;

    const statMap = { hp: 'HP', attack: 'Atk', defense: 'Def', 'special-attack': 'SpA', 'special-defense': 'SpD', speed: 'Spe' };
    
    // Forzamos la inclusión de TODOS los EVs para que sea visible en la exportación
    const evParts = [];
    Object.entries(evs).forEach(([stat, val]) => evParts.push(`${val} ${statMap[stat]}`));
    const evString = `EVs: ${evParts.join(" / ")}\n`;

    // Forzamos la inclusión de TODOS los IVs
    const ivParts = [];
    Object.entries(ivs).forEach(([stat, val]) => ivParts.push(`${val} ${statMap[stat]}`));
    const ivString = `IVs: ${ivParts.join(" / ")}\n`;

    const engNature = selectedNature.split(" ")[0];
    const pokeName = pokemonDetails.name.charAt(0).toUpperCase() + pokemonDetails.name.slice(1).replace("-", " ");
    const abilityName = selectedAbility ? selectedAbility.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "Unknown";
    
    // Si hay un objeto equipado, lo añadimos a la primera línea
    const firstLine = selectedItemDetails ? `${pokeName} @ ${selectedItemDetails.enName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}` : pokeName;

    const showdownText = `${firstLine}\nAbility: ${abilityName}\nLevel: ${level}\n${evString}${engNature} Nature\n${ivString}`.trim();

    navigator.clipboard.writeText(showdownText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const filteredList = pokemonList.filter(poke => {
    const matchSearch = poke.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedTypes.length === 0 || filteredTypeNames.includes(poke.name);
    let matchGen = true;
    if (selectedGen) {
      const urlParts = poke.url.split("/").filter(Boolean);
      const id = parseInt(urlParts[urlParts.length - 1]);
      const genData = GENS.find(g => g.id === selectedGen);
      matchGen = id >= genData.range[0] && id <= genData.range[1];
    }
    return matchSearch && matchType && matchGen;
  });

  const filteredItemsList = itemList.filter(item => item.name?.toLowerCase().includes(itemSearchTerm.toLowerCase()));

  const activeNature = NATURES.find(n => n.name === selectedNature);
  const activeAbilityData = pokemonDetails?.customAbilities?.find(a => a.id === selectedAbility);

  const getSpriteUrl = () => {
    // Fortificado con ?. para prevenir errores si no hay sprites
    if (!pokemonDetails || !pokemonDetails.sprites) return "";
    let source = pokemonDetails.sprites.other?.home;
    if (!source?.front_default) source = pokemonDetails.sprites.other?.["official-artwork"];
    if (!source?.front_default) source = pokemonDetails.sprites;

    if (isShiny && gender === 'female' && source?.front_shiny_female) return source.front_shiny_female;
    if (isShiny && source?.front_shiny) return source.front_shiny;
    if (!isShiny && gender === 'female' && source?.front_female) return source.front_female;
    return source?.front_default || ""; // Fallback de seguridad definitivo
  };

  // Fortificado con ?. para prevenir errores si no hay sprites de género
  const hasGender = pokemonDetails?.sprites?.front_female != null;

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mt-6 transition-colors duration-300">
      
      {/* ---------------- FILTROS ---------------- */}
      <div className="mb-8 flex flex-col gap-8">
        <div>
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Filtro por Tipo (Máx 2)</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => { setSelectedTypes([]); setFilteredTypeNames([]); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all shadow-sm ${
                selectedTypes.length === 0 
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ring-slate-400' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center text-lg">⚪</div>
              TODOS
            </button>

            {Object.keys(TYPE_DATA).map(type => {
              const isSelected = selectedTypes.includes(type);
              return (
                <button 
                  key={type} 
                  onClick={() => handleTypeClick(type)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all shadow-sm ${
                    isSelected ? `${TYPE_DATA[type].bg} text-white ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ring-slate-400` : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <img src={TYPE_DATA[type].icon} alt={type} className="w-5 h-5 drop-shadow-md" />
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Filtro por Generación</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
             <button 
              onClick={() => setSelectedGen(null)}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all shadow-sm border ${
                selectedGen === null 
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 border-slate-900 dark:border-white ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ring-slate-400' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Todas
            </button>

            {GENS.map(gen => {
              const isSelected = selectedGen === gen.id;
              return (
                <button 
                  key={gen.id} 
                  onClick={() => handleGenClick(gen)}
                  className={`px-3 py-2 rounded-lg text-sm font-bold transition-all shadow-sm border ${
                    isSelected ? 'bg-red-500 text-white border-red-600 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ring-red-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {gen.id}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <hr className="my-6 border-slate-200 dark:border-slate-700" />

      {/* ---------------- BUSCADOR ---------------- */}
      <div className="relative mb-8" ref={dropdownRef}>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Buscar y Seleccionar Pokémon</label>
        <div className="relative">
          <input 
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onClick={() => setIsDropdownOpen(true)}
            placeholder="Escribe el nombre del Pokémon..."
            className="w-full p-4 pr-12 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl outline-none focus:border-red-500 dark:focus:border-red-500 text-lg capitalize font-semibold transition-colors"
          />
          {(searchTerm || selectedPokemon) && (
            <button onClick={() => { setSearchTerm(""); setSelectedPokemon(null); setPokemonDetails(null); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 font-bold text-xl">
              ✕
            </button>
          )}
        </div>

        {isDropdownOpen && (
          <ul className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl shadow-2xl max-h-72 overflow-y-auto">
            {filteredList.length > 0 ? (
              filteredList.map((poke) => (
                <li 
                  key={poke.name}
                  onClick={() => {
                    setSelectedPokemon(poke);
                    setSearchTerm(poke.name.replace("-", " "));
                    setIsDropdownOpen(false);
                  }}
                  className="p-4 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer capitalize border-b border-slate-100 dark:border-slate-600 last:border-0 font-medium text-slate-700 dark:text-slate-200"
                >
                  {poke.name.replace("-", " ")}
                </li>
              ))
            ) : (
              <li className="p-4 text-slate-500 dark:text-slate-400 text-center font-medium">No se encontraron Pokémon.</li>
            )}
          </ul>
        )}
      </div>

      {/* ---------------- DETALLES Y ESTADÍSTICAS ---------------- */}
      {pokemonDetails && (
        <div className="flex flex-col xl:flex-row gap-6 bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 transition-colors">
          
          {/* Tarjeta Visual (Estilo image_1.png) */}
          <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm min-w-[280px] h-fit relative">
            {getSpriteUrl() ? (
              <img 
                src={getSpriteUrl()} 
                alt={pokemonDetails.name}
                className="w-56 h-56 object-contain drop-shadow-2xl transition-all duration-300"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-400">Sin Imagen</div>
            )}
            
            {/* Controles de Diseño (Shiny / Género) */}
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => setIsShiny(!isShiny)}
                className={`px-3 py-1 text-xs font-bold rounded-lg border-2 transition-colors ${isShiny ? 'bg-yellow-400 border-yellow-500 text-yellow-900' : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'}`}
              >
                ✨ Shiny
              </button>
              {hasGender && (
                <button 
                  onClick={() => setGender(gender === "male" ? "female" : "male")}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg border-2 transition-colors ${gender === 'female' ? 'bg-pink-100 border-pink-300 text-pink-700 dark:bg-pink-900/40 dark:border-pink-700 dark:text-pink-300' : 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300'}`}
                >
                  {gender === 'male' ? '♂ Macho' : '♀ Hembra'}
                </button>
              )}
            </div>

            <h2 className="text-2xl font-bold capitalize mt-4 font-pokemon text-center leading-snug dark:text-white">
              {pokemonDetails.name.replace("-", " ")}
            </h2>
            <div className="flex gap-2 mt-4">
              {/* Fortificado con ?. para prevenir errores si no hay tipos */}
              {pokemonDetails.types?.map(t => {
                const typeData = TYPE_DATA[t.type.name];
                return (
                  <span key={t.type.name} className={`flex items-center gap-1.5 px-3 py-1 ${typeData?.bg || 'bg-slate-500'} text-white rounded-full text-xs uppercase font-bold tracking-wider shadow-md`}>
                    <img src={typeData?.icon} alt={t.type.name} className="w-4 h-4 drop-shadow-md" />
                    {t.type.name}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Builder */}
          <div className="flex-grow flex flex-col gap-6">
            
            {/* Panel Superior: Habilidad y Objeto */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative transition-colors duration-300">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b-4 border-red-500 pb-1 mb-6">Build & Equipamiento</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Selector de Habilidad */}
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600 transition-colors">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Habilidad</label>
                  <div className="relative mb-3">
                    {/* Fortificado con ?. para prevenir errores si no hay customAbilities */}
                    <select 
                      value={selectedAbility} 
                      onChange={(e) => setSelectedAbility(e.target.value)}
                      className="appearance-none w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-semibold py-2.5 px-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm capitalize shadow-sm transition-colors"
                    >
                      {pokemonDetails.customAbilities?.map(a => (
                        <option key={a.id} value={a.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                          {a.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 dark:text-slate-400">
                      <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                  {/* Descripción de Habilidad */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic border-l-2 border-red-500 pl-2">
                    {activeAbilityData?.desc}
                  </p>
                </div>

                {/* Selector de Objeto (Item) - Filtrado a competitivos */}
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600 transition-colors" ref={itemDropdownRef}>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Objeto Equipado (Item)</label>
                  
                  {!selectedItemDetails ? (
                    <div className="relative">
                      <input 
                        type="text"
                        value={itemSearchTerm}
                        onChange={(e) => { setItemSearchTerm(e.target.value); setIsItemDropdownOpen(true); }}
                        onClick={() => setIsItemDropdownOpen(true)}
                        placeholder="Buscar objeto competitivo..."
                        className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-semibold py-2.5 px-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm transition-colors"
                      />
                      {isItemDropdownOpen && (
                        <ul className="absolute z-30 w-full mt-1 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg shadow-xl max-h-48 overflow-y-auto transition-colors">
                          {/* Fortificado con ?. para prevenir errores si no hay filteredItemsList */}
                          {filteredItemsList.length > 0 ? (
                            filteredItemsList.map((item) => (
                              <li 
                                key={item.name}
                                onClick={() => handleSelectItem(item)}
                                className="p-3 hover:bg-blue-50 dark:hover:bg-slate-600 cursor-pointer capitalize border-b border-slate-100 dark:border-slate-600 last:border-0 text-sm font-medium text-slate-700 dark:text-slate-200"
                              >
                                {item.name.replace("-", " ")}
                              </li>
                            ))
                          ) : (
                            <li className="p-3 text-slate-500 dark:text-slate-400 text-sm text-center font-medium">Objeto no encontrado (Solo competitivos).</li>
                          )}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <div className="relative bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm flex items-start gap-3 transition-colors">
                      <button onClick={removeSelectedItem} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 font-bold text-sm">✕</button>
                      {/* Fortificado con ?. para prevenir errores si no hay icono */}
                      {selectedItemDetails.icon && (
                        <img src={selectedItemDetails.icon} alt="item" className="w-10 h-10 object-contain drop-shadow-sm bg-slate-100 dark:bg-slate-700 rounded-md p-1" />
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white capitalize pr-4">{selectedItemDetails.label}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 italic mt-1">{selectedItemDetails.desc}</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Panel Inferior: Estadísticas - Con dropdowns personalizados legibles */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto relative pb-20 transition-colors duration-300">
              
              <div className="flex flex-wrap items-center gap-4 mb-6 min-w-[500px]">
                {/* SELECTOR PERSONALIZADO: Nivel */}
                <div className="flex items-center gap-2" ref={levelDropdownRef}>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nivel</label>
                  <div className="relative">
                    <button
                      onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
                      className="appearance-none w-24 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold py-2 px-3 rounded-lg border-2 border-blue-200 dark:border-blue-700/50 focus:outline-none focus:border-blue-500 cursor-pointer text-sm shadow-sm transition-colors text-center flex items-center justify-between"
                    >
                        <span>{level}</span>
                        <div className="pointer-events-none flex items-center px-2 text-blue-500">
                          <svg className={`fill-current h-4 w-4 transition-transform ${isLevelDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </button>
                    {isLevelDropdownOpen && (
                      <ul className="absolute z-30 w-full mt-1 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg shadow-xl max-h-32 overflow-y-auto">
                        {[50, 100].map(l => (
                          <li 
                            key={l}
                            onClick={() => { setLevel(l); setIsLevelDropdownOpen(false); }}
                            className={`p-2.5 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer text-sm capitalize ${level === l ? 'bg-slate-100 dark:bg-slate-600 font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-800 dark:text-white'}`}
                          >
                            {l}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                
                {/* SELECTOR PERSONALIZADO: Naturaleza */}
                <div className="flex items-center gap-2" ref={natureDropdownRef}>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Naturaleza</label>
                  <div className="relative">
                    <button
                        onClick={() => setIsNatureDropdownOpen(!isNatureDropdownOpen)}
                        className="appearance-none w-80 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold py-2 px-3 rounded-lg border-2 border-red-200 dark:border-red-700/50 focus:outline-none focus:border-red-500 cursor-pointer text-sm shadow-sm transition-colors text-left flex items-center justify-between"
                    >
                        <span className="truncate">{selectedNature}</span>
                        <div className="pointer-events-none flex items-center px-2 text-red-500">
                            <svg className={`fill-current h-4 w-4 transition-transform ${isNatureDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </button>
                    {isNatureDropdownOpen && (
                      <ul className="absolute z-30 w-full mt-1 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg shadow-xl max-h-72 overflow-y-auto transition-colors">
                        {NATURES.map(n => (
                          <li 
                            key={n.name}
                            onClick={() => { setSelectedNature(n.name); setIsNatureDropdownOpen(false); }}
                            className={`p-2.5 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer text-sm capitalize ${selectedNature === n.name ? 'bg-slate-100 dark:bg-slate-600 font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-200'}`}
                          >
                            {n.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 mb-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase text-center min-w-[500px]">
                <div className="col-span-3 text-left">Stat</div>
                <div className="col-span-2">Base</div>
                <div className="col-span-2">IV (0-31)</div>
                <div className="col-span-2">EV (0-252)</div>
                <div className="col-span-3 text-right text-slate-600 dark:text-slate-300">Total</div>
              </div>

              <div className="space-y-3 min-w-[500px]">
                {/* Fortificado con ?. para prevenir errores si no hay stats */}
                {pokemonDetails.stats?.map(s => {
                  const statName = s.stat.name;
                  const baseStat = s.base_stat;
                  const iv = ivs[statName];
                  const ev = evs[statName];

                  let calculatedStat = 0;
                  // Fortificado con ?. para prevenir errores si no hay nature activa
                  let isUp = activeNature?.up === statName;
                  let isDown = activeNature?.down === statName;

                  if (statName === 'hp') {
                    calculatedStat = Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
                  } else {
                    let baseCalc = Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + 5;
                    let multiplier = isUp ? 1.1 : isDown ? 0.9 : 1.0;
                    calculatedStat = Math.floor(baseCalc * multiplier);
                  }

                  const shortName = statName === 'special-attack' ? 'Sp. Atk' : statName === 'special-defense' ? 'Sp. Def' : statName;
                  const textColor = isUp ? "text-red-500" : isDown ? "text-blue-500" : "text-slate-700 dark:text-slate-200";

                  return (
                    <div key={statName} className="grid grid-cols-12 gap-3 items-center bg-slate-50 dark:bg-slate-700/30 p-2.5 rounded-lg border border-slate-100 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
                      <span className={`col-span-3 text-xs font-bold uppercase truncate ${textColor}`} title={statName}>
                        {shortName} {isUp && "↑"} {isDown && "↓"}
                      </span>
                      <span className="col-span-2 font-mono text-sm text-center text-slate-600 dark:text-slate-300">{baseStat}</span>
                      <input 
                        type="number" 
                        value={iv} 
                        onChange={(e) => setIvs(prev => ({...prev, [statName]: Math.max(0, Math.min(31, Number(e.target.value)))}))}
                        className="col-span-2 w-full p-1.5 text-center text-sm font-mono border border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 dark:text-white rounded focus:border-blue-500 outline-none transition-colors"
                      />
                      <input 
                        type="number" 
                        value={ev} 
                        onChange={(e) => setEvs(prev => ({...prev, [statName]: Math.max(0, Math.min(252, Number(e.target.value)))}))}
                        className="col-span-2 w-full p-1.5 text-center text-sm font-mono border border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 dark:text-white rounded focus:border-blue-500 outline-none transition-colors"
                      />
                      <div className="col-span-3 flex flex-col items-end justify-center">
                        <span className={`font-bold text-lg leading-none ${isUp ? "text-red-500" : isDown ? "text-blue-500" : "text-slate-800 dark:text-white"}`}>
                          {calculatedStat}
                        </span>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full mt-1.5 overflow-hidden transition-colors">
                          <div className={`h-full ${statName === 'hp' ? 'bg-green-500' : isUp ? 'bg-red-400' : isDown ? 'bg-blue-400' : 'bg-slate-500'}`} style={{ width: `${Math.min((calculatedStat / (level === 50 ? 300 : 500)) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="absolute bottom-6 right-6">
                <button 
                  onClick={exportToShowdown}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all hover:-translate-y-1 ${copySuccess ? 'bg-green-500 ring-4 ring-green-200' : 'bg-slate-800 dark:bg-black hover:bg-slate-700'}`}
                >
                  {copySuccess ? "✅ ¡Copiado con éxito!" : "📋 Exportar a Showdown"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}