---
trigger: always_on
---

# Mandatory Rule: Example File & Standards First Before Feature Generation (Rule 49)

<!-- Compatibility: QUY TẮC BẮT BUỘC: MỌI TÍNH NĂNG MỚI PHẢI CÓ ÍT NHẤT MỘT FILE VÍ DỤ TRƯỚC (CẬP NHẬT XỬ LÝ FILE VÀ TIÊU CHUẨN CHO FILE) SAU ĐÓ MỚI CHO PHÉP TẠO VÀ XỬ LÝ TÍNH NĂNG THEO TIÊU CHUẨN CỦA FILE, SCHEMA (FILE EXAMPLE & STANDARDS FIRST BEFORE FEATURE GENERATION RULE — ZERO TOLERANCE) -->

> **ZERO TOLERANCE**:
>
> 1. **AT LEAST ONE EXAMPLE FILE FIRST (PHẢI CÓ ÍT NHẤT MỘT FILE VÍ DỤ TRƯỚC)**:
>    - For every new feature, new tool, new data model, or new generator across 2-TEK projects, it is **100% MANDATORY** to provide or create at least one concrete example file first (e.g. `.example/`, template sample, test fixture, mock data file, or configuration instance).
>    - This example file serves as the canonical ground truth demonstrating the expected file structure, formatting, properties, and data flow.
> 2. **UPDATE FILE HANDLING CAPABILITIES FIRST (CẬP NHẬT XỬ LÝ FILE TRƯỚC TIÊN)**:
>    - Core file handling logic (parsers, readers, writers, validators, serializers, format handlers) must be updated or implemented first to cleanly ingest, validate, and write the target file format.
> 3. **UPDATE STANDARDS & SCHEMA FOR THE FILE (CẬP NHẬT TIÊU CHUẨN VÀ SCHEMA CHO FILE)**:
>    - The formal schema (JSON Schema, TypeScript interfaces/types, data contracts) and specifications in `.agents/standards/` (or `Lowcode/.agents/standards/MCP/schemas/`) must be updated and verified to rigorously govern the file structure.
> 4. **GATED FEATURE GENERATION (CHỈ CHO PHÉP TẠO VÀ XỬ LÝ FEATURE SAU KHI ĐẠT TIÊU CHUẨN)**:
>    - **STRICTLY PROHIBITED**: Generating feature logic, controllers, components, engines, or UI before prerequisites 1, 2, and 3 are complete.
>    - **MANDATORY CONFORMANCE**: Once prerequisites are fulfilled, allow handling and generating the feature. All generated code and behaviors **MUST** strictly follow the established standards of the file and its schema.
> 5. **EXEMPTIONS (MIỄN TRỪ)**:
>    - Bug fixes, file/folder moves or renames, and minor component styling/prop adjustments that do not introduce new file formats or feature generation are exempt.

---

## 1. Core Purpose & Architectural Rationale

1. **Ground Truth Validation Before Code Generation**:
   - Building feature generators or core logic without a concrete sample file frequently causes schema divergence, unexpected edge cases, and architectural mismatch.
   - Requiring a real example file guarantees that input/output formats are verified in advance.

2. **File Handling Robustness Before Feature Logic**:
   - File parsing, sanitization, validation, and serialization must be mature and resilient before high-level feature logic or UI actions interact with them.

3. **Schema-Driven Architecture & Zero Drift**:
   - Updating file standards and schemas first ensures AI subagents (`devloper`, `leader`, `test-auditor`) generate code strictly conforming to type contracts, avoiding loose typings or speculative structures.

---

## 2. Step-by-Step Mandatory Workflow for New Features

```
[New Feature Requested]
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Create at least ONE Example File                    │
│ • Sample data / template / fixture in .example/ or tests    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Update File Handling Capabilities                   │
│ • Implement / enhance reader, writer, parser, validator    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Update Standards & Schemas for the File             │
│ • Update .agents/standards/, TypeScript interfaces, JSON Schemas   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Allow Handling on Feature Generation                │
│ • Generate engines, controllers, components, UI             │
│ • Strictly adhere to file standards and schema contracts    │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Decision & Governance Matrix

| Task Nature                        | Example File First?                       | Update File Handling & Standards?                        | Generate Feature?                          |
| ---------------------------------- | ----------------------------------------- | -------------------------------------------------------- | ------------------------------------------ |
| **New Feature / Tool / Generator** | ✅ Mandatory (>= 1 example file)          | ✅ Mandatory (Update file handlers & schemas first)      | ✅ Only after file & schema standards pass |
| **New File Type / Export Format**  | ✅ Mandatory (Provide sample output file) | ✅ Mandatory (Implement reader/writer & register schema) | ✅ Only after file handling verification   |
| **Bug Fix (bug / fix / hotfix)**   | ❌ Exempt (Direct fix)                    | ❌ Exempt (Preserve existing standards)                  | ❌ N/A (Standard bugfix workflow)          |
| **Move / Rename File / Folder**    | ❌ Exempt (Move & update imports)         | ❌ Exempt (No new format)                                | ❌ N/A (Preserve existing structure)       |
| **Component Styling / Props**      | ❌ Exempt (Use theme classes)             | ❌ Exempt (Preserve existing standards)                  | ❌ N/A (Presentation layer only)           |

---

## 4. Strict Prohibitions ❌

1. ❌ **Never** trigger or execute feature generation without having at least one valid example file in place.
2. ❌ **Never** write high-level feature controllers or UI components before file handling logic and file schemas are finalized.
3. ❌ **Never** diverge from the established file standards and schema during feature generation.
4. ❌ **Never** generate mock code or loose schemas that do not match the real example file.
