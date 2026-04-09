export interface LunchMenuItem {
  name: string;
  description?: string;
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
}

export interface LunchMenu {
  date: string;
  diningHall: {
    breakfast?: LunchMenuItem[];
    lunch: LunchMenuItem[];
    dinner?: LunchMenuItem[];
  };
  lionsDen?: LunchMenuItem[];
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  high: number;
  low: number;
  precipChance: number;
}

export interface AthleticsEvent {
  id: string;
  sport: string;
  opponent: string;
  date: string;
  time: string;
  location: "home" | "away";
  venue?: string;
  result?: {
    smScore: number;
    opponentScore: number;
    won: boolean;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  imageUrl?: string;
  link: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  category: "academic" | "athletics" | "arts" | "community" | "break";
}

export interface QuickLink {
  name: string;
  url: string;
  icon: string;
  description: string;
  category: "academic" | "campus" | "resources" | "social";
}

export interface SocialAccount {
  platform: string;
  url: string;
  handle: string;
}
