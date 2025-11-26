const express = require("express");
const cors = require("cors");
const multer = require("multer");
const xlsx = require("xlsx");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_DIR = path.join(__dirname, "data");
const UPLOAD_DIR = path.join(__dirname, "uploads");
const DATA_FILE = path.join(DATA_DIR, "projects.json");

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const upload = multer({ dest: UPLOAD_DIR });

const ADMIN_USER = {
  username: "admin@youwe.ai",
  passwordHash: bcrypt.hashSync("Adm1n!23", 10),
};

const activeTokens = new Set();

// Allow local dev origins (fallback to all for simplicity)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const defaultProjects = [
  { name: "Nordic Commerce Revamp", budget: 1400000, actual: 620000, forecast: 1250000, marginPct: 22 },
  { name: "Mobile Loyalty 2.0", budget: 950000, actual: 430000, forecast: 880000, marginPct: 18 },
  { name: "Data Platform Clean-up", budget: 760000, actual: 520000, forecast: 720000, marginPct: 27 },
  { name: "B2B Portal Upgrade", budget: 520000, actual: 310000, forecast: 495000, marginPct: 16 },
  { name: "AI Content Ops", budget: 430000, actual: 290000, forecast: 420000, marginPct: 31 },
];

const sum = (arr) => arr.reduce((total, value) => total + (Number(value) || 0), 0);

const computeTotals = (projects) => {
  const totalBudget = sum(projects.map((p) => p.budget));
  const totalActual = sum(projects.map((p) => p.actual));
  const totalForecast = sum(projects.map((p) => p.forecast));
  const avgMargin = projects.length ? sum(projects.map((p) => p.marginPct)) / projects.length : 0;
  return { totalBudget, totalActual, totalForecast, avgMargin };
};

const loadData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    return { projects: defaultProjects, totals: computeTotals(defaultProjects) };
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    const projects = Array.isArray(parsed.projects) ? parsed.projects : defaultProjects;
    return { projects, totals: computeTotals(projects) };
  } catch (err) {
    return { projects: defaultProjects, totals: computeTotals(defaultProjects) };
  }
};

const saveData = (projects) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ projects, totals: computeTotals(projects) }, null, 2));
};

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "").trim();
  if (!token || !activeTokens.has(token)) {
    return res.status(401).json({ error: "Ikke autoriseret" });
  }
  next();
};

const parseExcel = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

  const projects = rows
    .map((row) => ({
      name: row.Project || row.Projekt || row["Project Name"] || row["Navn"],
      budget: Number(row.Budget || row.BudgetDKK || 0),
      actual: Number(row.Actual || row.Forbrug || row.Spent || 0),
      forecast: Number(row.Forecast || row["Forecast/Budget"] || row["ForecastDKK"] || 0),
      marginPct: Number(row.MarginPct ?? row.Margin ?? row["Margin %"] ?? 0),
    }))
    .filter((p) => p.name);

  return projects;
};

app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  console.log("Login attempt", username);
  if (username !== ADMIN_USER.username) {
    return res.status(401).json({ error: "Forkert bruger" });
  }
  const ok = bcrypt.compareSync(password || "", ADMIN_USER.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Forkert kode" });
  }

  const token = crypto.randomBytes(24).toString("hex");
  activeTokens.add(token);
  res.json({ token, user: { name: "YouWe Admin", username } });
});

app.get("/api/projects", requireAuth, (_req, res) => {
  const data = loadData();
  res.json(data);
});

app.post("/api/upload", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Ingen fil modtaget" });
  }
  try {
    const projects = parseExcel(req.file.path);
    if (!projects.length) {
      return res.status(400).json({ error: "Ingen projekter fundet i filen" });
    }
    saveData(projects);
    res.json({ projects, totals: computeTotals(projects) });
  } catch (err) {
    res.status(500).json({ error: "Kunne ikke læse Excel" });
  } finally {
    fs.unlink(req.file.path, () => {});
  }
});

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "YouWe AI API er kørende",
    endpoints: ["/api/login", "/api/projects", "/api/upload"],
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Serverfejl" });
});

app.listen(PORT, () => {
  console.log(`API kører på http://localhost:${PORT}`);
});
