'use client';
import { useState, useEffect } from 'react';

export interface HourlyWeather {
  temp: number;
  code: number;
  wind: number;
}

type WeatherMap = Record<string, HourlyWeather>;

export function getWeatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 57) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 86) return '❄️';
  return '⛈️';
}

export function getWeatherDesc(code: number): string {
  if (code === 0) return 'Despejado';
  if (code <= 3) return 'Parcial';
  if (code <= 48) return 'Neblina';
  if (code <= 57) return 'Llovizna';
  if (code <= 67) return 'Lluvia';
  if (code <= 77) return 'Nieve';
  if (code <= 82) return 'Lluvioso';
  if (code <= 86) return 'Nevada';
  return 'Tormenta';
}

export function useWeather() {
  const [weatherMap, setWeatherMap] = useState<WeatherMap>({});
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    const cached = sessionStorage.getItem('uct-weather');
    const cachedAt = sessionStorage.getItem('uct-weather-at');
    const now = Date.now();
    if (cached && cachedAt && now - parseInt(cachedAt) < 30 * 60 * 1000) {
      try {
        setWeatherMap(JSON.parse(cached));
        setWeatherLoading(false);
        return;
      } catch {}
    }

    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=-54.8019&longitude=-68.3029&hourly=temperature_2m,weathercode,windspeed_10m&timezone=America%2FArgentina%2FUshuaia&forecast_days=7'
    )
      .then(r => r.json())
      .then(data => {
        const map: WeatherMap = {};
        const times: string[] = data.hourly?.time ?? [];
        const temps: number[] = data.hourly?.temperature_2m ?? [];
        const codes: number[] = data.hourly?.weathercode ?? [];
        const winds: number[] = data.hourly?.windspeed_10m ?? [];
        times.forEach((t, i) => {
          map[t] = {
            temp: Math.round(temps[i] ?? 0),
            code: codes[i] ?? 0,
            wind: Math.round(winds[i] ?? 0),
          };
        });
        setWeatherMap(map);
        sessionStorage.setItem('uct-weather', JSON.stringify(map));
        sessionStorage.setItem('uct-weather-at', String(Date.now()));
        setWeatherLoading(false);
      })
      .catch(() => setWeatherLoading(false));
  }, []);

  const getWeather = (date: string, hour: number): HourlyWeather | null => {
    const key = `${date}T${String(hour).padStart(2, '0')}:00`;
    return weatherMap[key] ?? null;
  };

  const getDayWeather = (date: string): HourlyWeather | null => {
    return getWeather(date, 12);
  };

  return { getWeather, getDayWeather, weatherLoading };
}
