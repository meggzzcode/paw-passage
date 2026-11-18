#!/usr/bin/env node
// Tells IndexNow-participating search engines (Bing, Yandex, Naver, Seznam and others) which pages exist or changed.
// Protocol: https://www.indexnow.org/documentation (read 2026-11-18). No secret is involved: the key is public by design
// and is proven by the text file public/<key>.txt that the site serves at its root.
//
//   node scripts/indexnow.mjs                  # DRY RUN: prints what would be sent, sends nothing
//   node scripts/indexnow.mjs --send           # really submits
//   node scripts/indexnow.mjs --sitemap-file x.xml   # read a local sitemap instead of the live one
//   node scripts/indexnow.mjs --changed urls.txt     # submit only the URLs listed (one per line)
//
// Exit 0 on success or dry run, 1 when the engine refuses, 2 when it could not run.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const flag = (n) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : undefined;
};
const SITE = (flag("--site") ?? "https://www.pawsandpassage.com").replace(/\/+$/, "");
const ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS = 10000; // protocol limit per POST

export function findKey(dir = join(root, "public")) {
  const files = existsSync(dir)
    ? readdirSync(dir).filter((f) => /^[A-Za-z0-9-]{8,128}\.txt$/.test(f))
    : [];
  for (const f of files)
    if (readFileSync(join(dir, f), "utf8").trim() === f.slice(0, -4)) return f.slice(0, -4);
  return null;
}

export function parseSitemap(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

export function buildPayload(key, host, urls) {
  const own = [...new Set(urls)].filter((u) => {
    try {
      return new URL(u).hostname === host;
    } catch {
      return false;
    }
  });
  return { host, key, keyLocation: `https://${host}/${key}.txt`, urlList: own.slice(0, MAX_URLS) };
}

async function main() {
  const key = findKey();
  if (!key) {
    console.error("No valid key file in public/ (a file <key>.txt whose content is <key>).");
    process.exit(2);
  }
  const host = new URL(SITE).hostname;
  let urls;
  if (flag("--changed"))
    urls = readFileSync(flag("--changed"), "utf8")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  else if (flag("--sitemap-file"))
    urls = parseSitemap(readFileSync(flag("--sitemap-file"), "utf8"));
  else {
    const r = await fetch(`${SITE}/sitemap.xml`, {
      headers: { "User-Agent": "PawsAndPassage-indexnow/1.0" },
    });
    if (!r.ok) {
      console.error(`Sitemap answered ${r.status}`);
      process.exit(2);
    }
    urls = parseSitemap(await r.text());
  }
  const payload = buildPayload(key, host, urls);
  console.log(`${payload.urlList.length} URL(s) for ${host}, key ${key.slice(0, 4)}...`);
  if (!args.includes("--send")) {
    console.log("Dry run: nothing sent. Add --send to submit.");
    return;
  }
  if (payload.urlList.length === 0) {
    console.log("Nothing to submit.");
    return;
  }
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  console.log(`IndexNow answered ${res.status}`); // 200 received, 202 received and key check pending, 403 key not found, 422 URLs not on host, 429 too many
  process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
}

if (process.argv[1] === fileURLToPath(import.meta.url))
  await main().catch((e) => {
    console.error(e);
    process.exit(2);
  });
