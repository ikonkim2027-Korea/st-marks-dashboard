"use client";

import { WidgetShell } from "./widget-shell";

export function BlankWidget() {
  return (
    <WidgetShell title="Coming Soon" eyebrow="PLACEHOLDER" accent="gold">
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="label-micro mb-2">Reserved</p>
          <p className="text-[13px] font-medium text-sm-text-muted">
            Coming soon
          </p>
        </div>
      </div>
    </WidgetShell>
  );
}
