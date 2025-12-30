use super::SttEngine;
use vosk::{Model, Recognizer};

pub struct VoskEngine {
    recognizer: Option<Recognizer>,
    model: Option<Model>,
    sample_rate: f32,
}

impl VoskEngine {
    pub fn new(model_path: &str, sample_rate: f32) -> Result<Self, String> {
        let model = Model::new(model_path)
            .ok_or_else(|| format!("Failed to load Vosk model from {}", model_path))?;

        Ok(Self {
            recognizer: None,
            model: Some(model),
            sample_rate,
        })
    }
}

impl SttEngine for VoskEngine {
    fn start(&mut self) -> Result<(), String> {
        if let Some(model) = &self.model {
            let recognizer = Recognizer::new(model, self.sample_rate)
                .ok_or("Failed to create recognizer")?;
            self.recognizer = Some(recognizer);
            Ok(())
        } else {
            Err("Model not loaded".to_string())
        }
    }

    fn stop(&mut self) -> Result<(), String> {
        self.recognizer = None;
        Ok(())
    }

    fn process_audio(&mut self, audio_data: &[f32]) -> Result<Option<String>, String> {
        if let Some(recognizer) = &mut self.recognizer {
            // Vosk expects i16 PCM. We need to convert f32 to i16.
            let i16_data: Vec<i16> = audio_data.iter()
                .map(|&f| (f * 32767.0).clamp(-32768.0, 32767.0) as i16)
                .collect();

            let state = recognizer.accept_waveform(&i16_data);

            match state {
                Ok(vosk::DecodingState::Finalized) => {
                     let result = recognizer.result();
                     // CompleteResult can be Single, Multiple, or Partial.
                     match result {
                         vosk::CompleteResult::Single(r) => {
                             if !r.text.is_empty() {
                                 return Ok(Some(r.text.to_string()));
                             }
                         }
                         vosk::CompleteResult::Multiple(r) => {
                              if let Some(first) = r.alternatives.first() {
                                   if !first.text.is_empty() {
                                     return Ok(Some(first.text.to_string()));
                                   }
                              }
                         }
                         _ => {}
                     }
                },
                Ok(vosk::DecodingState::Running) => {},
                Ok(vosk::DecodingState::Failed) => {
                    return Err("Vosk decoding failed".to_string());
                }
                Err(e) => return Err(format!("Vosk error: {:?}", e)),
            }
        }
        Ok(None)
    }
}
