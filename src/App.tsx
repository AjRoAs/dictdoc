import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { Layout } from "./components/Layout";
import { ClipboardManager } from "./components/ClipboardManager";
import { Controls } from "./components/Controls";
import { Settings } from "./components/Settings";
import { Editor } from "./components/Editor";
import { AudioMeter } from "./components/AudioMeter";
import { TitleBar } from "./components/TitleBar";
import { SaveRegular, CopyRegular } from "@fluentui/react-icons";
import { Button } from "@fluentui/react-components";

function App() {
    const [text, setText] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [engine, setEngine] = useState<'vosk' | 'whisper'>('vosk');
    const [language, setLanguage] = useState<'en' | 'es'>('en');
    const [volume, setVolume] = useState(0);
    const [history, setHistory] = useState<string[]>([]);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [autoDownload, setAutoDownload] = useState(true);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('clipboard_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('clipboard_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    let unlisten: any;

    async function setupListener() {
        unlisten = await listen("transcription", (event: any) => {
            const newText = event.payload as string;
            setText((prev) => prev ? prev + " " + newText : newText);
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

  const addToHistory = (textToAdd: string) => {
      if (!textToAdd.trim()) return;
      setHistory(prev => [textToAdd, ...prev]);
  };

  const handleCopy = async (textToCopy: string) => {
      try {
          await writeText(textToCopy);
          // Optional: Show toast notification
      } catch (e) {
          console.error("Failed to copy", e);
      }
  };

  const handleDelete = (index: number) => {
      setHistory(prev => prev.filter((_, i) => i !== index));
  };

  const handleClear = () => {
      if (confirm("Are you sure you want to clear all history?")) {
          setHistory([]);
      }
  };

  const sidebar = (
      <ClipboardManager
          history={history}
          onCopy={handleCopy}
          onDelete={handleDelete}
          onClear={handleClear}
      />
  );

  const main = (
      <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1>Medical Speech Recognition</h1>
          </div>

          <div style={{ marginBottom: '20px' }}>
                    <Controls
                        isRecording={isRecording}
                        onStart={handleStart}
                        onStop={handleStop}
                        engine={engine}
                        setEngine={setEngine}
                        language={language}
                        setLanguage={setLanguage}
                        onSettings={() => setSettingsOpen(true)}
                    />
          </div>

          <div style={{ marginBottom: '20px' }}>
             <AudioMeter volume={volume} />
          </div>

          <div style={{ position: 'relative' }}>
              <Editor text={text} onChange={setText} />
              <div style={{
                  display: 'flex',
                  gap: '10px',
                  marginTop: '10px',
                  justifyContent: 'flex-end'
              }}>
                  <Button
                      onClick={() => addToHistory(text)}
                      icon={<SaveRegular />}
                      appearance="subtle"
                  >
                      Save to History
                  </Button>
                  <Button
                      onClick={() => handleCopy(text)}
                      icon={<CopyRegular />}
                      appearance="subtle"
                  >
                      Copy All
                  </Button>
              </div>
          </div>
      </div>
  );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <TitleBar />
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <Layout sidebar={sidebar} main={main} />
            </div>
            <Settings
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                engine={engine}
                setEngine={setEngine}
                language={language}
                setLanguage={setLanguage}
                autoDownload={autoDownload}
                setAutoDownload={setAutoDownload}
            />
        </div>
    );
}

export default App;
