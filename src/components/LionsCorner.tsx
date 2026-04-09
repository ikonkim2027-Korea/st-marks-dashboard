"use client";

import { useEffect, useState } from "react";
import { Sparkles, Flame, BookOpen } from "lucide-react";

const quotes = [
  {
    text: "Age Quod Agis — Do What You Do",
    source: "School Motto",
  },
  {
    text: "Education is not the filling of a pail, but the lighting of a fire.",
    source: "W.B. Yeats",
  },
  {
    text: "The only way to do great work is to love what you do.",
    source: "Steve Jobs",
  },
  {
    text: "In learning you will teach, and in teaching you will learn.",
    source: "Phil Collins",
  },
  {
    text: "The roots of education are bitter, but the fruit is sweet.",
    source: "Aristotle",
  },
];

const traditions = [
  "🦁 The Winged Lion has been our mascot since the school's founding in 1865.",
  "🏈 Our rivalry with Groton is one of the oldest in the nation — since 1886!",
  "🎭 The Black Box Theater hosts incredible student productions each season.",
  "🏆 SM Lions have won the Burnett-Peabody Bowl 13 of the last 16 years.",
  "🎵 The Cutler Jazz Festival is a beloved annual tradition at PFAC.",
  "🎬 Our campus starred as Barton Academy in 'The Holdovers' (2023).",
];

export default function LionsCorner() {
  const [quote, setQuote] = useState(quotes[0]);
  const [tradition, setTradition] = useState(traditions[0]);

  useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000
    );
    setQuote(quotes[dayOfYear % quotes.length]);
    setTradition(traditions[dayOfYear % traditions.length]);
  }, []);

  return (
    <div className="widget-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-sm-gold" />
        <h3 className="text-xs font-semibold text-sm-text-light uppercase tracking-wider">
          Lion&apos;s Corner
        </h3>
      </div>

      {/* Quote of the day */}
      <div className="rounded-xl bg-sm-navy/5 p-4 mb-3">
        <div className="flex items-start gap-2">
          <BookOpen className="h-4 w-4 text-sm-navy mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm italic text-sm-text leading-relaxed">
              &ldquo;{quote.text}&rdquo;
            </p>
            <p className="text-xs text-sm-text-muted mt-1.5">— {quote.source}</p>
          </div>
        </div>
      </div>

      {/* Did you know */}
      <div className="rounded-xl bg-sm-gold/5 p-4">
        <div className="flex items-start gap-2">
          <Flame className="h-4 w-4 text-sm-gold mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-sm-gold mb-1">Did You Know?</p>
            <p className="text-sm text-sm-text leading-relaxed">
              {tradition}
            </p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-sm-cream/50 p-2.5 text-center">
          <p className="text-lg font-bold text-sm-navy">1865</p>
          <p className="text-[10px] text-sm-text-muted">Founded</p>
        </div>
        <div className="rounded-lg bg-sm-cream/50 p-2.5 text-center">
          <p className="text-lg font-bold text-sm-navy">377</p>
          <p className="text-[10px] text-sm-text-muted">Students</p>
        </div>
        <div className="rounded-lg bg-sm-cream/50 p-2.5 text-center">
          <p className="text-lg font-bold text-sm-navy">210</p>
          <p className="text-[10px] text-sm-text-muted">Acres</p>
        </div>
      </div>
    </div>
  );
}
