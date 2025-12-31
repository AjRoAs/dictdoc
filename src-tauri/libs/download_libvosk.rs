use std::fs;
use std::path::Path;
use std::process::Command;

pub fn ensure_libvosk(lib_path: &str) -> Result<(), String> {
    if Path::new(lib_path).exists() {
        return Ok(());
    }
    // URL oficial de libvosk para Windows x64
    let url = "https://alphacephei.com/vosk/release/libvosk-win64-0.3.45.zip";
    let zip_path = format!("{}.zip", lib_path);
    let output = Command::new("curl")
        .arg("-L")
        .arg("-o")
        .arg(&zip_path)
        .arg(url)
        .output()
        .map_err(|e| format!("Failed to run curl: {}", e))?;
    if !output.status.success() {
        return Err("Failed to download libvosk.zip".to_string());
    }
    // Validar que el archivo descargado es un ZIP válido
    let metadata = std::fs::metadata(&zip_path).map_err(|e| format!("metadata: {}", e))?;
    if metadata.len() < 10000 {
        return Err("Downloaded file is too small to be a valid libvosk.zip. Verifica la URL o la conexión.".to_string());
    }
    // Extracción nativa en Rust usando zip
    if let Err(e) = extract_zip(&zip_path, Path::new(lib_path).parent().unwrap()) {
        return Err(format!("Failed to extract libvosk.zip: {}", e));
    }
    fs::remove_file(&zip_path).ok();
    Ok(())
}

fn extract_zip(zip_path: &str, out_dir: &Path) -> Result<(), String> {
    let file = std::fs::File::open(zip_path).map_err(|e| format!("open zip: {}", e))?;
    let mut archive = zip::ZipArchive::new(file).map_err(|e| format!("zip archive: {}", e))?;
    for i in 0..archive.len() {
        let mut file = archive.by_index(i).map_err(|e| format!("zip file: {}", e))?;
        let outpath = out_dir.join(file.name());
        if file.is_dir() {
            std::fs::create_dir_all(&outpath).map_err(|e| format!("mkdir: {}", e))?;
        } else {
            if let Some(p) = outpath.parent() {
                std::fs::create_dir_all(p).map_err(|e| format!("mkdir: {}", e))?;
            }
            let mut outfile = std::fs::File::create(&outpath).map_err(|e| format!("create: {}", e))?;
            std::io::copy(&mut file, &mut outfile).map_err(|e| format!("copy: {}", e))?;
        }
    }
    Ok(())
}
