#!/usr/bin/env bash
#MISE description="Run the tests"

pnpm exec vitest --test-timeout 200000
