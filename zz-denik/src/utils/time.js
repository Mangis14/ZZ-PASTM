const WEATHER_STORAGE_KEY = 'fl_weather_state';

export const advanceStoredWeatherQuarterDay = (quarterDayIndex) => {
    let stored = {};
    try {
        stored = JSON.parse(localStorage.getItem(WEATHER_STORAGE_KEY) || '{}');
    } catch {
        stored = {};
    }

    const nextWeatherState = {
        season: stored.season || 'spring_rise',
        quarterDayIndex,
        weatherRoll: stored.weatherRoll || null,
        weatherDuration: Math.max(0, (Number(stored.weatherDuration) || 0) - 1)
    };

    localStorage.setItem(WEATHER_STORAGE_KEY, JSON.stringify(nextWeatherState));
    window.dispatchEvent(new CustomEvent('fl:weather-state-updated', { detail: nextWeatherState }));
};
