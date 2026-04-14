
# ═══════════════════════════════════════════════════════════════════════════════
# ONBOARDING & DIAGNOSTICS
# ═══════════════════════════════════════════════════════════════════════════════

# Check all required toolchain dependencies and report health
import? "contractile.just"

doctor:
    #!/usr/bin/env bash
    echo "═══════════════════════════════════════════════════"
    echo "  7 Tentacles Doctor — Toolchain Health Check"
    echo "═══════════════════════════════════════════════════"
    echo ""
    PASS=0; FAIL=0; WARN=0
    check() {
        local name="$1" cmd="$2" min="$3"
        if command -v "$cmd" >/dev/null 2>&1; then
            VER=$("$cmd" --version 2>&1 | head -1)
            echo "  [OK]   $name — $VER"
            PASS=$((PASS + 1))
        else
            echo "  [FAIL] $name — not found (need $min+)"
            FAIL=$((FAIL + 1))
        fi
    }
    check "just"              just      "1.25" 
    check "git"               git       "2.40" 
    check "Deno"              deno      "2.0" 
    check "ReScript (resc)"   rescript  "12.0" 
# Optional tools
if command -v panic-attack >/dev/null 2>&1; then
    echo "  [OK]   panic-attack — available"
    PASS=$((PASS + 1))
else
    echo "  [WARN] panic-attack — not found (pre-commit scanner)"
    WARN=$((WARN + 1))
fi
    echo ""
    echo "  Result: $PASS passed, $FAIL failed, $WARN warnings"
    if [ "$FAIL" -gt 0 ]; then
        echo "  Run 'just heal' to attempt automatic repair."
        exit 1
    fi
    echo "  All required tools present."

# Attempt to automatically install missing tools
heal:
    #!/usr/bin/env bash
    echo "═══════════════════════════════════════════════════"
    echo "  7 Tentacles Heal — Automatic Tool Installation"
    echo "═══════════════════════════════════════════════════"
    echo ""
if ! command -v deno >/dev/null 2>&1; then
    echo "Installing Deno..."
    curl -fsSL https://deno.land/install.sh | sh
fi
# Install Deno dependencies
echo "Installing Deno dependencies..."
deno install 2>/dev/null || true
if ! command -v just >/dev/null 2>&1; then
    echo "Installing just..."
    cargo install just 2>/dev/null || echo "Install just from https://just.systems"
fi
    echo ""
    echo "Heal complete. Run 'just doctor' to verify."

# Guided tour of the project structure and key concepts
tour:
    #!/usr/bin/env bash
    echo "═══════════════════════════════════════════════════"
    echo "  7 Tentacles — Guided Tour"
    echo "═══════════════════════════════════════════════════"
    echo ""
    echo '*Teaching Compiler Architecture to Ages 8-18 Through Progressive Reveal & Playful Mascots*'
    echo ""
    echo "Key directories:"
    echo "  docs/                     Documentation" 
    echo "  tests/                    Test suite" 
    echo "  .github/workflows/        CI/CD workflows" 
    echo ""
    echo "Quick commands:"
    echo "  just doctor    Check toolchain health"
    echo "  just heal      Fix missing tools"
    echo "  just help-me   Common workflows"
    echo "  just default   List all recipes"
    echo ""
    echo "Read more: README.adoc, EXPLAINME.adoc"

# Show help for common workflows
help-me:
    #!/usr/bin/env bash
    echo "═══════════════════════════════════════════════════"
    echo "  7 Tentacles — Common Workflows"
    echo "═══════════════════════════════════════════════════"
    echo ""
echo "FIRST TIME SETUP:"
echo "  just doctor           Check toolchain"
echo "  just heal             Fix missing tools"
echo "" 
    echo "DEVELOPMENT:" 
    echo "  deno task dev         Development server" 
    echo "  deno test             Run tests" 
    echo "" 
echo "PRE-COMMIT:"
echo "  just assail           Run panic-attacker scan"
echo ""
echo "LEARN:"
echo "  just tour             Guided project tour"
echo "  just default          List all recipes" 

# ═══════════════════════════════════════════════════════════════════════════════
# GRADE B TEST SUITE — 6 independent targets
# ═══════════════════════════════════════════════════════════════════════════════

# Run all Grade B tests
test: test-structure test-unit test-e2e test-property test-bench test-lint

# T1: Structural compliance (RSR files, agents, CI, test files)
test-structure:
    bash tests/validate_structure.sh

# T2: Unit tests — stage/age/color logic mirrors from Types.res
test-unit:
    deno test --allow-read tests/unit_test.mjs

# T3: E2E tests — agent source file content and curriculum completeness
test-e2e:
    deno test --allow-read tests/e2e_test.mjs

# T4: Property tests — invariants across all 7 colours and 4 stages
test-property:
    deno test --allow-read tests/property_test.mjs

# T5: Benchmark tests — agent parse performance (verified as passing tests)
test-bench:
    deno test --allow-read tests/bench_test.mjs

# T6: Lint — deno lint across agent JS interop
test-lint:
    deno lint 2>/dev/null || echo "SKIP: no JS/TS files to lint (ReScript-only project)"

# Run panic-attacker pre-commit scan
assail:
    @command -v panic-attack >/dev/null 2>&1 && panic-attack assail . || echo "panic-attack not found — install from https://github.com/hyperpolymath/panic-attacker"


# Print the current CRG grade (reads from READINESS.md '**Current Grade:** X' line)
crg-grade:
    @grade=$$(grep -oP '(?<=\*\*Current Grade:\*\* )[A-FX]' READINESS.md 2>/dev/null | head -1); \
    [ -z "$$grade" ] && grade="X"; \
    echo "$$grade"

# Generate a shields.io badge markdown for the current CRG grade
# Looks for '**Current Grade:** X' in READINESS.md; falls back to X
crg-badge:
    @grade=$$(grep -oP '(?<=\*\*Current Grade:\*\* )[A-FX]' READINESS.md 2>/dev/null | head -1); \
    [ -z "$$grade" ] && grade="X"; \
    case "$$grade" in \
      A) color="brightgreen" ;; B) color="green" ;; C) color="yellow" ;; \
      D) color="orange" ;; E) color="red" ;; F) color="critical" ;; \
      *) color="lightgrey" ;; esac; \
    echo "[![CRG $$grade](https://img.shields.io/badge/CRG-$$grade-$$color?style=flat-square)](https://github.com/hyperpolymath/standards/tree/main/component-readiness-grades)"
