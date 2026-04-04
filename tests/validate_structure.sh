#!/usr/bin/env bash
# SPDX-License-Identifier: PMPL-1.0-or-later
# SPDX-FileCopyrightText: 2026 Jonathan D.A. Jewell (hyperpolymath) <j.d.a.jewell@open.ac.uk>
#
# validate_structure.sh — Structural compliance check for 7-tentacles
# Verifies RSR files, agent source files, curriculum, and CI presence.

set -euo pipefail

PASS=0; FAIL=0
pass() { echo "PASS: $1"; PASS=$((PASS+1)); }
fail() { echo "FAIL: $1"; FAIL=$((FAIL+1)); }

# RSR required files
[ -f README.adoc ]   && pass "README.adoc"   || fail "README.adoc missing"
[ -f LICENSE.txt ] || [ -f LICENSE ] && pass "LICENSE" || fail "LICENSE missing"
[ -f SECURITY.md ]   && pass "SECURITY.md"   || fail "SECURITY.md missing"
[ -f CONTRIBUTING.adoc ] && pass "CONTRIBUTING.adoc" || fail "CONTRIBUTING.adoc missing"
[ -f VISION.adoc ]   && pass "VISION.adoc"   || fail "VISION.adoc missing"
[ -f ROADMAP.adoc ]  && pass "ROADMAP.adoc"  || fail "ROADMAP.adoc missing"
[ -f 0-AI-MANIFEST.a2ml ] && pass "0-AI-MANIFEST.a2ml" || fail "0-AI-MANIFEST.a2ml missing"

# Agent source files — one per colour
for colour in Blue Green Indigo Orange Red Violet Yellow; do
  [ -f "agents/${colour}Agent.res" ] \
    && pass "agents/${colour}Agent.res" \
    || fail "agents/${colour}Agent.res missing"
done
[ -f agents/Types.res ] && pass "agents/Types.res" || fail "agents/Types.res missing"

# Curriculum and language directories
[ -d curriculum ] && pass "curriculum/ directory" || fail "curriculum/ missing"
[ -d languages ]  && pass "languages/ directory"  || fail "languages/ missing"

# Test files present
for t in unit_test.mjs e2e_test.mjs property_test.mjs bench_test.mjs; do
  [ -f "tests/$t" ] && pass "tests/$t" || fail "tests/$t missing"
done

# CI workflows
wf_count=$(ls .github/workflows/*.yml 2>/dev/null | wc -l)
[ "$wf_count" -ge 3 ] \
  && pass ".github/workflows/ has $wf_count workflow files" \
  || fail ".github/workflows/ has only $wf_count files (need ≥3)"

echo ""
echo "Results: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ]
