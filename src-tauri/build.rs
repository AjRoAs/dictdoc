use std::env;
use std::fs;
use std::path::PathBuf;

fn main() {
    // Detectar plataforma y nombre de la librería
    let (libname, ext) = if cfg!(target_os = "windows") {
        ("vosk", "dll")
    } else if cfg!(target_os = "linux") {
        ("libvosk", "so")
    } else if cfg!(target_os = "macos") {
        ("libvosk", "dylib")
    } else {
        panic!("Unsupported OS for vosk dynamic library copy");
    };

    // Ruta de origen (lib folder)
    let src = PathBuf::from(format!("../lib/{}.{}", libname, ext));
    // Ruta de destino (output dir)
    let out_dir = env::var("OUT_DIR").unwrap();
    let dst = PathBuf::from(&out_dir).join(format!("{}.{}", libname, ext));

    // Copiar la librería
    if src.exists() {
        fs::copy(&src, &dst).expect("Failed to copy vosk dynamic library");
        println!("cargo:rerun-if-changed={}", src.display());
    }

    tauri_build::build();
}
