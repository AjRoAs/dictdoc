import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { Controls } from "./components/Controls";
import { Editor } from "./components/Editor";
import { AudioMeter } from "./components/AudioMeter";

function App() {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [engine, setEngine] = useState<'vosk' | 'whisper'>('vosk');
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    let unlisten: any;

    async function setupListener() {
        unlisten = await listen("transcription", (event: any) => {
            const newText = event.payload as string;
            setText((prev) => prev + " " + newText);
        });
    }

    setupListener();

    let interval: any;
    if (isRecording) {
        // Mock volume for MVP
        interval = setInterval(() => {
            setVolume(Math.random() * 0.5);
        }, 100);
    } else {
        setVolume(0);
    }

    return () => {
        clearInterval(interval);
        if (unlisten) unlisten();
    };
  }, [isRecording]);

  const handleStart = async () => {
    setIsRecording(true);
    try {
        await invoke("start_recording", { engineName: engine, language });
    } catch (e) {
        console.error("Failed to start:", e);
        setIsRecording(false);
    }
  };

  const handleStop = async () => {
    setIsRecording(false);
    try {
        await invoke("stop_recording");
    } catch (e) {
        console.error("Failed to stop:", e);
    }
  };

  return (
    <div className="container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Medical Speech Recognition</h1>

      <div style={{ marginBottom: '20px' }}>
          <Controls
            isRecording={isRecording}
            onStart={handleStart}
            onStop={handleStop}
            engine={engine}
            setEngine={setEngine}
            language={language}
            setLanguage={setLanguage}
          />
      </div>

      <div style={{ marginBottom: '20px' }}>
         <AudioMeter volume={volume} />
      </div>

      <Editor text={text} onChange={setText} />
    </div>
  );
}

export default App;
