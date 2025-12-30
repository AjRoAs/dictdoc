pub mod vosk;
pub mod whisper;

pub trait SttEngine {
    fn start(&mut self) -> Result<(), String>;
    fn stop(&mut self) -> Result<(), String>;
    fn process_audio(&mut self, audio_data: &[f32]) -> Result<Option<String>, String>;
}
