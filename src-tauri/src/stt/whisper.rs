use super::SttEngine;
use whisper_rs::{WhisperContext, FullParams, SamplingStrategy};

pub struct WhisperEngine {
    ctx: Option<WhisperContext>,
    state: Option<whisper_rs::WhisperState>,
}

impl WhisperEngine {
    pub fn new(model_path: &str) -> Result<Self, String> {
        let ctx = WhisperContext::new_with_params(model_path, Default::default())
            .map_err(|e| format!("Failed to load Whisper model: {:?}", e))?;

        let state = ctx.create_state()
             .map_err(|e| format!("Failed to create Whisper state: {:?}", e))?;

        Ok(Self {
            ctx: Some(ctx),
            state: Some(state),
        })
    }
}

impl SttEngine for WhisperEngine {
    fn start(&mut self) -> Result<(), String> {
        Ok(())
    }

    fn stop(&mut self) -> Result<(), String> {
        Ok(())
    }

    fn process_audio(&mut self, audio_data: &[f32]) -> Result<Option<String>, String> {
         if let Some(state) = &mut self.state {
            let mut params = FullParams::new(SamplingStrategy::Greedy { best_of: 1 });
            params.set_language(Some("en"));
            params.set_print_special(false);
            params.set_print_progress(false);
            params.set_print_realtime(false);
            params.set_print_timestamps(false);

            state.full(params, audio_data)
                .map_err(|e| format!("Whisper execution failed: {:?}", e))?;

            let num_segments = state.full_n_segments();
            let mut full_text = String::new();

            for i in 0..num_segments {
                 if let Some(segment) = state.get_segment(i) {
                     // WhisperSegment implements Display, or we can use to_str_lossy
                     if let Ok(text) = segment.to_str() {
                         full_text.push_str(text);
                     }
                 }
            }

            if !full_text.is_empty() {
                return Ok(Some(full_text));
            }
         }
         Ok(None)
    }
}
