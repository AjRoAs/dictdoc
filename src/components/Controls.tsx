import React from 'react';
import { Mic, Square, Settings } from 'lucide-react';

interface ControlsProps {
    isRecording: boolean;
    onStart: () => void;
    onStop: () => void;
    engine: 'vosk' | 'whisper';
    setEngine: (engine: 'vosk' | 'whisper') => void;
    language: 'en' | 'es';
    setLanguage: (lang: 'en' | 'es') => void;
}

export const Controls: React.FC<ControlsProps> = ({
    isRecording,
    onStart,
    onStop,
    engine,
    setEngine,
    language,
    setLanguage
}) => {
    return (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
            <button
                onClick={isRecording ? onStop : onStart}
                style={{
                    backgroundColor: isRecording ? '#ff4444' : '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                }}
            >
                {isRecording ? <Square size={24} /> : <Mic size={24} />}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <select value={engine} onChange={(e) => setEngine(e.target.value as any)} style={{ padding: '5px' }}>
                    <option value="vosk">Vosk (Fast/Offline)</option>
                    <option value="whisper">Whisper (High Accuracy)</option>
                </select>

                <select value={language} onChange={(e) => setLanguage(e.target.value as any)} style={{ padding: '5px' }}>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                </select>
            </div>

            <div style={{ marginLeft: 'auto' }}>
                <Settings size={20} color="#666" style={{ cursor: 'pointer' }} />
            </div>
        </div>
    );
};
