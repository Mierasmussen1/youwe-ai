import { useEffect, useMemo, useState } from "react";
import logo from "../Youwe_logo_HVID.png";

const backendUrl = "http://localhost:4000/api";

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
    title: "API-integrationer – intro & hands-on",
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

const sampleProjects = [
  { name: "Nordic Commerce Revamp", budget: 1400000, actual: 620000, forecast: 1250000, marginPct: 22 },
  { name: "Mobile Loyalty 2.0", budget: 950000, actual: 430000, forecast: 880000, marginPct: 18 },
  { name: "Data Platform Clean-up", budget: 760000, actual: 520000, forecast: 720000, marginPct: 27 },
  { name: "B2B Portal Upgrade", budget: 520000, actual: 310000, forecast: 495000, marginPct: 16 },
  { name: "AI Content Ops", budget: 430000, actual: 290000, forecast: 420000, marginPct: 31 },
];

const sum = (arr) => arr.reduce((total, value) => total + (Number(value) || 0), 0);
const formatCurrency = (value) =>
  value.toLocaleString("da-DK", { style: "currency", currency: "DKK", maximumFractionDigits: 0 });
const formatPct = (value) => `${Math.round(value)}%`;

const ChartBar = ({ label, budget, actual, forecast }) => {
  const max = Math.max(budget, actual, forecast, 1);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-200">{label}</span>
        <span className="text-slate-400">
          {formatCurrency(actual)} / {formatCurrency(budget)}
        </span>
      </div>
      <div className="h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
        <div className="h-full bg-[#4fd79d]/80" style={{ width: `${Math.min((actual / max) * 100, 100)}%` }} />
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full bg-[#1c9d74]" style={{ width: `${Math.min((forecast / max) * 100, 100)}%` }} />
      </div>
    </div>
  );
};

const MarginBar = ({ label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-32 text-sm text-slate-200">{label}</div>
    <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
      <div
        className={`h-full ${value >= 25 ? "bg-[#4fd79d]" : value >= 15 ? "bg-amber-300" : "bg-rose-400"}`}
        style={{ width: `${Math.min(value, 45)}%` }}
      />
    </div>
    <div className="w-12 text-right text-sm text-slate-200">{formatPct(value)}</div>
  </div>
);

export default function App() {
  const [active, setActive] = useState("potentiale");
  const [view, setView] = useState("home");
  const [projects, setProjects] = useState(sampleProjects);
  const [auth, setAuth] = useState({ token: "", status: "loggedOut", message: "" });
  const [uploadState, setUploadState] = useState({ isLoading: false, message: "" });
  const [loginForm, setLoginForm] = useState({ username: "admin@youwe.ai", password: "Adm1n!23" });

  const totals = useMemo(() => {
    const totalBudget = sum(projects.map((p) => p.budget));
    const totalActual = sum(projects.map((p) => p.actual));
    const totalForecast = sum(projects.map((p) => p.forecast));
    const avgMargin = projects.length ? sum(projects.map((p) => p.marginPct)) / projects.length : 0;
    return { totalBudget, totalActual, totalForecast, avgMargin };
  }, [projects]);

  useEffect(() => {
    if (!auth.token) return;
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${backendUrl}/projects`, { headers: { Authorization: `Bearer ${auth.token}` } });
        if (!res.ok) throw new Error("Kunne ikke hente data");
        const data = await res.json();
        setProjects(data.projects || sampleProjects);
      } catch (err) {
        setAuth((prev) => ({ ...prev, message: "Fejl ved hentning af data fra backend" }));
      }
    };
    fetchProjects();
  }, [auth.token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuth((prev) => ({ ...prev, status: "loading", message: "" }));
    try {
      const res = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      if (!res.ok) throw new Error("Forkert login");
      const data = await res.json();
      setAuth({ token: data.token, status: "loggedIn", message: "Logget ind" });
    } catch (err) {
      setAuth({ token: "", status: "error", message: "Login fejlede. Brug admin@youwe.ai / Adm1n!23" });
    }
  };

  const handleUpload = async (file) => {
    setUploadState({ isLoading: true, message: "" });
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${backendUrl}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${auth.token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Upload fejlede");
      const data = await res.json();
      setProjects(data.projects || projects);
      setUploadState({ isLoading: false, message: "Data opdateret fra Excel" });
    } catch (err) {
      setUploadState({ isLoading: false, message: "Kunne ikke uploade fil. Tjek login og format." });
    }
  };

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
            <button
              onClick={() => setView("home")}
              className={`transition-colors ${view === "home" ? "text-[#4fd79d]" : "hover:text-white"}`}
            >
              Læringsforløb
            </button>
            <button
              onClick={() => setView("dashboard")}
              className={`transition-colors ${view === "dashboard" ? "text-[#4fd79d]" : "hover:text-white"}`}
            >
              Dashboard
            </button>
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActive(mod.id)}
                className={`transition-colors ${active === mod.id ? "text-[#4fd79d]" : "hover:text-white"}`}
              >
                {mod.title.split(" –")[0]}
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
                  Et internt forløb på tre moduler for kolleger på tværs af forretning, tech og data. Målet er, at vi selv
                  kan finde potentiale, bygge sikre integrationer og levere indsigt med AI – uden salg eller hype, men med
                  governance og konkrete værktøjer.
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
                  <span className="rounded-full bg-[#4fd79d] px-3 py-1 text-xs font-semibold text-slate-950">Fokus</span>
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

          {view === "home" && (
            <>
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
                        active === mod.id ? "border-[#4fd79d]/70 bg-white/10" : "border-white/10 bg-white/5"
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
            </>
          )}

          {view === "dashboard" && (
            <section className="py-14 border-t border-white/5">
              <div className="flex flex-wrap items-start gap-6 justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#4fd79d]">Projektøkonomi</p>
                  <h2 className="mt-2 text-4xl font-semibold text-white">Dashboard for projektøkonomi</h2>
                  <p className="mt-3 text-sm text-slate-300 max-w-2xl">
                    Log ind for at uploade Excel og opdatere graferne. Eksempelfilen kan downloades nederst.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                  Data: Budget, forbrug, forecast og margin % pr. projekt
                </div>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {[
                  { label: "Budget (sum)", value: formatCurrency(totals.totalBudget) },
                  { label: "Forbrug (sum)", value: formatCurrency(totals.totalActual) },
                  { label: "Forecast", value: formatCurrency(totals.totalForecast) },
                  { label: "Gns. margin", value: formatPct(totals.avgMargin || 0) },
                  {
                    label: "Leveret (%)",
                    value: formatPct(
                      totals.totalBudget ? Math.min((totals.totalActual / totals.totalBudget) * 100, 150) : 0
                    ),
                  },
                  { label: "Projekter", value: projects.length },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-black/30 p-5 shadow-inner shadow-black/30"
                  >
                    <div className="text-xs uppercase tracking-[0.16em] text-[#4fd79d]">{card.label}</div>
                    <div className="mt-3 text-2xl font-semibold text-white">{card.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Budget vs. forbrug pr. projekt</h3>
                    <span className="text-xs text-slate-400">Actual (grøn), Forecast (mørk grøn)</span>
                  </div>
                  <div className="mt-5 space-y-4">
                    {projects.map((p) => (
                      <ChartBar key={p.name} label={p.name} budget={p.budget} actual={p.actual} forecast={p.forecast} />
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-white">Margin pr. projekt</h3>
                      <span className="text-xs text-slate-400">Rød: under 15%, Gul: 15-25%, Grøn: 25%+</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {projects.map((p) => (
                        <MarginBar key={p.name} label={p.name} value={p.marginPct || 0} />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#1c2448]/80 via-[#0b1024] to-black p-6 shadow-lg shadow-black/30">
                    <h3 className="text-xl font-semibold text-white">Upload & login</h3>
                    <form className="mt-4 space-y-3" onSubmit={handleLogin}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          value={loginForm.username}
                          onChange={(e) => setLoginForm((f) => ({ ...f, username: e.target.value }))}
                          placeholder="Brugernavn (admin@youwe.ai)"
                          className="rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-[#4fd79d] focus:outline-none"
                        />
                        <input
                          type="password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                          placeholder="Kode (Adm1n!23)"
                          className="rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-[#4fd79d] focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center rounded-full bg-[#4fd79d] px-4 py-2 text-slate-950 text-sm font-semibold shadow-lg shadow-[rgba(79,215,157,0.35)] hover:-translate-y-0.5 transition disabled:opacity-70"
                          disabled={auth.status === "loading"}
                        >
                          {auth.status === "loading" ? "Logger ind..." : auth.token ? "Gen-udsted token" : "Log ind"}
                        </button>
                        <span className="text-sm text-slate-300">Status: {auth.token ? "Logget ind" : "Ikke logget ind"}</span>
                      </div>
                      {auth.message && <p className="text-sm text-slate-300">{auth.message}</p>}
                    </form>

                    <div className="mt-5 border-t border-white/10 pt-4 space-y-3">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm text-slate-200">Upload Excel (.xlsx)</label>
                        <input
                          type="file"
                          accept=".xlsx"
                          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                          className="text-sm text-slate-300"
                          disabled={!auth.token || uploadState.isLoading}
                        />
                        <p className="text-xs text-slate-400">
                          Kræver login. Brug kolonner: Project | Budget | Actual | Forecast | MarginPct
                        </p>
                      </div>
                      {uploadState.message && <p className="text-sm text-slate-200">{uploadState.message}</p>}
                      <div className="flex items-center gap-3">
                        <a
                          href="/sample-budget.xlsx"
                          className="text-sm font-semibold text-[#4fd79d] hover:text-white transition"
                          download
                        >
                          Download eksempelfil
                        </a>
                        <span className="text-xs text-slate-400">Udfyld og upload efter login</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
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
                  {mod.title.split(" –")[0]}
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
