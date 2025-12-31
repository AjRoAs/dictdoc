import React, { useState } from 'react';
import { Dialog, DialogSurface, DialogBody, DialogTitle, DialogActions, Button, Checkbox, Dropdown, Option } from '@fluentui/react-components';

interface SettingsProps {
  open: boolean;
  onClose: () => void;
  engine: 'vosk' | 'whisper';
  setEngine: (engine: 'vosk' | 'whisper') => void;
  language: 'en' | 'es';
  setLanguage: (lang: 'en' | 'es') => void;
  autoDownload: boolean;
  setAutoDownload: (val: boolean) => void;
}

export const Settings: React.FC<SettingsProps> = ({ open, onClose, engine, setEngine, language, setLanguage, autoDownload, setAutoDownload }) => {
  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Settings</DialogTitle>
          <div style={{ marginBottom: 16 }}>
            <Dropdown
              value={engine === 'vosk' ? "Vosk (Fast/Offline)" : "Whisper (High Accuracy)"}
              selectedOptions={[engine]}
              onOptionSelect={(_, data) => setEngine(data.optionValue as any)}
            >
              <Option value="vosk">Vosk (Fast/Offline)</Option>
              <Option value="whisper">Whisper (High Accuracy)</Option>
            </Dropdown>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Dropdown
              value={language === 'en' ? "English" : "Spanish"}
              selectedOptions={[language]}
              onOptionSelect={(_, data) => setLanguage(data.optionValue as any)}
            >
              <Option value="en">English</Option>
              <Option value="es">Spanish</Option>
            </Dropdown>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Checkbox
              checked={autoDownload}
              onChange={(_, data) => setAutoDownload(!!data.checked)}
            >
              Autodownload models if missing
            </Checkbox>
          </div>
          <DialogActions>
            <Button appearance="primary" onClick={onClose}>Close</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
