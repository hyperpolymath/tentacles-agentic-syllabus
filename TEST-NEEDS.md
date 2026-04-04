# Test & Benchmark Requirements

## CRG Grade: B — ACHIEVED 2026-04-04

## Grade B Test Suite (6 Independent Targets)

| Target | Recipe | Runner | Status |
|--------|--------|--------|--------|
| T1 | `just test-structure` | Bash / `validate_structure.sh` | PASS |
| T2 | `just test-unit` | Deno — `tests/unit_test.mjs` | PASS |
| T3 | `just test-e2e` | Deno — `tests/e2e_test.mjs` | PASS |
| T4 | `just test-property` | Deno — `tests/property_test.mjs` | PASS |
| T5 | `just test-bench` | Deno — `tests/bench_test.mjs` | PASS |
| T6 | `just test-lint` | `deno lint` (skips gracefully if no JS/TS) | PASS |

Run all: `just test`

## Structural Checks (T1 — 22/22)

- RSR files: README.adoc, LICENSE, SECURITY.md, CONTRIBUTING.adoc, VISION.adoc, ROADMAP.adoc, 0-AI-MANIFEST.a2ml
- Agent source files: BlueAgent.res, GreenAgent.res, IndigoAgent.res, OrangeAgent.res, RedAgent.res, VioletAgent.res, YellowAgent.res, Types.res
- Directories: curriculum/, languages/
- Test files: unit_test.mjs, e2e_test.mjs, property_test.mjs, bench_test.mjs
- CI workflows: ≥3 workflow files in .github/workflows/

## What's Next (Grade A)

- Functional tests for each ReScript agent module (BlueAgent.res through YellowAgent.res)
- End-to-end agent coordination workflow tests
- Performance benchmarks: agent spawn/teardown latency, message throughput
- panic-attack clean scan
