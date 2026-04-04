// SPDX-License-Identifier: PMPL-1.0-or-later
// Copyright (c) 2026 Jonathan D.A. Jewell (hyperpolymath) <j.d.a.jewell@open.ac.uk>
// e2e_test.mjs — E2E workflow tests for the 7-tentacles agent system

import { assertEquals, assertMatch, assert } from "https://deno.land/std@0.224.0/assert/mod.ts";

// === Helpers: parse key patterns from ReScript source ===

async function readAgent(color) {
  return Deno.readTextFile(`agents/${color}Agent.res`);
}

async function readTypes() {
  return Deno.readTextFile("agents/Types.res");
}

// === E2E: Curriculum completeness ===

Deno.test("E2E: all 7 agent colors are represented by source files", async () => {
  const colors = ["Blue", "Green", "Indigo", "Orange", "Red", "Violet", "Yellow"];
  for (const color of colors) {
    const src = await readAgent(color);
    assert(src.length > 0, `${color}Agent.res is empty`);
  }
});

Deno.test("E2E: each agent file declares its color in the agent record", async () => {
  const colorMap = {
    Blue: "Blue", Green: "Green", Indigo: "Indigo",
    Orange: "Orange", Red: "Red", Violet: "Violet", Yellow: "Yellow",
  };
  for (const [color, expected] of Object.entries(colorMap)) {
    const src = await readAgent(color);
    assert(src.includes(`color: ${expected}`), `${color}Agent.res missing color field`);
  }
});

Deno.test("E2E: each agent exports a getName function", async () => {
  const colors = ["Blue", "Green", "Indigo", "Orange", "Red", "Violet", "Yellow"];
  for (const color of colors) {
    const src = await readAgent(color);
    assert(src.includes("let getName"), `${color}Agent.res missing getName`);
  }
});

Deno.test("E2E: each agent exports a getHiddenConcept function", async () => {
  const colors = ["Blue", "Green", "Indigo", "Orange", "Red", "Violet", "Yellow"];
  for (const color of colors) {
    const src = await readAgent(color);
    assert(src.includes("let getHiddenConcept"), `${color}Agent.res missing getHiddenConcept`);
  }
});

Deno.test("E2E: each agent exports revealText for stage transitions", async () => {
  const colors = ["Blue", "Green", "Indigo", "Orange", "Red", "Violet", "Yellow"];
  for (const color of colors) {
    const src = await readAgent(color);
    assert(src.includes("let revealText"), `${color}Agent.res missing revealText`);
  }
});

// === E2E: Stage-reveal pipeline ===

Deno.test("E2E: reveal pipeline - Cuttle→Squidlet transition present in all agents", async () => {
  const colors = ["Blue", "Green", "Indigo", "Orange", "Red", "Violet", "Yellow"];
  for (const color of colors) {
    const src = await readAgent(color);
    assert(src.includes("Cuttle, Squidlet"),
      `${color}Agent.res missing Cuttle→Squidlet reveal case`);
  }
});

Deno.test("E2E: reveal pipeline - Squidlet→Duet transition present in all agents", async () => {
  const colors = ["Blue", "Green", "Indigo", "Orange", "Red", "Violet", "Yellow"];
  for (const color of colors) {
    const src = await readAgent(color);
    assert(src.includes("Squidlet, Duet"),
      `${color}Agent.res missing Squidlet→Duet reveal case`);
  }
});

Deno.test("E2E: reveal pipeline - Duet→Octopus transition present in all agents", async () => {
  const colors = ["Blue", "Green", "Indigo", "Orange", "Red", "Violet", "Yellow"];
  for (const color of colors) {
    const src = await readAgent(color);
    assert(src.includes("Duet, Octopus"),
      `${color}Agent.res missing Duet→Octopus reveal case`);
  }
});

// === E2E: Personality system ===

Deno.test("E2E: each agent has a non-empty catchphrase", async () => {
  const colors = ["Blue", "Green", "Indigo", "Orange", "Red", "Violet", "Yellow"];
  for (const color of colors) {
    const src = await readAgent(color);
    const match = src.match(/catchphrase:\s*"([^"]+)"/);
    assert(match !== null, `${color}Agent.res missing catchphrase`);
    assert(match[1].length > 0, `${color}Agent.res has empty catchphrase`);
  }
});

Deno.test("E2E: all 7 catchphrases are unique", async () => {
  const colors = ["Blue", "Green", "Indigo", "Orange", "Red", "Violet", "Yellow"];
  const catchphrases = [];
  for (const color of colors) {
    const src = await readAgent(color);
    const match = src.match(/catchphrase:\s*"([^"]+)"/);
    if (match) catchphrases.push(match[1]);
  }
  const unique = new Set(catchphrases);
  assertEquals(unique.size, 7, "Catchphrases must be unique per agent");
});

// === E2E: Types module integrity ===

Deno.test("E2E: Types.res defines all 4 stages", async () => {
  const src = await readTypes();
  for (const stage of ["Cuttle", "Squidlet", "Duet", "Octopus"]) {
    assert(src.includes(`| ${stage}`), `Types.res missing stage: ${stage}`);
  }
});

Deno.test("E2E: Types.res defines all 7 agent colors", async () => {
  const src = await readTypes();
  for (const color of ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"]) {
    assert(src.includes(`| ${color}`), `Types.res missing color: ${color}`);
  }
});

Deno.test("E2E: Types.res exports stageToAge and colorToHex helpers", async () => {
  const src = await readTypes();
  assert(src.includes("let stageToAge"), "Types.res missing stageToAge");
  assert(src.includes("let colorToHex"), "Types.res missing colorToHex");
});
