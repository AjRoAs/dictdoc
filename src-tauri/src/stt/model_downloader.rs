use std::fs;
use std::path::Path;
use std::io::Write;
use std::process::Command;

pub fn ensure_vosk_model(model_path: &str) -> Result<(), String> {
    if Path::new(model_path).exists() {
        return Ok(());
    }
    // Example: download and extract Vosk model
    let url = "https://alphacephei.com/vosk/models/vosk-model-en-us-0.22.zip";
    let zip_path = format!("{}.zip", model_path);
    let output = Command::new("curl")
        .arg("-L")
        .arg("-o")
        .arg(&zip_path)
        .arg(url)
        .output()
        .map_err(|e| format!("Failed to run curl: {}", e))?;
    if !output.status.success() {
        return Err("Failed to download Vosk model".to_string());
    }
    let output = Command::new("tar")
        .arg("-xf")
        .arg(&zip_path)
        .arg("-C")
        .arg(Path::new(model_path).parent().unwrap())
        .output()
        .map_err(|e| format!("Failed to extract Vosk model: {}", e))?;
    if !output.status.success() {
        return Err("Failed to extract Vosk model".to_string());
    }
    fs::remove_file(&zip_path).ok();
    Ok(())
}

pub fn ensure_whisper_model(model_path: &str) -> Result<(), String> {
    if Path::new(model_path).exists() {
        return Ok(());
    }
    // Example: download Whisper model
    let url = "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin";
    let output = Command::new("curl")
        .arg("-L")
        .arg("-o")
        .arg(model_path)
        .arg(url)
        .output()
        .map_err(|e| format!("Failed to run curl: {}", e))?;
    if !output.status.success() {
        return Err("Failed to download Whisper model".to_string());
    }
    Ok(())
}
