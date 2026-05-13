import { HeroSection } from "@/components/HeroSection";
import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <SiteHeader active="home" />
      <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:py-16">
        <HeroSection />
      </div>
    </main>
  );
}
