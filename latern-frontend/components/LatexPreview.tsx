"use client";

import { BlockMath } from "react-katex";

type LatexPreviewProps = {
  latex: string;
  placeholder?: string;
  compact?: boolean;
};

export function LatexPreview({ latex, placeholder, compact = false }: LatexPreviewProps) {
  const value = latex.trim();
  const heightClass = compact ? "min-h-20" : "min-h-28";
  const paddingClass = compact ? "px-3 py-4" : "px-4 py-6";

  if (!value) {
    return (
      <div
        className={`flex ${heightClass} items-center justify-center rounded-xl border border-dashed border-stone-200 bg-white px-4 text-sm text-stone-400`}
      >
        {placeholder ?? "The render will appear here."}
      </div>
    );
  }

  return (
    <div
      className={`flex ${heightClass} items-center justify-center overflow-x-auto rounded-xl border border-dashed border-stone-200 bg-white ${paddingClass} text-stone-950`}
    >
      <BlockMath
        math={value}
        errorColor="#b42318"
      />
    </div>
  );
}
