// SPDX-License-Identifier: PMPL-1.0-or-later
// Copyright (c) 2026 Jonathan D.A. Jewell (hyperpolymath) <j.d.a.jewell@open.ac.uk>
// unit_test.mjs — Unit tests mirroring logic in agents/Types.res

import { assertEquals, assertThrows, assertMatch } from "https://deno.land/std@0.224.0/assert/mod.ts";

// === Logic mirrors from Types.res ===

const STAGES = ["Cuttle", "Squidlet", "Duet", "Octopus"];
const COLORS = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"];

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
    Red:    "#E74C3C",
    Orange: "#E67E22",
    Yellow: "#F1C40F",
    Green:  "#2ECC71",
    Blue:   "#3498DB",
    Indigo: "#9B59B6",
    Violet: "#8E44AD",
  };
  if (!(color in map)) throw new Error(`Unknown color: ${color}`);
  return map[color];
}

function colorToEmoji(color) {
  const map = {
    Red: "🔴", Orange: "🟠", Yellow: "🟡",
    Green: "🟢", Blue: "🔵", Indigo: "🟣", Violet: "🟤",
  };
  if (!(color in map)) throw new Error(`Unknown color: ${color}`);
  return map[color];
}

// === Stage age range tests ===

Deno.test("stageToAge: Cuttle covers ages 8–12", () => {
  const [lo, hi] = stageToAge("Cuttle");
  assertEquals(lo, 8);
  assertEquals(hi, 12);
});

Deno.test("stageToAge: Squidlet covers ages 13–14", () => {
  const [lo, hi] = stageToAge("Squidlet");
  assertEquals(lo, 13);
  assertEquals(hi, 14);
});

Deno.test("stageToAge: Duet is exactly age 15", () => {
  const [lo, hi] = stageToAge("Duet");
  assertEquals(lo, 15);
  assertEquals(hi, 15);
});

Deno.test("stageToAge: Octopus starts at 16", () => {
  const [lo, hi] = stageToAge("Octopus");
  assertEquals(lo, 16);
  assertEquals(hi >= 16, true);
});

Deno.test("stageToAge: unknown stage throws", () => {
  assertThrows(() => stageToAge("Unknown"), Error, "Unknown stage");
});

// === Color hex tests ===

Deno.test("colorToHex: all 7 colors produce valid hex strings", () => {
  for (const color of COLORS) {
    const hex = colorToHex(color);
    assertMatch(hex, /^#[0-9A-F]{6}$/i, `${color} hex invalid`);
  }
});

Deno.test("colorToHex: Blue maps to #3498DB", () => {
  assertEquals(colorToHex("Blue"), "#3498DB");
});

Deno.test("colorToHex: all hex values are distinct", () => {
  const hexes = COLORS.map(colorToHex);
  const unique = new Set(hexes);
  assertEquals(unique.size, COLORS.length);
});

Deno.test("colorToHex: unknown color throws", () => {
  assertThrows(() => colorToHex("Purple"), Error, "Unknown color");
});

// === Emoji tests ===

Deno.test("colorToEmoji: all 7 colors produce non-empty emoji", () => {
  for (const color of COLORS) {
    const emoji = colorToEmoji(color);
    assertEquals(typeof emoji, "string");
    assertEquals(emoji.length > 0, true);
  }
});

Deno.test("colorToEmoji: all emoji values are distinct", () => {
  const emojis = COLORS.map(colorToEmoji);
  const unique = new Set(emojis);
  assertEquals(unique.size, COLORS.length);
});

// === Stage ordering tests ===

Deno.test("stages form a strictly increasing age sequence", () => {
  const ranges = STAGES.map(stageToAge);
  for (let i = 1; i < ranges.length; i++) {
    const prevHi = ranges[i - 1][1];
    const currLo = ranges[i][0];
    assertEquals(currLo > prevHi, true,
      `Stage ${STAGES[i]} (lo=${currLo}) must start after ${STAGES[i-1]} (hi=${prevHi})`);
  }
});

Deno.test("stages cover a contiguous age range without gaps", () => {
  const ranges = STAGES.map(stageToAge);
  for (let i = 1; i < ranges.length; i++) {
    const prevHi = ranges[i - 1][1];
    const currLo = ranges[i][0];
    assertEquals(currLo, prevHi + 1,
      `Gap between ${STAGES[i-1]} and ${STAGES[i]}`);
  }
});

// === Source file presence tests ===

Deno.test("Types.res exists and is non-empty", async () => {
  const stat = await Deno.stat("agents/Types.res");
  assertEquals(stat.isFile, true);
  assertEquals(stat.size > 0, true);
});

Deno.test("all 7 agent .res files exist", async () => {
  const expected = [
    "agents/BlueAgent.res", "agents/GreenAgent.res", "agents/IndigoAgent.res",
    "agents/OrangeAgent.res", "agents/RedAgent.res", "agents/VioletAgent.res",
    "agents/YellowAgent.res",
  ];
  for (const path of expected) {
    const stat = await Deno.stat(path);
    assertEquals(stat.isFile, true, `Missing: ${path}`);
    assertEquals(stat.size > 0, true, `Empty: ${path}`);
  }
});
