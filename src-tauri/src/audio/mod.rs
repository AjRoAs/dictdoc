use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};

pub struct AudioInput {
    stream: Option<cpal::Stream>,
    is_recording: bool,
}

impl AudioInput {
    pub fn new() -> Self {
        Self {
            stream: None,
            is_recording: false,
        }
    }

    pub fn start_recording<F>(&mut self, on_audio_data: F) -> Result<(), String>
    where
        F: FnMut(Vec<f32>) + Send + 'static,
    {
        let host = cpal::default_host();
        let device = host
            .default_input_device()
            .ok_or("No input device available")?;

        let config = device
            .default_input_config()
            .map_err(|e| e.to_string())?;

        let stream_config: cpal::StreamConfig = config.into();

        let err_fn = move |err| {
            eprintln!("an error occurred on stream: {}", err);
        };

        let mut callback = on_audio_data;

        let stream = device.build_input_stream(
            &stream_config,
            move |data: &[f32], _: &cpal::InputCallbackInfo| {
                callback(data.to_vec());
            },
            err_fn,
            None
        ).map_err(|e| e.to_string())?;

        stream.play().map_err(|e| e.to_string())?;

        self.stream = Some(stream);
        self.is_recording = true;

        Ok(())
    }

    pub fn stop_recording(&mut self) {
        if let Some(stream) = self.stream.take() {
            drop(stream);
        }
        self.is_recording = false;
    }
}
