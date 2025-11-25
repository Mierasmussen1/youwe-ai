import { useState } from "react";
import logo from "../Youwe_logo_HVID.png";

const modules = [
  {
    id: "potentiale",
    title: "Spot AI-potentiale i processer",
    intro:
      "Kortlæg egne flows, find automationsmuligheder og vurder data- og risikoprofilen, før vi sætter udvikling i gang.",
    bullets: [
      "Framework til at spotte use cases i vores egne processer",
      "Datakvalitet, risiko og compliance-tjekliste",
      "Roadmaps med quick wins og klar governance",
    ],
    cta: "Åbn modul",
  },
  {
    id: "api",
    title: "API-integrationer \u2013 intro & hands-on",
    intro:
      "Opsæt sikre integrationer til AI-tjenester, lav prompt flows og lær at teste, monitorere og versionere sammen.",
    bullets: [
      "Arkitekturvalg, patterns og gode vaner",
      "Hands-on API-kald, keys, logging og test",
      "Human-in-the-loop og drift af assistenter",
    ],
    cta: "Åbn modul",
  },
  {
    id: "analyse",
    title: "AI til dataanalyse og visualisering",
    intro:
      "Kombinér vores BI-setup med generativ AI, så teams kan få svar i realtid, skabe rapporter og simulere scenarier.",
    bullets: [
      "LLM koblet til datakilder med adgangsstyring",
      "Sikre prompt flows med kildereferencer og traceability",
      "Visualisering, storytelling og beslutningsstøtte",
    ],
    cta: "Åbn modul",
  },
];

export default function App() {
  const [active, setActive] = useState("potentiale");
  const activeModule = modules.find((m) => m.id === active);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1024] via-[#121b34] to-black text-[#eee] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-12 h-80 w-80 rounded-full bg-[#4fd79d]/18 blur-3xl" />
        <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-[#1c2448]/45 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/50" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <header className="flex items-center justify-between py-8">
          <div className="shrink-0">
            <img src={logo} alt="YouWe AI" className="h-9 w-auto drop-shadow" />
          </div>
          <nav className="flex items-center gap-6 text-sm text-slate-200">
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActive(mod.id)}
                className={`transition-colors ${
                  active === mod.id ? "text-[#4fd79d]" : "hover:text-white"
                }`}
              >
                {mod.title.split(" \u2013")[0]}
              </button>
            ))}
          </nav>
        </header>

        <main>
          <section className="py-6 md:py-12">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.15em] text-[#4fd79d]">
              Intern læring & enablement
              <span className="h-1 w-1 rounded-full bg-[#4fd79d]" />
              Moderne AI i praksis
            </p>
            <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
              <div>
                <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl md:text-6xl text-white">
                  Fælles læring, så vi kan bygge ansvarlig AI sammen.
                </h1>
                <p className="mt-5 text-lg text-slate-200 max-w-2xl leading-relaxed">
                  Et internt forløb på tre moduler for kolleger på tværs af forretning, tech og data. Målet er, at vi
                  selv kan finde potentiale, bygge sikre integrationer og levere indsigt med AI – uden salg eller hype,
                  men med governance og konkrete værktøjer.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={() => setActive("potentiale")}
                    className="inline-flex items-center justify-center rounded-full bg-[#4fd79d] px-6 py-3 text-slate-950 text-sm font-semibold shadow-xl shadow-[rgba(79,215,157,0.35)] hover:-translate-y-0.5 transition"
                  >
                    Start med potentiale
                  </button>
                  <button
                    onClick={() => setActive("analyse")}
                    className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5 transition"
                  >
                    Hop til data & visualisering
                  </button>
                </div>
                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { label: "Varighed pr. modul", value: "1-2 dage" },
                    { label: "Format", value: "Workshop + hands-on" },
                    { label: "Deltagere", value: "Forretning, tech, data" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-black/30"
                    >
                      <div className="text-xs uppercase tracking-[0.18em] text-[#4fd79d]">{item.label}</div>
                      <div className="mt-3 text-2xl font-semibold text-white">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-black/30 p-6 shadow-2xl shadow-[rgba(79,215,157,0.25)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#4fd79d]">Aktivt modul</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{activeModule.title}</h3>
                  </div>
                  <span className="rounded-full bg-[#4fd79d] px-3 py-1 text-xs font-semibold text-slate-950">
                    Fokus
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-200 leading-relaxed">{activeModule.intro}</p>
                <div className="mt-5 space-y-4 text-sm text-slate-200">
                  {activeModule.bullets.map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#4fd79d]" />
                      <p>{point}</p>
                    </div>
                  ))}
                </div>
                <button className="mt-6 inline-flex items-center justify-center rounded-full bg-[#4fd79d] px-5 py-3 text-slate-950 text-sm font-semibold shadow-xl shadow-[rgba(79,215,157,0.35)] hover:-translate-y-0.5 transition">
                  {activeModule.cta}
                </button>
              </div>
            </div>
          </section>

          <section className="py-14 border-t border-white/5">
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#4fd79d]">Moduler</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Vælg modulet der passer holdet</h2>
              </div>
              <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 bg-white/5">
                Tag ét ad gangen eller som samlet forløb
              </span>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {modules.map((mod) => (
                <div
                  key={mod.id}
                  className={`rounded-2xl border p-6 shadow-lg shadow-black/30 transition hover:-translate-y-1 ${
                    active === mod.id
                      ? "border-[#4fd79d]/70 bg-white/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">{mod.title}</h3>
                    <span className="text-xs uppercase tracking-[0.18em] text-[#4fd79d]">
                      {mod.id === "api" ? "Hands-on" : "Rammeværk"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">{mod.intro}</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-200">
                    {mod.bullets.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#4fd79d]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-center justify-between">
                    <button
                      onClick={() => setActive(mod.id)}
                      className="text-sm font-semibold text-[#4fd79d] hover:text-white transition"
                    >
                      Åbn modul
                    </button>
                    <span className="text-xs text-slate-400">1-2 dage</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="kontakt" className="py-14 border-t border-white/5">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#1c2448]/60 via-[#0b1024]/70 to-black/50 p-8 shadow-2xl shadow-[rgba(79,215,157,0.25)]">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#4fd79d]">Koordinering</p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">Planlæg forløbet internt</h2>
                  <p className="mt-3 text-sm text-slate-200 leading-relaxed">
                    Brug formularen til at samle deltagere og cases fra vores egen drift. Vi forbereder agenda og materialer,
                    så vi får mest ud af sessionerne.
                  </p>
                </div>
                <div className="flex flex-col gap-3 w-full max-w-sm">
                  <input
                    type="text"
                    placeholder="Team / afdeling"
                    className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-[#4fd79d] focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Kontaktmail"
                    className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-[#4fd79d] focus:outline-none"
                  />
                  <textarea
                    placeholder="Hvilke processer eller cases skal vi arbejde med?"
                    rows={3}
                    className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-[#4fd79d] focus:outline-none"
                  />
                  <button className="mt-1 inline-flex items-center justify-center rounded-full bg-[#4fd79d] px-6 py-3 text-slate-950 text-sm font-semibold shadow-xl shadow-[rgba(79,215,157,0.35)] hover:-translate-y-0.5 transition">
                    Send intern anmodning
                  </button>
                  <p className="text-xs text-slate-400">
                    Vi vender tilbage med agenda og forslag til fordeling af tid mellem modulerne.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="py-10 border-t border-white/5 text-sm text-slate-400">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-white font-semibold">YouWe AI</p>
            <p>Intern læring og enablement i ansvarlig AI.</p>
            <div className="flex gap-4 text-slate-300">
              {modules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => setActive(mod.id)}
                  className="hover:text-[#4fd79d] transition-colors"
                >
                  {mod.title.split(" \u2013")[0]}
                </button>
              ))}
              <a href="#kontakt" className="hover:text-[#4fd79d] transition-colors">
                Koordinering
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
