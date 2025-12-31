import React, { useRef, useEffect } from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';

interface AudioMeterProps {
    volume: number; // 0 to 1
}

const useStyles = makeStyles({
    container: {
        width: '100%',
        height: '60px',
        backgroundColor: tokens.colorNeutralBackground3,
        borderRadius: tokens.borderRadiusMedium,
        overflow: 'hidden',
        border: `1px solid ${tokens.colorNeutralStroke1}`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    canvas: {
        width: '100%',
        height: '100%',
    }
});

export const AudioMeter: React.FC<AudioMeterProps> = ({ volume }) => {
    const styles = useStyles();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    // Use a ref to smooth out the volume for visualization
    const smoothVolRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;

            // Smooth the volume transition
            smoothVolRef.current += (volume - smoothVolRef.current) * 0.2;
            const amp = smoothVolRef.current;

            ctx.clearRect(0, 0, width, height);

            // Draw a background grid or line
            ctx.beginPath();
            ctx.strokeStyle = tokens.colorNeutralStroke2;
            ctx.lineWidth = 1;
            ctx.moveTo(0, height / 2);
            ctx.lineTo(width, height / 2);
            ctx.stroke();

            // Draw waveform simulation
            ctx.beginPath();
            ctx.strokeStyle = tokens.colorPaletteBlueBorderActive;
            ctx.lineWidth = 2;

            const frequency = 0.1;
            const phase = Date.now() * 0.005;

            for (let x = 0; x < width; x++) {
                // Combine sine waves to create a "voice-like" waveform
                // Amplitude is modulated by volume
                // Use a window function (hanning-ish) to taper edges
                const window = 1 - Math.pow((x - width / 2) / (width / 2), 2);

                const y = height / 2 +
                          Math.sin(x * frequency + phase) * amp * (height / 2) * window +
                          Math.sin(x * frequency * 2.5 + phase * 1.3) * amp * (height / 4) * window;

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            animationRef.current = requestAnimationFrame(draw);
        };

        // Handle high DPI
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        draw();

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [volume]);

    return (
        <div className={styles.container}>
            <canvas ref={canvasRef} className={styles.canvas} />
        </div>
    );
};
