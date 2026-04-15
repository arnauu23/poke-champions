import React, { useState, useEffect, useRef } from "react";

// --- DICCIONARIOS Y CONSTANTES ---
const TYPE_DATA = {
  normal: { bg: "bg-[#A8A77A]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/normal.svg" },
  fire: { bg: "bg-[#EE8130]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/fire.svg" },
  water: { bg: "bg-[#6390F0]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/water.svg" },
  electric: { bg: "bg-[#F7D02C]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/electric.svg" },
  grass: { bg: "bg-[#7AC74C]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/grass.svg" },
  ice: { bg: "bg-[#96D9D6]", icon: "https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons/icons/ice.svg" },
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

export default function Builder() {
  const [team, setTeam] = useState(Array(6).fill(null));
  
  const [pokemonList, setPokemonList] = useState([]);
  const [itemList, setItemList] = useState([]);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingSlotIndex, setEditingSlotIndex] = useState(null);
  const [itemSearchTerm, setItemSearchTerm] = useState("");
  const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);
  
  const [copySuccess, setCopySuccess] = useState(false);

  const itemDropdownRef = useRef(null);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1302")
      .then(res => res.json())
      .then(data => setPokemonList(data.results))
      .catch(err => console.error(err));

    fetch("https://pokeapi.co/api/v2/item?limit=2000")
      .then(res => res.json())
      .then(data => {
        const filteredItems = data.results.filter(item => COMPETITIVE_ITEM_IDS.includes(item.name));
        setItemList(filteredItems);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (itemDropdownRef.current && !itemDropdownRef.current.contains(event.target)) {
        setIsItemDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openSearchModal = (index) => {
    setActiveSlotIndex(index);
    setSearchTerm("");
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
    setActiveSlotIndex(null);
  };

  const removeMember = (index, e) => {
    e.stopPropagation();
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
    if (editingSlotIndex === index) setEditingSlotIndex(null);
  };

  const handleSelectPokemon = async (poke) => {
    try {
      const res = await fetch(poke.url);
      const data = await res.json();

      let spriteUrl = data.sprites.other?.home?.front_default 
                   || data.sprites.other?.["official-artwork"]?.front_default 
                   || data.sprites.front_default;

      let abilitiesTranslated = [];
      if (data.abilities?.length > 0) {
        abilitiesTranslated = await Promise.all(
          data.abilities.map(async (a) => {
            try {
              const abilityRes = await fetch(a.ability.url);
              const abilityData = await abilityRes.json();
              const esObj = abilityData.names?.find(n => n.language.name === 'es');
              const enName = a.ability.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
              const esName = esObj ? esObj.name : enName;

              const esEntries = abilityData.flavor_text_entries?.filter(e => e.language.name === 'es');
              const esEntry = esEntries?.length > 0 ? esEntries[esEntries.length - 1] : null;

              const enEntries = abilityData.flavor_text_entries?.filter(e => e.language.name === 'en');
              const enEntry = enEntries?.length > 0 ? enEntries[enEntries.length - 1] : null;

              let desc = "Sin descripción disponible.";
              if (esEntry) desc = esEntry.flavor_text.replace(/\n|\f/g, ' ');
              else if (enEntry) desc = enEntry.flavor_text.replace(/\n|\f/g, ' ');

              return { id: a.ability.name, label: `${enName} / ${esName}`, desc };
            } catch (e) {
              return { id: a.ability.name, label: a.ability.name, desc: "Sin descripción." };
            }
          })
        );
      }

      const defaultBuild = {
        level: 50,
        nature: NATURES[0].name,
        ability: abilitiesTranslated.length > 0 ? abilitiesTranslated[0].id : "",
        item: null,
        ivs: { hp: 31, attack: 31, defense: 31, "special-attack": 31, "special-defense": 31, speed: 31 },
        evs: { hp: 0, attack: 0, defense: 0, "special-attack": 0, "special-defense": 0, speed: 0 }
      };

      const newTeam = [...team];
      newTeam[activeSlotIndex] = {
        name: data.name,
        sprite: spriteUrl,
        types: data.types.map(t => t.type.name),
        stats: data.stats,
        customAbilities: abilitiesTranslated,
        build: defaultBuild
      };
      
      setTeam(newTeam);
      closeSearchModal();
      setEditingSlotIndex(activeSlotIndex); 
    } catch (error) {
      console.error("Error cargando Pokémon:", error);
    }
  };

  const filteredList = pokemonList.filter(poke => poke.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const openEditModal = (index) => {
    setEditingSlotIndex(index);
    setItemSearchTerm("");
  };

  const closeEditModal = () => {
    setEditingSlotIndex(null);
  };

  const updateBuild = (field, value) => {
    const newTeam = [...team];
    newTeam[editingSlotIndex].build[field] = value;
    setTeam(newTeam);
  };

  const updateIV = (stat, value) => {
    const newTeam = [...team];
    newTeam[editingSlotIndex].build.ivs[stat] = Math.max(0, Math.min(31, Number(value) || 0));
    setTeam(newTeam);
  };

  const updateEV = (stat, value) => {
    const newTeam = [...team];
    newTeam[editingSlotIndex].build.evs[stat] = Math.max(0, Math.min(252, Number(value) || 0));
    setTeam(newTeam);
  };

  const handleSelectItem = (item) => {
    fetch(item.url)
      .then(res => res.json())
      .then(data => {
        const esName = data.names?.find(n => n.language.name === 'es')?.name || data.name;
        const enName = data.names?.find(n => n.language.name === 'en')?.name || data.name;
        
        const esEntries = data.flavor_text_entries?.filter(e => e.language.name === 'es');
        const esEntry = esEntries?.length > 0 ? esEntries[esEntries.length - 1] : null;

        const enEntries = data.flavor_text_entries?.filter(e => e.language.name === 'en');
        const enEntry = enEntries?.length > 0 ? enEntries[enEntries.length - 1] : null;

        let desc = "Sin descripción disponible.";
        if (esEntry) desc = esEntry.text.replace(/\n|\f/g, ' ');
        else if (enEntry) desc = enEntry.text.replace(/\n|\f/g, ' ');

        const itemObj = {
          enName: data.name,
          label: `${enName.charAt(0).toUpperCase() + enName.slice(1)} / ${esName}`,
          icon: data.sprites?.default || "",
          desc: desc
        };
        updateBuild("item", itemObj);
      })
      .catch(err => console.error(err));
    setItemSearchTerm("");
    setIsItemDropdownOpen(false);
  };

  const filteredItemsList = itemList.filter(item => item.name?.toLowerCase().includes(itemSearchTerm.toLowerCase()));

  const exportTeamToShowdown = () => {
    const validMembers = team.filter(member => member !== null);
    
    if (validMembers.length === 0) {
      alert("Añade al menos un Pokémon a tu equipo para poder exportarlo.");
      return;
    }

    let exportText = "";
    const statMap = { hp: 'HP', attack: 'Atk', defense: 'Def', 'special-attack': 'SpA', 'special-defense': 'SpD', speed: 'Spe' };

    validMembers.forEach(member => {
      const { name, build } = member;
      
      const evParts = [];
      Object.entries(build.evs).forEach(([stat, val]) => { if(val > 0) evParts.push(`${val} ${statMap[stat]}`); });
      const evString = evParts.length > 0 ? `EVs: ${evParts.join(" / ")}\n` : "";

      const ivParts = [];
      Object.entries(build.ivs).forEach(([stat, val]) => { if(val < 31) ivParts.push(`${val} ${statMap[stat]}`); });
      const ivString = ivParts.length > 0 ? `IVs: ${ivParts.join(" / ")}\n` : "";

      const engNature = build.nature.split(" ")[0];
      const pokeName = name.charAt(0).toUpperCase() + name.slice(1).replace("-", " ");
      const abilityName = build.ability ? build.ability.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "Unknown";
      
      const firstLine = build.item ? `${pokeName} @ ${build.item.enName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}` : pokeName;

      exportText += `${firstLine}\nAbility: ${abilityName}\nLevel: ${build.level}\n${evString}${engNature} Nature\n${ivString}\n\n`;
    });

    navigator.clipboard.writeText(exportText.trim()).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const editingMember = editingSlotIndex !== null ? team[editingSlotIndex] : null;
  const activeNature = editingMember ? NATURES.find(n => n.name === editingMember.build.nature) : null;
  const activeAbilityData = editingMember ? editingMember.customAbilities?.find(a => a.id === editingMember.build.ability) : null;

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mt-6 transition-colors duration-300 relative">
      
      {/* ---------------- CABECERA ---------------- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-4 border-red-500 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Constructor de Equipos</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Selecciona, edita las estadísticas y exporta tu equipo definitivo.</p>
        </div>
        <button
          onClick={exportTeamToShowdown}
          className={`px-6 py-3 rounded-xl font-bold shadow-md transition-all flex items-center gap-2 hover:scale-105 ${copySuccess ? 'bg-green-500 text-white ring-4 ring-green-200' : 'bg-slate-800 dark:bg-black text-white'}`}
        >
          {copySuccess ? "✅ ¡Equipo Copiado!" : "📋 Exportar Equipo"}
        </button>
      </div>

      {/* ---------------- CUADRÍCULA (GRID) ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member, index) => (
          <div
            key={index}
            className={`h-56 rounded-2xl flex flex-col items-center justify-center transition-all relative ${
              member 
                ? "bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 shadow-sm cursor-pointer hover:border-blue-400 dark:hover:border-blue-500" 
                : "border-4 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer group"
            }`}
            onClick={() => member ? openEditModal(index) : openSearchModal(index)}
          >
            {member ? (
              <div className="flex flex-col items-center justify-center w-full h-full p-4 relative">
                <button 
                  onClick={(e) => removeMember(index, e)}
                  className="absolute top-3 right-3 w-8 h-8 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white rounded-full flex items-center justify-center font-bold transition-colors z-10"
                  title="Eliminar Pokémon"
                >
                  ✕
                </button>
                
                {member.sprite && (
                  <img src={member.sprite} alt={member.name} className="w-28 h-28 object-contain drop-shadow-lg mb-2 group-hover:scale-105 transition-transform" />
                )}
                <h3 className="font-bold text-lg text-slate-800 dark:text-white capitalize flex items-center gap-2">
                  {member.name.replace("-", " ")} 
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded-full text-slate-500 dark:text-slate-300">Lv. {member.build.level}</span>
                </h3>
                
                <div className="flex gap-1.5 mt-2">
                  {member.types.map(type => {
                    const typeData = TYPE_DATA[type];
                    return (
                      <span key={type} className={`flex items-center gap-1 px-2 py-0.5 ${typeData?.bg || 'bg-slate-500'} text-white rounded-full text-[10px] uppercase font-bold tracking-wider shadow-sm`}>
                        <img src={typeData?.icon} alt={type} className="w-3 h-3 drop-shadow-sm" />
                        {type}
                      </span>
                    );
                  })}
                </div>

                {member.build.item && (
                  <div className="absolute bottom-3 left-3 bg-white dark:bg-slate-800 rounded-full p-1 shadow-md border border-slate-200 dark:border-slate-600" title={member.build.item.label}>
                     <img src={member.build.item.icon} alt="item" className="w-5 h-5" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center pointer-events-none">
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-all shadow-inner">
                  <span className="text-4xl text-slate-400 dark:text-slate-300 font-bold group-hover:text-red-500 transition-colors">+</span>
                </div>
                <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Añadir al Espacio {index + 1}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ---------------- MODAL 1: BUSCADOR DE POKÉMON ---------------- */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-slate-200 dark:border-slate-700">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg">Seleccionar Pokémon</h3>
              <button onClick={closeSearchModal} className="text-slate-400 hover:text-red-500 text-xl font-bold p-1">✕</button>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800">
              <input 
                type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} autoFocus placeholder="Escribe para buscar..."
                className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-slate-800 dark:text-white font-semibold transition-all"
              />
            </div>
            <ul className="overflow-y-auto flex-grow p-2">
              {filteredList.length > 0 ? (
                filteredList.map((poke) => (
                  <li 
                    key={poke.name} onClick={() => handleSelectPokemon(poke)}
                    className="p-3 mx-2 my-1 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer capitalize rounded-lg font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center"
                  >
                    <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 mr-3"></span>{poke.name.replace("-", " ")}
                  </li>
                ))
              ) : (<li className="p-8 text-slate-500 dark:text-slate-400 text-center font-medium">No se encontró Pokémon.</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: EDITOR DE BUILD ---------------- */}
      {editingSlotIndex !== null && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-700 overflow-hidden">
            
            {/* Header del Editor */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-4">
                <img src={editingMember.sprite} alt="sprite" className="w-12 h-12 drop-shadow-md" />
                <h3 className="font-bold text-slate-800 dark:text-white text-xl capitalize">Configurar a {editingMember.name.replace("-", " ")}</h3>
              </div>
              <button onClick={closeEditModal} className="text-slate-400 hover:text-red-500 text-2xl font-bold p-1">✕</button>
            </div>

            {/* Contenido scrolleable del Editor */}
            <div className="p-6 overflow-y-auto flex-grow space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Habilidad */}
                <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Habilidad</label>
                  <select 
                    value={editingMember.build.ability} 
                    onChange={(e) => updateBuild("ability", e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-semibold py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm capitalize"
                  >
                    {editingMember.customAbilities?.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                  </select>
                  {activeAbilityData && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic border-l-2 border-blue-500 pl-2 mt-2">
                      {activeAbilityData.desc}
                    </p>
                  )}
                </div>

                {/* Objeto */}
                <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600" ref={itemDropdownRef}>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Objeto (Item)</label>
                  {!editingMember.build.item ? (
                    <div className="relative">
                      <input 
                        type="text" value={itemSearchTerm} onChange={(e) => { setItemSearchTerm(e.target.value); setIsItemDropdownOpen(true); }} onClick={() => setIsItemDropdownOpen(true)}
                        placeholder="Buscar objeto..." className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-semibold py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-600 text-sm"
                      />
                      {isItemDropdownOpen && (
                        <ul className="absolute z-30 w-full mt-1 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                          {filteredItemsList.map((item) => (
                            <li key={item.name} onClick={() => handleSelectItem(item)} className="p-2 hover:bg-blue-50 dark:hover:bg-slate-600 cursor-pointer capitalize border-b border-slate-100 dark:border-slate-600 last:border-0 text-sm text-slate-700 dark:text-slate-200">
                              {item.name.replace("-", " ")}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-300 dark:border-slate-600">
                      <img src={editingMember.build.item.icon} alt="item" className="w-8 h-8 object-contain mt-1" />
                      <div className="flex-grow flex flex-col overflow-hidden">
                        <span className="text-sm font-bold truncate dark:text-white">{editingMember.build.item.label}</span>
                        {/* Hemos quitado line-clamp-2 para que se lea la descripción entera */}
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 italic leading-tight mt-1">{editingMember.build.item.desc}</span>
                      </div>
                      <button onClick={() => updateBuild("item", null)} className="text-red-500 hover:text-red-700 font-bold px-2 pt-1">✕</button>
                    </div>
                  )}
                </div>
                
                {/* Nivel */}
                <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Nivel</label>
                  <select 
                    value={editingMember.build.level} onChange={(e) => updateBuild("level", Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value={50}>50</option><option value={100}>100</option>
                  </select>
                </div>

                {/* Naturaleza */}
                <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Naturaleza</label>
                  <select 
                    value={editingMember.build.nature} onChange={(e) => updateBuild("nature", e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {NATURES.map(n => <option key={n.name} value={n.name}>{n.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Tabla de Stats (IVs y EVs) */}
              <div>
                <div className="grid grid-cols-12 gap-2 mb-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase text-center">
                  <div className="col-span-3 text-left">Stat</div>
                  <div className="col-span-2">Base</div>
                  <div className="col-span-2">IVs</div>
                  <div className="col-span-2">EVs</div>
                  <div className="col-span-3 text-right">Total</div>
                </div>

                <div className="space-y-2">
                  {editingMember.stats?.map(s => {
                    const statName = s.stat.name;
                    const baseStat = s.base_stat;
                    const iv = editingMember.build.ivs[statName];
                    const ev = editingMember.build.evs[statName];
                    const lvl = editingMember.build.level;

                    let calculatedStat = 0;
                    let isUp = activeNature?.up === statName;
                    let isDown = activeNature?.down === statName;

                    if (statName === 'hp') {
                      calculatedStat = Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * lvl) / 100) + lvl + 10;
                    } else {
                      let baseCalc = Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * lvl) / 100) + 5;
                      calculatedStat = Math.floor(baseCalc * (isUp ? 1.1 : isDown ? 0.9 : 1.0));
                    }

                    const shortName = statName === 'special-attack' ? 'SpA' : statName === 'special-defense' ? 'SpD' : statName;
                    const textColor = isUp ? "text-blue-500" : isDown ? "text-red-500" : "text-slate-700 dark:text-slate-200";

                    return (
                      <div key={statName} className="grid grid-cols-12 gap-2 items-center bg-slate-50 dark:bg-slate-700/30 p-2 rounded-lg border border-slate-100 dark:border-slate-600">
                        <span className={`col-span-3 text-[11px] font-bold uppercase ${textColor}`}>{shortName} {isUp&&"↑"}{isDown&&"↓"}</span>
                        <span className="col-span-2 font-mono text-sm text-center text-slate-600 dark:text-slate-300">{baseStat}</span>
                        <input type="number" value={iv} onChange={(e) => updateIV(statName, e.target.value)} className="col-span-2 w-full p-1 text-center text-sm font-mono border border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800 dark:text-white rounded" />
                        <input type="number" value={ev} onChange={(e) => updateEV(statName, e.target.value)} className="col-span-2 w-full p-1 text-center text-sm font-mono border border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800 dark:text-white rounded" />
                        <div className="col-span-3 flex flex-col items-end justify-center pr-1">
                          <span className={`font-bold text-base leading-none ${isUp ? "text-blue-500" : isDown ? "text-red-500" : "text-slate-800 dark:text-white"}`}>{calculatedStat}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
            
            {/* Footer del Editor */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-end">
              <button onClick={closeEditModal} className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors shadow-md">Listo</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}