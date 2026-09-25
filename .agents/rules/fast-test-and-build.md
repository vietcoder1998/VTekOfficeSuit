---
trigger: always_on
---

# Accelerated Testing & Fast Build Runner Guidelines

1. **Fast Testing Runner**:
   - Always prioritize `node scripts/fast-test.mjs --fast` or `npm run test:fast`.
   - Filter by changed files: `npm run test:changed`.
   - Filter by test name: `node scripts/fast-test.mjs --filter <pattern>`.

2. **Fast Build Runner**:
   - Always prioritize `node scripts/fast-build.mjs --fast` or `npm run build:fast`.
   - Clean build cache: `npm run build:clean`.

3. **Fast Pre-Commit Pipeline**:
   - Run `node scripts/fast-pipeline.mjs` or `npm run pipeline:fast` to validate typecheck and unit tests simultaneously.
