# Mandatory Rule: Fetching Data from Local Must Use Real Directory (Zero Dummy Data Rule — Section 825 / Rule 62)

<!-- Compatibility / Test Alias: Rule 50 / FETCH LOCAL USE REAL DIR RULE -->

> **ZERO TOLERANCE** (Rule 62 / Rule 50 Compatibility Alias):
> When implementing, upgrading, or executing any logic, service, controller, or UI component that reads, fetches, lists, or initializes data from **"local"**, **"computer"**, **"local hard device"**, or **"local storage disk"** across all 2-TEK projects:
> 1. **MANDATORY 100% USE REAL DIRECTORY & REAL VALUES**:
>    - All file and directory operations for local storage must resolve real, authentic filesystem paths (e.g. real workspace directory `./`, project root, actual user home `~`, or user-selected folders via HTML5 File System Access API / OS filesystem).
>    - Every document or file entry must represent an authentic file with its real filename, actual extension, exact size in bytes (`sizeBytes`), authentic modification timestamp (`updatedAt`), and real file content.
> 2. **STRICTLY PROHIBITED 100%: DUMMY / MOCK DATA FOR LOCAL STORAGE**:
>    - **STRICTLY FORBIDDEN** to hardcode fabricated dummy documents (e.g. placeholder files like `bao-cao-cong-viec.docx`, `bang-tinh-ngan-sach.xlsx`, `ke-hoach-du-an.pptx`, fake IoT sensor telemetry, or synthetic mock records) as computer disk data.
>    - **STRICTLY FORBIDDEN** to invent arbitrary byte sizes or static fake timestamps for local file items.
> 3. **MULTI-ENVIRONMENT RESOLUTION ARCHITECTURE**:
>    - **Server / Node / API Routes**: Access the filesystem using standard Node.js `fs` / `path` modules (e.g. `fs.readdirSync`, `fs.statSync`) to read authentic directory contents and file metadata.
>    - **Browser / Client**: Utilize the native File System Access API (`showDirectoryPicker`, `FileSystemDirectoryHandle`, `FileSystemFileHandle`) to read genuine files from the user's hard drive.
>    - **Default Workspace Discovery Fallback**: If no user folder is selected yet, populate local storage exclusively from real files that exist within the current workspace directory (`./`, `.lowcode/.standards/Office/`, etc.) with authentic sizes and paths.

---

## 1. Core Purpose & Architectural Rationale

1. **Authenticity & Developer Trust**:
   - Displaying fabricated placeholder data under "Computer" or "Local Hard Device" misleads users and developers into believing the system is disconnected from the real environment.
   - Using real directory paths and genuine file entries guarantees that actions (opening, editing, saving, inspecting) operate on real data.

2. **Unified Data Integrity**:
   - In modern local-first and desktop-first architectures, the local drive must directly reflect the actual state of the filesystem.
   - Eliminating dummy mocks prevents drift between local tests, simulated runs, and actual file management workflows.

---

## 2. Implementation Matrix

| Storage Category | Source Path Standard | Data Retrieval Mechanism | Prohibited Behavior ❌ |
|---|---|---|---|
| **Computer (Local Disk)** | Real directory: `~`, `./`, or chosen folder | Native `fs.readdir` (API) or `showDirectoryPicker` (Browser) | ❌ Hardcoding fake mock files |
| **Workspace Projects** | Real path: `./<project>/documents` | Scanned from real project folders in workspace | ❌ Fabricating non-existent projects |
| **Cloud Storage** | Cloud URI: `cloud://vtek-office` | Cloud sync engine / remote storage | ❌ Mixed dummy telemetry files |

---

## 3. Strict Prohibitions ❌

1. ❌ **FORBIDDEN** to define static placeholder lists (e.g. `REAL_COMPUTER_DOCUMENTS` with hardcoded fake titles) and present them as real computer files.
2. ❌ **FORBIDDEN** to bypass real filesystem inspection when fetching local data.
3. ❌ **FORBIDDEN** to display fake directory paths that do not correspond to authentic system or workspace locations.
