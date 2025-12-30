import React from 'react';

interface AudioMeterProps {
    volume: number; // 0 to 1
}

export const AudioMeter: React.FC<AudioMeterProps> = ({ volume }) => {
    return (
        <div style={{ width: '100%', height: '20px', backgroundColor: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
            <div
                style={{
                    width: `${Math.min(100, Math.max(0, volume * 100))}%`,
                    height: '100%',
                    backgroundColor: volume > 0.8 ? 'red' : '#4caf50',
                    transition: 'width 0.1s ease-out'
                }}
            />
        </div>
    );
};
