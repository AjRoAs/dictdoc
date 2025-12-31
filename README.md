# Medical Speech Recognition App

A modern, cross-platform speech recognition application built with React, Tauri, and Rust. It supports both Vosk (offline) and Whisper (high accuracy) engines.

## Features

-   **Dual Engine Support**: Switch between Vosk (fast, offline) and Whisper (high accuracy).
-   **Clipboard Manager**: Built-in history of transcribed text with persistence.
-   **Modern UI**: Fluent UI design with Dark Mode support.
-   **Borderless Window**: Custom title bar with "Always on Top" functionality.
-   **Audio Visualization**: Real-time waveform visualization during recording.
-   **Hardware Integration**: Support for Philips SpeechMike devices.

## Development Setup

### Prerequisites

-   Node.js (v18+)
-   Rust (stable)
-   System dependencies (Linux):
    ```bash
    sudo apt-get install libglib2.0-dev libgtk-3-dev libsoup-3.0-dev libwebkit2gtk-4.1-dev libasound2-dev libudev-dev clang cmake libvosk
    ```

### Installation

1.  Install frontend dependencies:
    ```bash
    npm install
    ```

2.  Run development server:
    ```bash
    npm run tauri dev
    ```

### Building

To build the application for release:

```bash
npm run tauri build
```

## Note on Vosk Models

The application expects Vosk models to be available in the resource directory.
-   `models/vosk-model-en-us-0.22`
-   `models/ggml-base.en.bin` (for Whisper)

Ensure these are properly linked or copied during the build process.

## License

Private
