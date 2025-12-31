import React from 'react';
import {
    Button,
    Dropdown,
    Option,
    makeStyles,
    tokens
} from '@fluentui/react-components';
import {
    MicRegular,
    StopRegular,
    SettingsRegular
} from '@fluentui/react-icons';

interface ControlsProps {
    isRecording: boolean;
    onStart: () => void;
    onStop: () => void;
    engine: 'vosk' | 'whisper';
    setEngine: (engine: 'vosk' | 'whisper') => void;
    language: 'en' | 'es';
    setLanguage: (lang: 'en' | 'es') => void;
    onSettings?: () => void;
}

const useStyles = makeStyles({
    container: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        padding: '10px',
        background: tokens.colorNeutralBackground2,
        borderRadius: tokens.borderRadiusMedium,
        border: `1px solid ${tokens.colorNeutralStroke1}`
    },
    recordBtn: {
        minWidth: '50px',
        height: '50px',
        borderRadius: '50%',
        '&.recording': {
             backgroundColor: tokens.colorPaletteRedBackground3,
             color: tokens.colorNeutralForegroundOnBrand,
             ':hover': {
                 backgroundColor: tokens.colorPaletteRedBackground2,
             }
        },
        '&.idle': {
            backgroundColor: tokens.colorPaletteGreenBackground3,
             color: tokens.colorNeutralForegroundOnBrand,
             ':hover': {
                 backgroundColor: tokens.colorPaletteGreenBackground2,
             }
        }
    },
    selectContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    }
});

export const Controls: React.FC<ControlsProps> = ({
    isRecording,
    onStart,
    onStop,
    engine,
    setEngine,
    language,
    setLanguage,
    onSettings
}) => {
    const styles = useStyles();

    return (
        <div className={styles.container}>
            <Button
                onClick={isRecording ? onStop : onStart}
                className={`${styles.recordBtn} ${isRecording ? 'recording' : 'idle'}`}
                icon={isRecording ? <StopRegular fontSize={24} /> : <MicRegular fontSize={24} />}
                shape="circular"
            />

            <div className={styles.selectContainer}>
                <Dropdown
                    value={engine === 'vosk' ? "Vosk (Fast/Offline)" : "Whisper (High Accuracy)"}
                    selectedOptions={[engine]}
                    onOptionSelect={(_, data) => setEngine(data.optionValue as any)}
                >
                    <Option value="vosk">Vosk (Fast/Offline)</Option>
                    <Option value="whisper">Whisper (High Accuracy)</Option>
                </Dropdown>

                <Dropdown
                    value={language === 'en' ? "English" : "Spanish"}
                    selectedOptions={[language]}
                    onOptionSelect={(_, data) => setLanguage(data.optionValue as any)}
                >
                    <Option value="en">English</Option>
                    <Option value="es">Spanish</Option>
                </Dropdown>
            </div>

            <div style={{ marginLeft: 'auto' }}>
                <Button
                    appearance="subtle"
                    icon={<SettingsRegular />}
                    title="Settings"
                    onClick={onSettings}
                />
            </div>
        </div>
    );
};
