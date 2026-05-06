"use client";

import { Quote, Sparkles } from "lucide-react";
import { useNow } from "@/lib/now";
import { WidgetShell } from "./widget-shell";

interface QuoteEntry {
  text: string;
  by: string;
}

interface WordEntry {
  word: string;
  pos: string;
  definition: string;
  example: string;
}

const QUOTES: QuoteEntry[] = [
  { text: "The future depends on what you do today.", by: "Mahatma Gandhi" },
  { text: "Education is the most powerful weapon which you can use to change the world.", by: "Nelson Mandela" },
  { text: "It always seems impossible until it’s done.", by: "Nelson Mandela" },
  { text: "Strive not to be a success, but rather to be of value.", by: "Albert Einstein" },
  { text: "What we plant in the soil of contemplation, we shall reap in the harvest of action.", by: "Meister Eckhart" },
  { text: "Be the change that you wish to see in the world.", by: "Mahatma Gandhi" },
  { text: "An investment in knowledge pays the best interest.", by: "Benjamin Franklin" },
  { text: "Quality is not an act, it is a habit.", by: "Aristotle" },
  { text: "Discipline is the bridge between goals and accomplishment.", by: "Jim Rohn" },
  { text: "I have not failed. I’ve just found 10,000 ways that won’t work.", by: "Thomas Edison" },
  { text: "The only way to do great work is to love what you do.", by: "Steve Jobs" },
  { text: "Knowing yourself is the beginning of all wisdom.", by: "Aristotle" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", by: "Will Durant" },
  { text: "Do what you can, with what you have, where you are.", by: "Theodore Roosevelt" },
  { text: "Stay hungry, stay foolish.", by: "Whole Earth Catalog" },
];

const WORDS: WordEntry[] = [
  { word: "Ephemeral", pos: "adj.", definition: "lasting for a very short time", example: "the ephemeral nature of social media trends" },
  { word: "Ubiquitous", pos: "adj.", definition: "present, appearing, or found everywhere", example: "smartphones have become ubiquitous" },
  { word: "Sycophant", pos: "n.", definition: "a person who praises powerful people in order to gain favor", example: "he was surrounded by sycophants" },
  { word: "Pragmatic", pos: "adj.", definition: "dealing with things sensibly and realistically", example: "a pragmatic approach to the problem" },
  { word: "Quixotic", pos: "adj.", definition: "extremely idealistic; unrealistic and impractical", example: "a quixotic vision of perfect democracy" },
  { word: "Laconic", pos: "adj.", definition: "using very few words", example: "his laconic reply suggested indifference" },
  { word: "Esoteric", pos: "adj.", definition: "intended for or understood by only a small group", example: "esoteric philosophical theories" },
  { word: "Prolific", pos: "adj.", definition: "producing much fruit, foliage, or many offspring", example: "a prolific author of mystery novels" },
  { word: "Tenacious", pos: "adj.", definition: "tending to keep a firm hold; persistent", example: "tenacious in pursuit of her goals" },
  { word: "Ambivalent", pos: "adj.", definition: "having mixed feelings about something", example: "she was ambivalent about the decision" },
  { word: "Cogent", pos: "adj.", definition: "clear, logical, and convincing", example: "a cogent argument for reform" },
  { word: "Perfunctory", pos: "adj.", definition: "done with minimum effort or reflection", example: "a perfunctory greeting" },
  { word: "Magnanimous", pos: "adj.", definition: "generous or forgiving toward a rival or less powerful person", example: "a magnanimous gesture" },
  { word: "Surreptitious", pos: "adj.", definition: "kept secret, especially because not socially acceptable", example: "a surreptitious glance at his watch" },
  { word: "Vicarious", pos: "adj.", definition: "experienced in the imagination through the actions of another person", example: "vicarious pleasure from his success" },
];

function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function HighlightWidget() {
  const now = useNow(60_000 * 60);

  if (!now) {
    return (
      <WidgetShell title="Highlight" eyebrow="WORD &amp; QUOTE" accent="gold">
        <div role="status" aria-label="Loading highlight" className="space-y-2">
          <div className="h-4 w-1/3 animate-pulse rounded bg-sm-cream" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-sm-cream" />
        </div>
      </WidgetShell>
    );
  }

  const idx = dayOfYear(now);
  const quote = QUOTES[idx % QUOTES.length];
  const word = WORDS[idx % WORDS.length];

  return (
    <WidgetShell title="Highlight" eyebrow="DAILY" accent="gold">
      <div className="flex h-full flex-col">
        <div className="mb-4 pb-4 border-b border-sm-border/60">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="h-3 w-3 text-sm-gold" aria-hidden="true" />
            <span className="label-micro text-sm-gold">Word of the Day</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <h4 className="text-lg font-bold text-sm-text tracking-tight">
              {word.word}
            </h4>
            <span className="text-[10px] italic text-sm-text-muted">
              {word.pos}
            </span>
          </div>
          <p className="text-[12px] text-sm-text leading-snug mb-1.5">
            {word.definition}
          </p>
          <p className="text-[10px] text-sm-text-muted italic leading-snug">
            “{word.example}”
          </p>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-1.5 mb-2">
            <Quote className="h-3 w-3 text-sm-navy" aria-hidden="true" />
            <span className="label-micro">Daily Quote</span>
          </div>
          <blockquote className="flex-1 flex flex-col justify-center">
            <p className="text-[13px] font-medium text-sm-text leading-relaxed mb-2">
              {quote.text}
            </p>
            <footer className="text-[10px] text-sm-text-muted tracking-[0.15em] uppercase">
              — {quote.by}
            </footer>
          </blockquote>
        </div>
      </div>
    </WidgetShell>
  );
}
