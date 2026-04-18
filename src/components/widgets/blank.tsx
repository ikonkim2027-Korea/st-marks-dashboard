"use client";

import { Sparkles } from "lucide-react";
import { WidgetShell } from "./widget-shell";

export function BlankWidget() {
  return (
    <WidgetShell
      title="Coming Soon"
      eyebrow="PLACEHOLDER"
      accent="gold"
      scrollable={false}
    >
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Sparkles
            className="mx-auto mb-2 h-6 w-6 text-sm-gold/70"
            aria-hidden="true"
          />
          <p className="label-micro mb-1">Reserved</p>
          <p className="text-[13px] font-medium text-sm-text-light">
            A new widget is on its way.
          </p>
        </div>
      </div>
    </WidgetShell>
  );
}
