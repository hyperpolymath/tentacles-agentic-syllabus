// SPDX-License-Identifier: PMPL-1.0-or-later
// Copyright (c) 2026 Jonathan D.A. Jewell (hyperpolymath) <j.d.a.jewell@open.ac.uk>
// bench_test.mjs — Benchmarks for 7-tentacles agent system read/parse performance

const COLORS = ["Blue", "Green", "Indigo", "Orange", "Red", "Violet", "Yellow"];
const STAGES = ["Cuttle", "Squidlet", "Duet", "Octopus"];

// === Logic under benchmark ===

function stageToAge(stage) {
  switch (stage) {
    case "Cuttle":   return [8, 12];
    case "Squidlet": return [13, 14];
    case "Duet":     return [15, 15];
    case "Octopus":  return [16, 99];
    default: throw new Error(`Unknown stage: ${stage}`);
  }
}

function colorToHex(color) {
  const map = {
    Red: "#E74C3C", Orange: "#E67E22", Yellow: "#F1C40F",
    Green: "#2ECC71", Blue: "#3498DB", Indigo: "#9B59B6", Violet: "#8E44AD",
  };
  return map[color] ?? "#000000";
}

function parseAgentSource(src) {
  return {
    hasNames: src.includes("let names"),
    hasPersonality: src.includes("let personality"),
    hasGetName: src.includes("let getName"),
    hasReveal: src.includes("let revealText"),
    lineCount: src.split("\n").length,
  };
}

// === Benchmarks ===

Deno.bench("stageToAge: single lookup", () => {
  stageToAge("Cuttle");
});

Deno.bench("stageToAge: all 4 stages", () => {
  for (const s of STAGES) stageToAge(s);
});

Deno.bench("colorToHex: single lookup", () => {
  colorToHex("Blue");
});

Deno.bench("colorToHex: all 7 colors", () => {
  for (const c of COLORS) colorToHex(c);
});

Deno.bench("read Types.res", async () => {
  await Deno.readTextFile("agents/Types.res");
});

Deno.bench("read all 7 agent files sequentially", async () => {
  for (const color of COLORS) {
    await Deno.readTextFile(`agents/${color}Agent.res`);
  }
});

Deno.bench("read all 7 agent files in parallel", async () => {
  await Promise.all(COLORS.map(c => Deno.readTextFile(`agents/${c}Agent.res`)));
});

Deno.bench("parse BlueAgent.res source structure", async () => {
  const src = await Deno.readTextFile("agents/BlueAgent.res");
  parseAgentSource(src);
});

Deno.bench("parse all 7 agent sources", async () => {
  const sources = await Promise.all(COLORS.map(c => Deno.readTextFile(`agents/${c}Agent.res`)));
  sources.forEach(parseAgentSource);
});

Deno.bench("count stage coverage across all agents", async () => {
  const sources = await Promise.all(COLORS.map(c => Deno.readTextFile(`agents/${c}Agent.res`)));
  for (const src of sources) {
    for (const stage of STAGES) {
      src.includes(`| ${stage} =>`);
    }
  }
});
