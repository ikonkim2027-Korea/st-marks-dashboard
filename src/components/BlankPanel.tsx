"use client";

export default function BlankPanel() {
  return (
    <div className="widget-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-5">
        <span className="divider-gold" />
        <span className="label-micro">&nbsp;</span>
      </div>
      <div className="flex-1" />
    </div>
  );
}
