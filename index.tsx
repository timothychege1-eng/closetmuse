import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// --- STYLES ---
const Style = () => (
  <style>{`
    :root {
      --background-light: #fdfcff;
      --text-light: #1c1c1e;
      --primary-light: #7e57c2;
      --primary-light-rgb: 126, 87, 194;
      --secondary-light: #f0ebf9;
      --card-light: #ffffff;
      --shadow-light: rgba(0, 0, 0, 0.1);
      --danger-light: #ef5350;

      --background-dark: #121212;
      --text-dark: #e1e1e6;
      --primary-dark: #9575cd;
      --primary-dark-rgb: 149, 117, 205;
      --secondary-dark: #2a2a2e;
      --card-dark: #1e1e1e;
      --shadow-dark: rgba(0, 0, 0, 0.25);
      --danger-dark: #e57373;
    }

    [data-theme='light'] {
      --background: var(--background-light);
      --text: var(--text-light);
      --primary: var(--primary-light);
      --primary-rgb: var(--primary-light-rgb);
      --secondary: var(--secondary-light);
      --card: var(--card-light);
      --shadow: var(--shadow-light);
      --danger: var(--danger-light);
    }

    [data-theme='dark'] {
      --background: var(--background-dark);
      --text: var(--text-dark);
      --primary: var(--primary-dark);
      --primary-rgb: var(--primary-dark-rgb);
      --secondary: var(--secondary-dark);
      --card: var(--card-dark);
      --shadow: var(--shadow-dark);
      --danger: var(--danger-dark);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Poppins', sans-serif;
      background-color: var(--background);
      color: var(--text);
      transition: background-color 0.3s, color 0.3s;
      margin: 0;
      padding-bottom: 80px; /* Space for bottom nav */
    }

    #root {
      max-width: 600px;
      margin: 0 auto;
      padding: 1rem;
    }

    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      vertical-align: middle;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .main-content {
      flex-grow: 1;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      margin-bottom: 1rem;
    }

    .header h1 {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--primary);
    }

    .theme-switch {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      max-width: 600px;
      margin: 0 auto;
      background-color: var(--card);
      display: flex;
      justify-content: space-around;
      padding: 0.5rem 0;
      border-top: 1px solid var(--secondary);
      box-shadow: 0 -2px 10px var(--shadow);
      z-index: 1000;
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      color: var(--text);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      transition: color 0.2s, background-color 0.2s;
      flex: 1;
    }

    .nav-item.active {
      color: var(--primary);
    }

    .nav-item:hover {
        background-color: var(--secondary);
    }

    .nav-item .material-symbols-outlined {
      font-size: 24px;
    }

    .nav-item span {
      font-size: 12px;
    }

    .card {
      background-color: var(--card);
      padding: 1.5rem;
      border-radius: 16px;
      box-shadow: 0 4px 15px var(--shadow);
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .weather-card h2 {
      font-size: 1rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      opacity: 0.8;
    }

    .weather-card .weather-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      font-size: 2.5rem;
      font-weight: 600;
    }
    
    .weather-card .weather-info .material-symbols-outlined {
        font-size: 3rem;
        color: var(--primary);
    }

    .outfit-card h2 {
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    .outfit-display {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .outfit-item {
        background-color: var(--secondary);
        border-radius: 12px;
        overflow: hidden;
        text-align: center;
        padding-bottom: 0.5rem;
    }

    .outfit-item img {
      width: 100%;
      height: 100px;
      object-fit: cover;
    }

    .outfit-item p {
        font-size: 0.8rem;
        font-weight: 500;
        margin-top: 0.5rem;
    }

    .btn {
      background-color: var(--primary);
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 20px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn:hover {
      background-color: color-mix(in srgb, var(--primary) 90%, black);
      transform: translateY(-2px);
    }
    
    .btn.secondary {
        background-color: var(--secondary);
        color: var(--primary);
    }
    .btn.secondary:hover {
        background-color: color-mix(in srgb, var(--secondary) 90%, black);
    }
    
    .btn.danger {
        background-color: var(--danger);
    }
    .btn.danger:hover {
        background-color: color-mix(in srgb, var(--danger) 90%, black);
    }

    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(var(--primary-rgb), 0.7);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        z-index: 2000;
        backdrop-filter: blur(5px);
    }
    
    .loading-spinner {
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top: 4px solid #fff;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .wardrobe-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }

    .wardrobe-item {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.2s;
    }
    
    .wardrobe-item:hover {
        transform: scale(1.05);
    }

    .wardrobe-item img {
        width: 100%;
        height: 120px;
        object-fit: cover;
        display: block;
    }

    .wardrobe-item-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
        color: white;
        padding: 0.5rem;
        font-size: 0.8rem;
        text-align: center;
    }

    .upload-area {
        border: 2px dashed var(--primary);
        border-radius: 12px;
        padding: 2rem;
        text-align: center;
        cursor: pointer;
        background-color: var(--secondary);
    }
    
    .upload-area p {
        margin-top: 1rem;
    }

    input[type="file"] {
        display: none;
    }

    .placeholder-text {
        color: var(--text);
        opacity: 0.7;
        text-align: center;
        padding: 2rem;
    }

    .tips-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .tip-card {
        text-align: left;
    }

    .tip-card p {
        font-size: 1rem;
        line-height: 1.6;
    }

    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1500;
        backdrop-filter: blur(4px);
    }

    .modal-content {
        background-color: var(--card);
        padding: 1.5rem;
        border-radius: 16px;
        box-shadow: 0 8px 30px var(--shadow);
        width: 90%;
        max-width: 400px;
        max-height: 90vh;
        overflow-y: auto;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--secondary);
    }
    
    .modal-header h3 {
        color: var(--primary);
        font-size: 1.2rem;
    }
    
    .modal-header .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text);
    }

    .modal-body img {
        width: 100%;
        border-radius: 12px;
        margin-bottom: 1rem;
        max-height: 250px;
        object-fit: cover;
    }
    
    .form-group {
        margin-bottom: 1rem;
        text-align: left;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    
    .form-group input, .form-group select {
        width: 100%;
        padding: 0.7rem;
        border-radius: 8px;
        border: 1px solid var(--secondary);
        background-color: var(--secondary);
        color: var(--text);
        font-size: 1rem;
    }

    .modal-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1.5rem;
        gap: 1rem;
    }
  `}</style>
);

// --- TYPES ---
type ClothingCategory = 'top' | 'bottom' | 'outerwear' | 'shoes' | 'accessory';
const CLOTHING_CATEGORIES: ClothingCategory[] = ['top', 'bottom', 'outerwear', 'shoes', 'accessory'];

type ClothingItem = {
  id: string;
  category: ClothingCategory;
  tags: string[];
  imageUrl: string;
};
type Outfit = {
  top?: ClothingItem;
  bottom?: ClothingItem;
  outerwear?: ClothingItem;
  shoes?: ClothingItem;
  accessory?: ClothingItem;
};
type Weather = {
  temp: number;
  condition: string;
  icon: string;
  city: string;
};
type Screen = 'home' | 'wardrobe' | 'upload' | 'tips';

// --- API & UTILS ---
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

// --- COMPONENTS ---

const LoadingOverlay = ({ message }: { message: string }) => (
  <div className="loading-overlay">
    <div className="loading-spinner"></div>
    <p>{message}</p>
  </div>
);

const WeatherCard = ({ weather }: { weather: Weather | null }) => (
  <div className="card weather-card">
    <h2>Current Weather</h2>
    {weather ? (
      <div className="weather-info">
        <span className="material-symbols-outlined">{weather.icon}</span>
        <span>{weather.temp}°C</span>
        <span>in {weather.city}</span>
      </div>
    ) : (
      <p>Fetching weather...</p>
    )}
  </div>
);

const OutfitCard = ({ outfit, onGenerate, loading }: { outfit: Outfit | null; onGenerate: () => void; loading: boolean; }) => (
  <div className="card outfit-card">
    <h2>Today's Outfit Suggestion</h2>
    {outfit ? (
      <div className="outfit-display">
        {Object.entries(outfit).map(([category, item]) => 
          item ? (
            <div key={item.id} className="outfit-item">
              <img src={item.imageUrl} alt={item.tags.join(', ')} />
              <p>{category.charAt(0).toUpperCase() + category.slice(1)}</p>
            </div>
          ) : null
        )}
      </div>
    ) : (
      <p className="placeholder-text">Add clothes to your wardrobe to get suggestions!</p>
    )}
    <button className="btn" onClick={onGenerate} disabled={loading}>
        <span className="material-symbols-outlined">shuffle</span>
        {loading ? 'Thinking...' : 'New Look'}
    </button>
  </div>
);

const HomeScreen = ({ weather, outfit, onGenerateOutfit, loadingOutfit }) => (
  <div>
    <WeatherCard weather={weather} />
    <OutfitCard outfit={outfit} onGenerate={onGenerateOutfit} loading={loadingOutfit} />
  </div>
);

const WardrobeScreen = ({ wardrobe, onItemClick }) => (
    <div>
        <h2>My Wardrobe</h2>
        {wardrobe.length > 0 ? (
            <div className="wardrobe-grid">
                {wardrobe.map(item => (
                    <div key={item.id} className="wardrobe-item" onClick={() => onItemClick(item)}>
                        <img src={item.imageUrl} alt={item.tags.join(', ')} />
                        <div className="wardrobe-item-overlay">
                            <p>{item.category}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
             <p className="placeholder-text">Your wardrobe is empty. Go to the Upload tab to add some clothes!</p>
        )}
    </div>
);

const UploadScreen = ({ onUpload }) => {
    return (
        <div>
            <h2>Upload Clothes</h2>
            <div 
                className="upload-area"
                onClick={() => document.getElementById('file-input')?.click()}
            >
                <input id="file-input" type="file" accept="image/*" onChange={(e) => e.target.files && onUpload(e.target.files[0])} />
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--primary)' }}>cloud_upload</span>
                <p>Click or drag & drop to upload a photo of your clothing item.</p>
            </div>
        </div>
    );
};

const TipsScreen = ({ tips, onGenerate, loading }: { tips: string[], onGenerate: () => void, loading: boolean }) => (
    <div>
        <h2>Tips & Trends</h2>
        {loading && tips.length === 0 ? (
            <div className="card"><p className="placeholder-text">Fetching fresh tips...</p></div>
        ) : (
            <div className="tips-container">
                {tips.map((tip, index) => (
                    <div key={index} className="card tip-card">
                        <p>{tip}</p>
                    </div>
                ))}
            </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button className="btn" onClick={onGenerate} disabled={loading}>
                <span className="material-symbols-outlined">refresh</span>
                {loading ? 'Fetching...' : 'Get New Tips'}
            </button>
        </div>
    </div>
);

const EditItemModal = ({ item, onClose, onUpdate, onDelete }: { item: ClothingItem; onClose: () => void; onUpdate: (item: ClothingItem) => void; onDelete: (itemId: string) => void; }) => {
    const [category, setCategory] = useState<ClothingCategory>(item.category);
    const [tags, setTags] = useState(item.tags.join(', '));

    const handleSave = () => {
        const updatedItem = {
            ...item,
            category,
            tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        };
        onUpdate(updatedItem);
    };

    const handleDelete = () => {
        if(window.confirm("Are you sure you want to delete this item? This action cannot be undone.")){
            onDelete(item.id);
        }
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Edit Item</h3>
                    <button onClick={onClose} className="close-btn">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="modal-body">
                    <img src={item.imageUrl} alt={item.tags.join(', ')} />
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value as ClothingCategory)}>
                            {CLOTHING_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="tags">Tags (comma-separated)</label>
                        <input id="tags" type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn danger" onClick={handleDelete}>
                        <span className="material-symbols-outlined">delete</span>
                        Delete
                    </button>
                    <button className="btn" onClick={handleSave}>Save Changes</button>
                </div>
            </div>
        </div>
    )
}

// --- MAIN APP ---

const App = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [screen, setScreen] = useState<Screen>('home');
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [loadingTips, setLoadingTips] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);

  const model = useMemo(() => ai.models, []);

  // Load state from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) setTheme(savedTheme);
    else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }

    const savedWardrobe = localStorage.getItem('wardrobe');
    if (savedWardrobe) setWardrobe(JSON.parse(savedWardrobe));
  }, []);

  // Save state to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('wardrobe', JSON.stringify(wardrobe));
  }, [wardrobe]);

  // Fetch Weather
  const fetchWeather = useCallback((lat: number, lon: number) => {
    const prompt = `Based on the location (latitude: ${lat}, longitude: ${lon}), what is the current weather? Give me the temperature in Celsius, a short condition description (e.g., 'Sunny', 'Cloudy'), the city name, and a corresponding material symbols icon name (e.g., 'sunny', 'cloudy', 'rainy'). Format the response as a JSON object with keys: temp, condition, icon, city.`;
    
    model.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    }).then(response => {
        try {
            const weatherData = JSON.parse(response.text);
            setWeather(weatherData);
        } catch(e) {
            console.error("Failed to parse weather data", e);
            setWeather({temp: 22, condition: "Sunny", icon: "sunny", city: "Somewhere nice"}); // Fallback
        }
    }).catch(error => {
        console.error("Error fetching weather:", error);
    });
  }, [model]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Geolocation error:", error);
        // Fallback location (e.g., London)
        fetchWeather(51.5074, -0.1278);
      }
    );
  }, [fetchWeather]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const analyzeAndAddClothing = async (file: File) => {
    setLoading("Analyzing your item...");
    try {
        const imagePart = await fileToGenerativePart(file);
        const response = await model.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    imagePart,
                    { text: "Analyze this image of a clothing item. What is its category (top, bottom, outerwear, shoes, or accessory)? Provide 2-3 descriptive tags (e.g., casual, blue, cotton t-shirt). Respond in JSON format with keys 'category' and 'tags'." }
                ]
            },
            config: { responseMimeType: 'application/json' }
        });
        
        const result = JSON.parse(response.text);
        const newItem: ClothingItem = {
            id: new Date().toISOString(),
            category: result.category,
            tags: result.tags,
            imageUrl: URL.createObjectURL(file)
        };
        setWardrobe(prev => [...prev, newItem]);
        setScreen('wardrobe');
    } catch (error) {
        console.error("Error analyzing clothing:", error);
        alert("Sorry, I couldn't analyze that item. Please try again.");
    } finally {
        setLoading(null);
    }
  };
  
  const generateOutfit = useCallback(async () => {
    if (wardrobe.length < 3) {
        alert("Please add at least 3 items to your wardrobe to generate an outfit.");
        return;
    }
    setLoading("Creating your look...");
    try {
        const prompt = `
            From this list of available clothing items, create a stylish and coherent outfit.
            Weather: ${weather?.condition}, ${weather?.temp}°C.
            Available items (JSON): ${JSON.stringify(wardrobe.map(i => ({id: i.id, category: i.category, tags: i.tags})))}
            
            Rules:
            - The outfit should be appropriate for the weather.
            - Pick one item for each of these categories if available: 'top', 'bottom', 'shoes'.
            - Optionally include 'outerwear' and 'accessory' if they fit the weather and style.
            - Respond with a JSON object containing the IDs of the selected items, with keys like "top", "bottom", etc. Example: {"top": "some-id", "bottom": "another-id"}.
        `;

        const response = await model.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        const outfitIds = JSON.parse(response.text);
        const newOutfit: Outfit = {};
        
        for (const category in outfitIds) {
            const item = wardrobe.find(i => i.id === outfitIds[category]);
            if (item) {
                newOutfit[category as keyof Outfit] = item;
            }
        }
        setOutfit(newOutfit);

    } catch (error) {
        console.error("Error generating outfit:", error);
        alert("Sorry, I couldn't generate an outfit right now. Please try again.");
    } finally {
        setLoading(null);
    }
  }, [wardrobe, weather, model]);

  const fetchTips = useCallback(async () => {
    setLoadingTips(true);
    try {
        const month = new Date().getMonth(); 
        let season = "general";
        if (month < 2 || month === 11) season = "winter";
        else if (month < 5) season = "spring";
        else if (month < 8) season = "summer";
        else season = "autumn";
        
        const prompt = `
            You are "ClosetMuse", a fun and friendly virtual fashion advisor.
            Provide 3 short, actionable, and inspiring fashion tips or trends.
            The tips should be suitable for the current season: ${season}.
            Keep them concise and easy to read.
            Format the response as a JSON object with a single key "tips" which is an array of strings.
            Example: {"tips": ["Tip 1...", "Tip 2...", "Tip 3..."]}
        `;
        
        const response = await model.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const result = JSON.parse(response.text);
        if (result.tips && Array.isArray(result.tips)) {
            setTips(result.tips);
        }

    } catch (error) {
        console.error("Error fetching tips:", error);
        setTips(["Embrace your unique style! Confidence is the best outfit you can wear."]); // Fallback tip
    } finally {
        setLoadingTips(false);
    }
  }, [model]);

  // Generate initial outfit when wardrobe or weather changes
  useEffect(() => {
    if(wardrobe.length > 2 && weather && !outfit) {
        generateOutfit();
    }
  }, [wardrobe, weather, outfit, generateOutfit]);

  // Fetch tips when navigating to the screen for the first time
  useEffect(() => {
    if (screen === 'tips' && tips.length === 0) {
        fetchTips();
    }
  }, [screen, tips, fetchTips]);

  const handleUpdateItem = (updatedItem: ClothingItem) => {
    setWardrobe(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    setEditingItem(null);
  };
  
  const handleDeleteItem = (itemId: string) => {
    setWardrobe(prev => prev.filter(item => item.id !== itemId));
    setEditingItem(null);
  };

  return (
    <div className="app-container">
      <Style />
      {loading && <LoadingOverlay message={loading} />}
      {editingItem && <EditItemModal item={editingItem} onClose={() => setEditingItem(null)} onUpdate={handleUpdateItem} onDelete={handleDeleteItem} />}
      <header className="header">
        <h1>ClosetMuse</h1>
        <div className="theme-switch" onClick={toggleTheme}>
          <span className="material-symbols-outlined">
            {theme === 'light' ? 'dark_mode' : 'light_mode'}
          </span>
        </div>
      </header>
      
      <main className="main-content">
        {screen === 'home' && <HomeScreen weather={weather} outfit={outfit} onGenerateOutfit={generateOutfit} loadingOutfit={!!loading}/>}
        {screen === 'wardrobe' && <WardrobeScreen wardrobe={wardrobe} onItemClick={setEditingItem} />}
        {screen === 'upload' && <UploadScreen onUpload={analyzeAndAddClothing} />}
        {screen === 'tips' && <TipsScreen tips={tips} onGenerate={fetchTips} loading={loadingTips} />}
      </main>

      <nav className="bottom-nav">
        <button className={`nav-item ${screen === 'home' ? 'active' : ''}`} onClick={() => setScreen('home')}>
          <span className="material-symbols-outlined">home</span>
          <span>Home</span>
        </button>
        <button className={`nav-item ${screen === 'upload' ? 'active' : ''}`} onClick={() => setScreen('upload')}>
          <span className="material-symbols-outlined">add_a_photo</span>
          <span>Upload</span>
        </button>
        <button className={`nav-item ${screen === 'wardrobe' ? 'active' : ''}`} onClick={() => setScreen('wardrobe')}>
          <span className="material-symbols-outlined">checkroom</span>
          <span>Wardrobe</span>
        </button>
        <button className={`nav-item ${screen === 'tips' ? 'active' : ''}`} onClick={() => setScreen('tips')}>
          <span className="material-symbols-outlined">lightbulb</span>
          <span>Tips</span>
        </button>
      </nav>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);