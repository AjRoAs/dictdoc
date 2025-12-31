pub mod audio;
pub mod device;
pub mod stt;
pub mod text;

use std::sync::{Arc, Mutex};
use tauri::{State, Manager, Emitter};
use audio::AudioInput;
use stt::{SttEngine, vosk::VoskEngine, whisper::WhisperEngine};
use stt::model_downloader::{ensure_vosk_model, ensure_whisper_model};
use device::{DeviceManager, DeviceEvent};
use text::TextProcessor;

// Refactored AppState to be thread-friendly
struct AppState {
    audio_input: Arc<Mutex<AudioInput>>,
    current_engine: Arc<Mutex<Option<Box<dyn SttEngine + Send + Sync>>>>,
    text_processor: Arc<TextProcessor>,
}

#[tauri::command]
fn start_recording(app: tauri::AppHandle, state: State<AppState>, engine_name: String, language: String) -> Result<(), String> {
    {
        let mut current_engine = state.current_engine.lock().map_err(|_| "Failed to lock engine")?;

        let model_path_str = if engine_name == "vosk" {
            "models/vosk-model-en-us-0.22"
        } else {
            "models/ggml-base.en.bin"
        };

        let model_path = app.path().resolve(model_path_str, tauri::path::BaseDirectory::Resource)
            .map_err(|e| format!("Failed to resolve path for {}: {}", model_path_str, e))?;

        let model_path_lossy = model_path.to_string_lossy().to_string();

        // Autodescarga de modelos si no existen
        if engine_name == "vosk" {
            ensure_vosk_model(&model_path_lossy)?;
        } else {
            ensure_whisper_model(&model_path_lossy)?;
        }

        let engine: Box<dyn SttEngine + Send + Sync> = if engine_name == "vosk" {
             match VoskEngine::new(&model_path_lossy, 16000.0) {
                 Ok(e) => Box::new(e),
                 Err(e) => return Err(format!("Vosk init failed at {}: {}", model_path_lossy, e))
             }
        } else {
             match WhisperEngine::new(&model_path_lossy) {
                 Ok(e) => Box::new(e),
                 Err(e) => return Err(format!("Whisper init failed at {}: {}", model_path_lossy, e))
             }
        };

        *current_engine = Some(engine);
    }

    let (tx, rx) = std::sync::mpsc::channel::<Vec<f32>>();

    // Spawn processing thread
    let engine_ref = state.current_engine.clone();
    let processor_ref = state.text_processor.clone();

    std::thread::spawn(move || {
        while let Ok(audio_data) = rx.recv() {
            let mut engine_lock = engine_ref.lock().unwrap();
            if let Some(engine) = engine_lock.as_mut() {
                match engine.process_audio(&audio_data) {
                    Ok(Some(text)) => {
                        let processed = processor_ref.process(&text);
                        let _ = app.emit("transcription", processed);
                    },
                    Ok(None) => {},
                    Err(e) => eprintln!("STT Error: {}", e),
                }
            } else {
                break; // Engine stopped
            }
        }
    });

    let mut audio = state.audio_input.lock().map_err(|_| "Failed to lock audio")?;
    let tx_clone = tx;
    audio.start_recording(move |data| {
        let _ = tx_clone.send(data);
    })?;

    Ok(())
}

#[tauri::command]
fn stop_recording(state: State<AppState>) -> Result<(), String> {
    let mut audio = state.audio_input.lock().map_err(|_| "Failed to lock audio")?;
    audio.stop_recording();

    let mut engine = state.current_engine.lock().map_err(|_| "Failed to lock engine")?;
    *engine = None;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let device_manager = DeviceManager::new().ok();

    if let Some(mut dm) = device_manager {
        let _ = dm.start_monitoring(|event| {
             match event {
                 DeviceEvent::RecordPressed => println!("Record Pressed"),
                 DeviceEvent::StopPressed => println!("Stop Pressed"),
                 _ => {}
             }
        });
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .setup(|app| {
            app.manage(AppState {
                audio_input: Arc::new(Mutex::new(AudioInput::new())),
                current_engine: Arc::new(Mutex::new(None)),
                text_processor: Arc::new(TextProcessor::new()),
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![start_recording, stop_recording])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
