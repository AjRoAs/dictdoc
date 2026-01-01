# AGENTS.md

This file is for coding agents and contributors working in this repo. It documents how to run the app, where the important code lives, and the constraints you should respect when making changes.

## Project overview

- **Frontend**: Vite + React (TypeScript) UI in `src/`
- **Desktop shell**: Tauri v2
- **Backend**: Rust crate in `src-tauri/`
  - Audio capture via `cpal`
  - Speech-to-text engines:
    - **Vosk** via the `vosk` crate
    - **Whisper** via `whisper-rs` (ggml model)
  - Clipboard integration via `tauri-plugin-clipboard-manager`

At runtime the UI calls Tauri commands (`invoke`) and receives transcription results via an event (`transcription`).

## Commands (what agents should run)

### Install

```bash
npm install
```

### Dev (Tauri + Vite)

Either of these works:

```bash
npm run tauri dev
```

```bash
npm run tauri:dev
```

### Frontend-only dev (browser)

```bash
npm run dev
```

### Build (release bundle)

```bash
npm run tauri build
```

### Type-check (recommended before/after TS changes)

There is no dedicated `typecheck` script; use:

```bash
npx tsc -p tsconfig.json --noEmit
```

### Rust tests (recommended before/after backend changes)

```bash
cargo test --manifest-path src-tauri/Cargo.toml
```

Optional (style/lints):

```bash
cargo fmt --manifest-path src-tauri/Cargo.toml
```

```bash
cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings
```

## Key code paths

### Frontend (React)

- **App wiring (invoke + event listener)**: `src/App.tsx`
  - Calls `invoke("start_recording", { engineName, language })`
  - Calls `invoke("stop_recording")`
  - Listens for `transcription` events and appends text
- **Controls / Settings UI**: `src/components/Controls.tsx`, `src/components/Settings.tsx`
- **Editor / clipboard history UI**: `src/components/Editor.tsx`, `src/components/ClipboardManager.tsx`

### Backend (Rust / Tauri)

- **Tauri entrypoint**: `src-tauri/src/main.rs` → `tauri_app_lib::run()`
- **Tauri commands + app state**: `src-tauri/src/lib.rs`
  - Commands: `start_recording`, `stop_recording`
  - Emits: `app.emit("transcription", processed_text)`
- **Audio capture**: `src-tauri/src/audio/mod.rs` (`cpal` input stream)
- **Speech-to-text engines**:
  - Trait: `src-tauri/src/stt/mod.rs`
  - Vosk: `src-tauri/src/stt/vosk.rs`
  - Whisper: `src-tauri/src/stt/whisper.rs`
- **Model auto-download**: `src-tauri/src/stt/model_downloader.rs`
  - Uses external `curl` and `tar` executables at runtime
- **Text post-processing**: `src-tauri/src/text/mod.rs` (has unit tests)
- **Device (SpeechMike) monitoring (MVP)**: `src-tauri/src/device/mod.rs`

## Frontend ↔ backend contract

- **Invoke names** (must match exactly):
  - `start_recording` (expects `engineName` and `language` from the UI)
  - `stop_recording`
- **Event name**:
  - Backend emits `transcription` with a `string` payload
  - UI listens on `transcription`

If you add new commands/events, update both sides together:
- Add `#[tauri::command] fn ...` and include it in `tauri::generate_handler![...]` in `src-tauri/src/lib.rs`
- Call it from the UI via `@tauri-apps/api/core` `invoke(...)` and handle errors

## Models & resources (important runtime constraints)

`start_recording` resolves model paths under **Tauri’s Resource directory**:

- **Vosk model directory**: `models/vosk-model-en-us-0.22`
- **Whisper model file**: `models/ggml-base.en.bin`

The backend will attempt to **auto-download** missing models via `ensure_vosk_model` / `ensure_whisper_model`.

Agent guidance:
- **Don’t assume resources are writable in release builds**. Bundled resources are often read-only depending on platform/packaging. If you change model download behavior, prefer downloading into an app-specific data directory and persisting the chosen path.
- **Auto-download depends on external tools**: the Rust code shells out to `curl` and `tar`. Keep cross-platform behavior in mind (Windows has `curl.exe`/`tar.exe` on many installs, but not all environments).

## Native library packaging (Vosk)

`src-tauri/build.rs` tries to copy the Vosk dynamic library into the build output:

- Linux expects `../lib/libvosk.so`
- Windows expects `../lib/vosk.dll`
- macOS expects `../lib/libvosk.dylib`

Repo layout currently includes platform-specific folders under `lib/` (e.g. `lib/linux/`, `lib/win/`). If you encounter build errors about a missing Vosk library, reconcile the expected source path in `src-tauri/build.rs` with the actual file location.

## Known MVP behavior (don’t “paper over” it)

There are a couple of deliberate MVP shortcuts in the current codebase:

- **Audio meter is mocked** in `src/App.tsx` (random values while recording). If you implement real metering, wire it to actual audio data (either from Rust or via WebAudio when running in-browser).
- **Device (SpeechMike) monitoring is incomplete** in `src-tauri/src/device/mod.rs` (it refreshes devices but does not open/read HID reports yet). Don’t claim full hardware integration in code/comments unless you implement the full open/read mapping.

## Repo conventions / constraints

- **No stubs/placeholders**: avoid adding “TODO-only” codepaths, mock implementations, or placeholder comments without implementing the behavior. If you must introduce a temporary limitation, document exactly why and how to complete it.
- **TypeScript**: `strict` is enabled; keep types tight and don’t introduce `any` unless there’s no reasonable alternative.
- **Rust**: keep thread-safety explicit (the app uses `Arc<Mutex<...>>`); avoid holding locks across blocking calls.
- **Small, cohesive changes**: prefer minimal diffs that keep the UI↔backend contract consistent and the app runnable.
