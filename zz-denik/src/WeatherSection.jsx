
import React, { useState, useEffect } from 'react';
import { CloudRain, Wind, Thermometer, Sun, Moon, Sunrise, Sunset, Dice5, Calendar } from 'lucide-react';
import Card from './components/common/Card';
import SectionHeader from './components/common/SectionHeader';
import { SEASONS, SEASON_TYPES, QUARTER_DAYS, TEMPERATURE_SCALE, WEATHER_TABLE, rollD66, rollD6 } from './data/weather_data';

const WeatherSection = () => {
    const [state, setState] = useState({
        season: 'spring_rise', // Default
        quarterDayIndex: 1, // Day
        weatherRoll: null,
        weatherDuration: 0,
        isLoaded: false
    });

    // Load state
    useEffect(() => {
        const saved = localStorage.getItem('fl_weather_state');
        if (saved) {
            try {
                setState({ ...JSON.parse(saved), isLoaded: true });
            } catch (e) {
                console.error("Failed to load weather state", e);
                setState(s => ({ ...s, isLoaded: true }));
            }
        } else {
            setState(s => ({ ...s, isLoaded: true }));
        }
    }, []);

    // Save state
    useEffect(() => {
        if (state.isLoaded) {
            localStorage.setItem('fl_weather_state', JSON.stringify({
                season: state.season,
                quarterDayIndex: state.quarterDayIndex,
                weatherRoll: state.weatherRoll,
                weatherDuration: state.weatherDuration
            }));
        }
    }, [state]);

    const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));

    const rollWeather = () => {
        const roll = rollD66();
        const duration = rollD6();
        updateState({ weatherRoll: roll, weatherDuration: duration });
    };

    const nextQuarterDay = () => {
        const nextIndex = (state.quarterDayIndex + 1) % 4;
        const newDuration = Math.max(0, state.weatherDuration - 1);
        updateState({
            quarterDayIndex: nextIndex,
            weatherDuration: newDuration
        });
    };

    const currentSeason = SEASON_TYPES.find(s => s.id === state.season) || SEASON_TYPES[1];
    const currentQuarterDay = QUARTER_DAYS[state.quarterDayIndex];

    let weatherData = null;
    let currentTempGrade = currentSeason.baseTemp;

    if (state.weatherRoll) {
        weatherData = WEATHER_TABLE[state.weatherRoll] || WEATHER_TABLE[11]; // Fallback
        currentTempGrade += (weatherData.tempMod || 0);
    }

    // Night modifier
    if (currentQuarterDay.isNight) {
        currentTempGrade -= 1;
    }

    // Cap grade between 1 and 6
    currentTempGrade = Math.max(1, Math.min(6, currentTempGrade));
    const tempEffect = TEMPERATURE_SCALE[currentTempGrade];

    if (!state.isLoaded) return null;

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* CONTROLS */}
            <Card>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

                    {/* SEASON SELECTOR */}
                    <div className="flex items-center gap-2 bg-fl-paper-bright p-2 rounded border border-fl-paper">
                        <Calendar size={18} className="text-fl-primary" />
                        <select
                            value={state.season}
                            onChange={(e) => updateState({ season: e.target.value })}
                            className="bg-transparent font-bold text-fl-surface outline-none cursor-pointer"
                        >
                            {SEASON_TYPES.map(s => (
                                <option key={s.id} value={s.id}>{s.label} ({s.desc})</option>
                            ))}
                        </select>
                    </div>

                    {/* QUARTER DAY */}
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded border-2 font-bold uppercase tracking-wider text-sm transition-colors
              ${currentQuarterDay.id === 'day' ? 'bg-yellow-100 border-yellow-300 text-yellow-800' :
                                currentQuarterDay.id === 'night' ? 'bg-indigo-900 border-indigo-700 text-indigo-100' :
                                    'bg-orange-100 border-orange-300 text-orange-800'}`}>
                            {currentQuarterDay.id === 'day' ? <Sun size={18} /> :
                                currentQuarterDay.id === 'night' ? <Moon size={18} /> :
                                    currentQuarterDay.id === 'morning' ? <Sunrise size={18} /> : <Sunset size={18} />}
                            {currentQuarterDay.label}
                        </div>

                        <button
                            onClick={nextQuarterDay}
                            className="bg-fl-surface text-fl-paper px-3 py-2 rounded hover:bg-fl-surface-hover transition-colors font-bold text-xs uppercase"
                        >
                            Další čtvrt-den
                        </button>
                    </div>
                </div>
            </Card>

            {/* WEATHER DISPLAY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* CURRENT WEATHER */}
                <Card className="relative overflow-hidden min-h-[200px] flex flex-col">
                    <SectionHeader title="Aktuální Počasí" icon={CloudRain} />

                    {weatherData ? (
                        <div className="flex-1 flex flex-col justify-center gap-4 mt-2">
                            <div className="flex items-center justify-between border-b border-fl-paper pb-2">
                                <div className="flex items-center gap-3">
                                    <CloudRain className="text-fl-text-muted" size={24} />
                                    <span className="text-xl font-bold text-fl-surface">{weatherData.sky}</span>
                                </div>
                                <span className="text-xs font-bold text-fl-primary uppercase tracking-wider">Obloha</span>
                            </div>

                            <div className="flex items-center justify-between border-b border-fl-paper pb-2">
                                <div className="flex items-center gap-3">
                                    <Wind className="text-fl-text-muted" size={24} />
                                    <span className="text-xl font-bold text-fl-surface">{weatherData.wind}</span>
                                </div>
                                <span className="text-xs font-bold text-fl-primary uppercase tracking-wider">Vítr</span>
                            </div>

                            {/* EFFECTS */}
                            <div className="bg-fl-paper/30 p-3 rounded mt-2">
                                <h4 className="text-[10px] font-bold uppercase text-fl-primary mb-1">Efekty</h4>
                                <ul className="text-sm space-y-1 text-fl-surface-hover">
                                    {weatherData.sky === 'Jasno' && <li>+1 k <strong>ESTABLISH CAMP</strong></li>}
                                    {weatherData.wind === 'Vichřice' && <li>-2 k <strong>MAKE CAMP</strong>, -1 k POHYBU</li>}
                                    {weatherData.wind === 'Bouře' && <li>-2 k <strong>MAKE CAMP</strong>, -2 k POHYBU</li>}
                                    {weatherData.special === 'travel_check' && <li className="text-red-700 font-bold">Všichni: Hod na VÝDRŽ pro cestování!</li>}
                                    {weatherData.special === 'travel_check_hard' && <li className="text-red-700 font-bold">Všichni: Hod na VÝDRŽ (-2) pro cestování!</li>}
                                    {!weatherData.special && weatherData.wind !== 'Vichřice' && weatherData.wind !== 'Bouře' && weatherData.sky !== 'Jasno' && <li className="italic opacity-60">Žádné speciální efekty</li>}
                                </ul>
                            </div>

                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-fl-primary/50 italic">
                            Není vygenerováno počasí
                        </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-fl-primary/20 flex justify-between items-center">
                        <div className="text-xs font-mono text-fl-primary">
                            Trvání: <span className={`font-bold text-lg ${state.weatherDuration <= 1 ? 'text-red-600 animate-pulse' : 'text-fl-surface'}`}>{state.weatherDuration}</span> čtvrt-dní
                        </div>
                        <button
                            onClick={rollWeather}
                            className="flex items-center gap-2 bg-fl-primary text-white px-4 py-2 rounded hover:bg-fl-primary-hover transition-colors font-bold text-sm shadow-md"
                        >
                            <Dice5 size={18} /> Generovat (D66)
                        </button>
                    </div>
                </Card>

                {/* TEMPERATURE */}
                <Card className={`flex flex-col ${currentTempGrade === 1 ? 'border-blue-200 bg-blue-50/50' : currentTempGrade >= 5 ? 'border-red-200 bg-red-50/50' : ''}`}>
                    <SectionHeader title="Teplota" icon={Thermometer} />

                    <div className="flex-1 flex flex-col justify-center items-center py-6">
                        <div className="text-6xl font-bold font-serif mb-2 text-fl-surface">{tempEffect.c}°C</div>
                        <div className="text-xl text-fl-primary font-serif">{tempEffect.label}</div>

                        <div className="mt-6 w-full space-y-2">
                            <div className="flex justify-between text-xs text-fl-text-muted px-4">
                                <span>Stupeň {currentTempGrade}</span>
                                <span className="opacity-50 font-mono">({tempEffect.f}°F)</span>
                            </div>

                            {/* Thermometer Bar */}
                            <div className="h-4 bg-fl-paper rounded-full mx-4 overflow-hidden relative">
                                <div
                                    className={`h-full transition-all duration-500 ${currentTempGrade <= 1 ? 'bg-blue-500' :
                                        currentTempGrade === 2 ? 'bg-blue-300' :
                                            currentTempGrade === 3 ? 'bg-green-400' :
                                                currentTempGrade === 4 ? 'bg-orange-400' :
                                                    'bg-red-500'
                                        }`}
                                    style={{ width: `${(currentTempGrade / 5) * 100}%` }}
                                ></div>
                                {/* Markers */}
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="absolute top-0 bottom-0 w-[1px] bg-white/50" style={{ left: `${(i / 5) * 100}%` }}></div>
                                ))}
                            </div>

                            {tempEffect.effect && (
                                <div className="mt-4 mx-4 p-3 bg-red-100 border border-red-200 rounded text-red-800 text-sm font-bold flex items-center justify-center text-center">
                                    ⚠️ {tempEffect.effect}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-[10px] text-center text-fl-primary/60 mt-2 font-mono">
                        Base: {currentSeason.baseTemp} | Mod: {weatherData?.tempMod || 0} | Night: {currentQuarterDay.isNight ? '-1' : '0'}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default WeatherSection;
