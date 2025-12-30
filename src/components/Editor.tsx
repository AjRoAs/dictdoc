import React from 'react';

interface EditorProps {
    text: string;
    onChange: (text: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ text, onChange }) => {
    return (
        <textarea
            value={text}
            onChange={(e) => onChange(e.target.value)}
            style={{
                width: '100%',
                height: '400px',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                resize: 'vertical'
            }}
            placeholder="Start dictating..."
        />
    );
};
