# Medical Speech Recognition App

A cross-platform speech recognition desktop app built with **React + Vite** (frontend), **Tauri v2** (shell), and **Rust** (backend). It supports both **Vosk** (offline) and **Whisper** (higher accuracy) engines.

For contributor/agent instructions (repo layout, contracts, gotchas), see `AGENTS.md`.

## Features (current)

- **Dual engine selection**: Vosk or Whisper from the UI.
- **Clipboard history**: Save transcriptions to a persisted history and copy them back out.
- **Modern UI**: Fluent UI components + custom borderless title bar.
- **Text post-processing**: Simple medical term/abbreviation normalization in Rust.

## Notes on current MVP behavior

Some items are present but not fully implemented end-to-end yet:

- **Audio visualization**: the UI currently uses a mocked/random “volume” meter while recording (not true audio metering).
- **Philips SpeechMike integration**: the backend enumerates HID devices, but does not yet open/read reports and map them to record/stop actions.
- **“Autodownload models” setting**: there is a checkbox in Settings, but the backend currently always attempts to ensure models exist when starting recording.

## Development setup

### Prerequisites

- **Node.js**: 18+ (project currently works with newer Node versions as well)
- **Rust**: stable toolchain

Linux system dependencies (typical Tauri + audio + HID setup):

```bash
sudo apt-get install \
  libglib2.0-dev libgtk-3-dev libsoup-3.0-dev libwebkit2gtk-4.1-dev \
  libasound2-dev libudev-dev clang cmake
```

### Install

```bash
npm install
```

### Run (Tauri dev)

Recommended:

```bash
npm run tauri:dev
```

Alternate (runs the `tauri` script with `dev` args):

```bash
npm run tauri dev
```

### Build (release bundle)

Recommended:

```bash
npm run tauri:build
```

Alternate:

```bash
npm run tauri build
```

### Useful checks

Type-check the frontend:

```bash
npx tsc -p tsconfig.json --noEmit
```

Run Rust tests:

```bash
cargo test --manifest-path src-tauri/Cargo.toml
```

## Models (Vosk / Whisper)

The backend currently resolves model paths under **Tauri’s Resource directory** and expects:

- **Vosk model directory**: `models/vosk-model-en-us-0.22`
- **Whisper model file**: `models/ggml-base.en.bin`

On `start_recording`, the backend will attempt to **auto-download** missing models by shelling out to `curl` and `tar`.

Important implications:
- In some packaged/release configurations, **bundled resources may be read-only**, so writing downloaded models there may fail. If you hit this, you can pre-provision models or adjust the backend to download into an app data directory and load from there.
- Auto-download requires `curl` (and `tar` for the Vosk zip/extract flow) to be available on the host OS.

## Native Vosk library packaging (important)

The Rust build script `src-tauri/build.rs` copies a platform-specific Vosk dynamic library into the build output. Its current expected source locations are:

- Linux: `lib/libvosk.so`
- Windows: `lib/vosk.dll`
- macOS: `lib/libvosk.dylib`

This repo also contains platform-specific folders under `lib/` (e.g. `lib/linux/`, `lib/win/`). If you see build/runtime errors about a missing Vosk library, either:
- **Place/symlink** the library where `src-tauri/build.rs` expects it, or
- **Update** `src-tauri/build.rs` to match the repo’s actual `lib/` layout.

## License

Private
