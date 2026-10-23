import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonicalUrl = "https://montagemagerquark.onrender.com/";
const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

async function read(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

const [html, robots, sitemap] = await Promise.all([
  read("index.html"),
  read("robots.txt"),
  read("sitemap.xml"),
]);

expect(/<!doctype html>/i.test(html), "index.html benötigt eine HTML5-Doctype-Deklaration");
expect(/<html\b[^>]*\blang=["']de["']/i.test(html), "Die Seitensprache muss Deutsch sein");
expect(/<meta\b[^>]*name=["']viewport["']/i.test(html), "Viewport-Metadaten fehlen");
expect(/<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']{50,}["']/i.test(html), "Eine aussagekräftige Meta-Beschreibung fehlt");
expect(html.includes(`<link rel="canonical" href="${canonicalUrl}">`), "Die kanonische URL fehlt oder ist falsch");
expect(/<meta\b[^>]*property=["']og:image["']/i.test(html), "Das Social-Preview-Bild fehlt");
expect(/<main\b[^>]*id=["']hauptinhalt["']/i.test(html), "Der Hauptinhalt benötigt die erwartete Sprungmarke");

const jsonLdMatch = html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
expect(Boolean(jsonLdMatch), "Strukturierte JSON-LD-Daten fehlen");
if (jsonLdMatch) {
  try {
    JSON.parse(jsonLdMatch[1]);
  } catch {
    failures.push("Die strukturierten JSON-LD-Daten sind kein gültiges JSON");
  }
}

const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]));
for (const [, anchor] of html.matchAll(/\bhref=["']#([^"']+)["']/gi)) {
  expect(ids.has(anchor), `Sprungmarke #${anchor} verweist auf keine vorhandene ID`);
}

const references = [...html.matchAll(/\b(?:src|href)=["']([^"'<>]+)["']/gi)].map((match) => match[1]);
for (const reference of references) {
  if (/^(?:https?:|mailto:|tel:|data:|#)/i.test(reference)) continue;

  const relativePath = decodeURIComponent(reference.split(/[?#]/, 1)[0]).replace(/^\/+/, "");
  if (!relativePath) continue;

  const target = path.resolve(root, relativePath);
  expect(target.startsWith(`${root}${path.sep}`), `Ungültiger lokaler Pfad: ${reference}`);
  try {
    await access(target);
  } catch {
    failures.push(`Lokale Datei fehlt: ${reference}`);
  }
}

expect(robots.includes(`Sitemap: ${canonicalUrl}sitemap.xml`), "robots.txt verweist nicht auf die erwartete Sitemap");
expect(sitemap.includes(`<loc>${canonicalUrl}</loc>`), "Die kanonische URL fehlt in sitemap.xml");

if (failures.length > 0) {
  console.error("Website-Prüfung fehlgeschlagen:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Website-Prüfung erfolgreich: ${references.length} Referenzen und ${ids.size} IDs kontrolliert.`);
