"use client";

import { BlockMath } from "react-katex";

type LatexPreviewProps = {
  latex: string;
  placeholder?: string;
};

export function LatexPreview({ latex, placeholder }: LatexPreviewProps) {
  const value = latex.trim();

  if (!value) {
    return (
      <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-stone-200 bg-white px-4 text-sm text-stone-400">
        {placeholder ?? "The render will appear here."}
      </div>
    );
  }

  return (
    <div className="flex min-h-28 items-center justify-center overflow-x-auto rounded-xl border border-dashed border-stone-200 bg-white px-4 py-6 text-stone-950">
      <BlockMath
        math={value}
        errorColor="#b42318"
      />
    </div>
  );
}
