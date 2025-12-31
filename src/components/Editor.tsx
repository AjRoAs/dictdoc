import React from 'react';
import { Textarea, makeStyles } from '@fluentui/react-components';

interface EditorProps {
    text: string;
    onChange: (text: string) => void;
}

const useStyles = makeStyles({
    textarea: {
        width: '100%',
        height: '400px',
        fontSize: '16px',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    }
});

export const Editor: React.FC<EditorProps> = ({ text, onChange }) => {
    const styles = useStyles();
    return (
        <div className={styles.container}>
            <Textarea
                value={text}
                onChange={(_, data) => onChange(data.value)}
                className={styles.textarea}
                placeholder="Start dictating..."
                resize="vertical"
                appearance="outline"
            />
        </div>
    );
};
