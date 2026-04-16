import React, { useState, useEffect, useRef } from "react";
import Tesseract from "tesseract.js";

const TYPE_DATA = {
    normal: { bg: "bg-[#A8A77A]" }, fire: { bg: "bg-[#EE8130]" }, water: { bg: "bg-[#6390F0]" },
    electric: { bg: "bg-[#F7D02C]" }, grass: { bg: "bg-[#7AC74C]" }, ice: { bg: "bg-[#96D9D6]" },
    fighting: { bg: "bg-[#C22E28]" }, poison: { bg: "bg-[#A33EA1]" }, ground: { bg: "bg-[#E2BF65]" },
    flying: { bg: "bg-[#A98FF3]" }, psychic: { bg: "bg-[#F95587]" }, bug: { bg: "bg-[#A6B91A]" },
    rock: { bg: "bg-[#B6A136]" }, ghost: { bg: "bg-[#735797]" }, dragon: { bg: "bg-[#6F35FC]" },
    dark: { bg: "bg-[#705746]" }, steel: { bg: "bg-[#B7B7CE]" }, fairy: { bg: "bg-[#D685AD]" }
};

const getLevenshteinDistance = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
    for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
    }
    return matrix[b.length][a.length];
};

export default function Ocr() {
    const [image, setImage] = useState(null);
    const [extractedText, setExtractedText] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const [pokemonDB, setPokemonDB] = useState([]);
    
    // Separamos los datos del Pokémon y el Nivel para que se actualicen en vivo
    const [detectedPokemonData, setDetectedPokemonData] = useState(null);
    const [detectedLevel, setDetectedLevel] = useState(50);
    
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon?limit=1302")
            .then(res => res.json())
            .then(data => setPokemonDB(data.results))
            .catch(err => console.error("Error cargando DB:", err));
    }, []);

    const processImage = async (file) => {
        setIsProcessing(true);
        setProgress(0);
        setExtractedText("");
        setDetectedPokemonData(null);
        setDetectedLevel(50);

        try {
            const result = await Tesseract.recognize(file, 'eng', {
                logger: (m) => { if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100)); }
            });

            const text = result.data.text;
            setExtractedText(text);
            analyzeTextForStats(text);
        } catch (error) {
            console.error("Error en el OCR:", error);
            setExtractedText("Error al leer la imagen.");
        } finally {
            setIsProcessing(false);
        }
    };

    const analyzeTextForStats = async (text) => {
        setIsAnalyzing(true);

        // 1. EXTRAER EL NIVEL: Buscamos TODOS los números de la imagen y cogemos el último válido.
        let level = 50; 
        const allNumbers = text.match(/\d+/g);
        if (allNumbers) {
            const validLevels = allNumbers.map(Number).filter(n => n > 0 && n <= 100);
            if (validLevels.length > 0) {
                level = validLevels[validLevels.length - 1]; 
            }
        }
        setDetectedLevel(level);

        // 2. EXTRAER EL NOMBRE DEL POKÉMON
        const cleanTextForWords = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
        const words = cleanTextForWords.split(/\s+/).filter(w => w.length > 3);
        const continuousText = text.toLowerCase().replace(/[^a-z]/g, "");

        let matchedPoke = null;

        for (let poke of pokemonDB) {
            const cleanName = poke.name.toLowerCase().replace(/[^a-z]/g, "");
            if (cleanName.length < 4) continue;

            if (continuousText.includes(cleanName)) {
                matchedPoke = poke;
                break;
            }

            const maxTypos = Math.floor(cleanName.length / 4);
            for (const word of words) {
                if (Math.abs(word.length - cleanName.length) <= 2) {
                    if (getLevenshteinDistance(word, cleanName) <= maxTypos) {
                        matchedPoke = poke;
                        break;
                    }
                }
            }
            if (matchedPoke) break;
        }

        // 3. DESCARGAR DATOS CRUDOS DEL POKÉMON
        if (matchedPoke) {
            try {
                const res = await fetch(matchedPoke.url);
                const data = await res.json();
                setDetectedPokemonData(data);
            } catch (err) {
                console.error("Error obteniendo datos del Pokémon:", err);
            }
        }
        setIsAnalyzing(false);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) { setImage(URL.createObjectURL(file)); processImage(file); }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) { setImage(URL.createObjectURL(file)); processImage(file); }
    };

    const handleReset = () => {
        setImage(null); setExtractedText(""); setProgress(0); setDetectedPokemonData(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mt-6 transition-colors duration-300 min-h-[600px]">

            <div className="flex flex-col items-center mb-8 border-b-4 border-purple-500 pb-8 pt-4">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 font-pokemon tracking-wider">Escáner de Vida (OCR)</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center max-w-lg">
                    Recorta la barra de vida del rival (Ej: <span className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">Weavile L79</span>). Extraeremos el nombre y el nivel para calcular sus estadísticas base exactas.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* ZONA DE CARGA */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700 pb-2">1. Cargar Recorte</h3>

                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => fileInputRef.current.click()}
                        className={`relative flex flex-col items-center justify-center w-full h-80 border-4 border-dashed rounded-2xl cursor-pointer transition-all overflow-hidden ${image ? 'border-purple-400 bg-slate-50 dark:bg-slate-900' : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-purple-500'}`}
                    >
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />

                        {image ? (
                            <>
                                <img src={image} alt="Upload" className="w-full h-full object-contain p-2 z-10" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-20">
                                    <span className="text-white font-bold bg-black/60 px-4 py-2 rounded-lg">Cambiar Captura</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center p-6 text-center">
                                <span className="text-5xl mb-4">✂️</span>
                                <span className="font-bold text-slate-600 dark:text-slate-300 text-lg">Arrastra la barra de vida aquí</span>
                            </div>
                        )}
                    </div>

                    {image && !isProcessing && (
                        <button onClick={handleReset} className="text-red-500 hover:text-red-700 font-bold text-sm text-center transition-colors">
                            🗑️ Borrar y subir otra
                        </button>
                    )}
                </div>

                {/* ZONA DE RESULTADOS (STATS EN VIVO) */}
                <div className="flex flex-col gap-4 h-full">
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700 pb-2">2. Stats Calculados</h3>

                    {isProcessing ? (
                        <div className="flex flex-col items-center justify-center h-full bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                            <div className="w-16 h-16 border-4 border-slate-200 border-t-purple-500 rounded-full animate-spin mb-6"></div>
                            <p className="font-bold text-slate-600 dark:text-slate-300 mb-2">Leyendo nivel y nombre...</p>
                        </div>
                    ) : isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center h-full py-10">
                            <span className="text-4xl animate-bounce mb-2">🧮</span>
                            <p className="font-bold text-slate-500">Calculando estadísticas...</p>
                        </div>
                    ) : detectedPokemonData ? (
                        <div className="flex flex-col h-full gap-4">
                            
                            {/* TARJETA DE STATS EN VIVO */}
                            <div className="bg-white dark:bg-slate-800 border-2 border-purple-500 dark:border-purple-600 rounded-xl p-6 shadow-lg">
                                
                                <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                                    <div className="flex items-center gap-4">
                                        <img src={detectedPokemonData.sprites.front_default || detectedPokemonData.sprites.other?.home?.front_default} alt="poke" className="w-16 h-16 drop-shadow-md" />
                                        <div>
                                            <h4 className="text-2xl font-black text-slate-800 dark:text-white capitalize leading-none">{detectedPokemonData.name.replace("-", " ")}</h4>
                                            <div className="flex gap-1 mt-2">
                                                {detectedPokemonData.types.map(t => (
                                                    <span key={t.type.name} className={`px-2 py-0.5 ${TYPE_DATA[t.type.name]?.bg || 'bg-slate-500'} text-white rounded text-[10px] uppercase font-bold tracking-wider`}>{t.type.name}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* CUADRO EDITABLE DEL NIVEL */}
                                    <div className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-lg border-2 border-purple-300 dark:border-purple-700 text-center flex flex-col items-center group relative cursor-pointer" title="Si la IA falló, haz clic para corregir el nivel">
                                        <span className="block text-[10px] uppercase font-bold opacity-80 mb-1">Nivel</span>
                                        <input 
                                            type="number"
                                            value={detectedLevel}
                                            onChange={(e) => setDetectedLevel(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                                            className="w-16 text-3xl font-black bg-transparent text-center outline-none border-b-2 border-transparent focus:border-purple-500 appearance-none"
                                        />
                                        <span className="text-[9px] absolute -bottom-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">✏️ Editable</span>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 text-center italic">
                                    * Stats en vivo a Nivel {detectedLevel} (31 IVs, 0 EVs, Nat. Neutra).
                                </p>

                                <div className="space-y-3">
                                    {/* CÁLCULO EN LÍNEA BASADO EN EL INPUT */}
                                    {detectedPokemonData.stats.map(s => {
                                        const shortName = s.stat.name === 'special-attack' ? 'SpA' : s.stat.name === 'special-defense' ? 'SpD' : s.stat.name;
                                        const base = s.base_stat;
                                        let statVal = 0;

                                        if (s.stat.name === 'hp') {
                                            statVal = Math.floor(((2 * base + 31 + Math.floor(0 / 4)) * detectedLevel) / 100) + detectedLevel + 10;
                                        } else {
                                            statVal = Math.floor(((2 * base + 31 + Math.floor(0 / 4)) * detectedLevel) / 100) + 5;
                                        }

                                        return (
                                            <div key={s.stat.name} className="flex items-center gap-3">
                                                <span className="w-10 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 text-right">{shortName}</span>
                                                <span className="w-10 text-lg font-black text-slate-800 dark:text-white text-right">{statVal}</span>
                                                <div className="flex-grow bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                                                    <div className={`h-full transition-all duration-300 ${s.stat.name === 'hp' ? 'bg-green-500' : 'bg-purple-500'}`} style={{ width: `${Math.min((statVal / 300) * 100, 100)}%` }}></div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-slate-400">
                            Esperando recorte...
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}