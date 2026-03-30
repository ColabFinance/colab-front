"use client";

type Props = {
  title: string;
};

export default function TradePlaceholderPage({ title }: Props) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <p className="mt-2 text-sm text-slate-400">This page is ready for the next trade module step.</p>
    </div>
  );
}