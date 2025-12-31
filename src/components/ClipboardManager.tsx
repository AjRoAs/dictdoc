import React from 'react';
import {
    Button,
    Card,
    Text,
    makeStyles,
    tokens,
    shorthands
} from '@fluentui/react-components';
import {
    CopyRegular,
    DeleteRegular,
    ClipboardTextLtrRegular
} from '@fluentui/react-icons';

interface ClipboardManagerProps {
    history: string[];
    onCopy: (text: string) => void;
    onDelete: (index: number) => void;
    onClear: () => void;
}

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: tokens.colorNeutralBackground2,
        borderRight: `1px solid ${tokens.colorNeutralStroke1}`
    },
    header: {
        ...shorthands.padding('10px'),
        borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: tokens.colorNeutralBackground2,
    },
    headerTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: tokens.fontWeightSemibold
    },
    list: {
        ...shorthands.padding('10px'),
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        overflowY: 'auto',
    },
    itemCard: {
        ...shorthands.padding('10px'),
        backgroundColor: tokens.colorNeutralBackground1,
    },
    itemText: {
        fontSize: tokens.fontSizeBase300,
        marginBottom: '8px',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        color: tokens.colorNeutralForeground1
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '5px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '20px',
        color: tokens.colorNeutralForeground3
    }
});

export const ClipboardManager: React.FC<ClipboardManagerProps> = ({
    history,
    onCopy,
    onDelete,
    onClear
}) => {
    const styles = useStyles();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    <ClipboardTextLtrRegular />
                    <Text>History</Text>
                </div>
                {history.length > 0 && (
                    <Button size="small" onClick={onClear}>
                        Clear
                    </Button>
                )}
            </div>
            <div className={styles.list}>
                {history.length === 0 ? (
                    <div className={styles.emptyState}>No history yet</div>
                ) : (
                    history.map((text, index) => (
                        <Card key={index} className={styles.itemCard}>
                            <Text className={styles.itemText} title={text}>
                                {text}
                            </Text>
                            <div className={styles.actions}>
                                <Button
                                    icon={<CopyRegular />}
                                    size="small"
                                    appearance="subtle"
                                    onClick={() => onCopy(text)}
                                    title="Copy"
                                />
                                <Button
                                    icon={<DeleteRegular />}
                                    size="small"
                                    appearance="subtle"
                                    onClick={() => onDelete(index)}
                                    title="Delete"
                                    style={{ color: tokens.colorPaletteRedForeground1 }}
                                />
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};
