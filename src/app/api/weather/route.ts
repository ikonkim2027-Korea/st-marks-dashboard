import { NextResponse } from "next/server";

// Southborough, MA coordinates
const LAT = 42.3056;
const LON = -71.5245;

export async function GET() {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  // If no API key, return realistic mock data
  if (!apiKey) {
    return NextResponse.json({
      temp: 58,
      feelsLike: 55,
      description: "partly cloudy",
      icon: "02d",
      humidity: 62,
      windSpeed: 8,
      high: 64,
      low: 45,
    });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${apiKey}&units=imperial`;
    const res = await fetch(url, { next: { revalidate: 600 } }); // cache 10 min
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);

    const data = await res.json();

    return NextResponse.json({
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      high: data.main.temp_max,
      low: data.main.temp_min,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch weather" },
      { status: 500 }
    );
  }
}
