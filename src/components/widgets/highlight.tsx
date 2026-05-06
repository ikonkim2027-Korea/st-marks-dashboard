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
    <WidgetShell
      title="Highlight"
      eyebrow="DAILY"
      accent="gold"
      bodyClassName="pb-3 sm:pb-4"
      scrollable={false}
    >
      <div className="grid h-full min-h-0 grid-rows-[auto_1fr] gap-3">
        <section className="rounded-[8px] border border-sm-gold/20 bg-sm-cream/45 px-3 py-3">
          <div className="mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-sm-gold" aria-hidden="true" />
            <span className="label-micro text-sm-gold">Word of the Day</span>
          </div>
          <div className="mb-1 flex items-baseline gap-2">
            <h4 className="text-[22px] font-bold leading-none tracking-tight text-sm-text">
              {word.word}
            </h4>
            <span className="text-[11px] italic text-sm-text-muted">
              {word.pos}
            </span>
          </div>
          <p className="mb-1.5 text-[13px] leading-snug text-sm-text">
            {word.definition}
          </p>
          <p className="text-[11px] italic leading-snug text-sm-text-muted">
            “{word.example}”
          </p>
        </section>

        <section className="flex min-h-0 flex-col rounded-[8px] border border-sm-navy/10 px-3 py-3">
          <div className="mb-3 flex items-center gap-1.5">
            <Quote className="h-3.5 w-3.5 text-sm-navy" aria-hidden="true" />
            <span className="label-micro">Daily Quote</span>
          </div>
          <blockquote className="flex min-h-0 flex-1 flex-col justify-between gap-3">
            <p className="text-[15px] font-medium leading-relaxed text-sm-text">
              {quote.text}
            </p>
            <footer className="text-[10px] uppercase tracking-[0.15em] text-sm-text-muted">
              — {quote.by}
            </footer>
          </blockquote>
        </section>
      </div>
    </WidgetShell>
  );
}
