export function HeroSection() {
  return (
    <section className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1fr)] lg:items-center">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 text-sm text-stone-600">
          <span className="rounded-full bg-sky-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
            New
          </span>
          <span>Learn LaTeX math, one symbol at a time.</span>
        </div>

        <div className="max-w-2xl">
          <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-normal text-stone-950 sm:text-6xl">
            Type the math you already know how to read.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-stone-600">
            Latern turns mathematical notation into short practice sessions:
            read a formula, type its LaTeX, see the render instantly, and build
            fluency without digging through documentation.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="/practice"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-700 px-5 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            Start practicing
          </a>
          <a
            href="#domains"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-stone-200 bg-white px-5 text-sm font-medium text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-stone-100"
          >
            Browse domains
          </a>
        </div>

        <dl
          id="domains"
          className="grid max-w-xl grid-cols-3 gap-6 border-t border-stone-200 pt-7 text-sm"
        >
          <div>
            <dt className="font-medium text-stone-950">20+</dt>
            <dd className="mt-2 text-xs leading-5 text-stone-500">
              guided exercises
            </dd>
          </div>
          <div>
            <dt className="font-medium text-stone-950">10</dt>
            <dd className="mt-2 text-xs leading-5 text-stone-500">
              math domains
            </dd>
          </div>
          <div>
            <dt className="font-medium text-stone-950">2 min</dt>
            <dd className="mt-2 text-xs leading-5 text-stone-500">
              average exercise
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_18px_60px_rgba(41,37,36,0.08)] sm:p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="rounded-full bg-stone-100 px-3 py-1 font-medium text-stone-700">
              Logic · 01
            </span>
            <span>Beginner</span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
              Type this in LaTeX
            </p>
            <div className="mt-2 rounded-xl bg-stone-100 px-4 py-8 text-center font-serif text-lg italic">
              ∀p, q ∈ P, p ∧ q ⇒ p
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
              Your LaTeX
            </p>
            <div className="mt-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm text-stone-700">
              \forall p, q \in P, p \land q
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
              Live render
            </p>
            <div className="mt-2 rounded-xl border border-dashed border-stone-200 bg-white px-4 py-8 text-center font-serif text-lg italic">
              ∀p, q ∈ P, p ∧ q
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
