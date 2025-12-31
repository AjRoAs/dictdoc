import React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';

interface LayoutProps {
    sidebar: React.ReactNode;
    main: React.ReactNode;
}

const useStyles = makeStyles({
    root: {
        display: 'flex',
        height: '100%',
        width: '100%',
        backgroundColor: tokens.colorNeutralBackground1,
        color: tokens.colorNeutralForeground1,
    },
    sidebar: {
        width: '300px',
        height: '100%',
        borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
        backgroundColor: tokens.colorNeutralBackground2,
    },
    main: {
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        backgroundColor: tokens.colorNeutralBackground1,
        padding: '20px' // Add padding for content
    }
});

export const Layout: React.FC<LayoutProps> = ({ sidebar, main }) => {
    const styles = useStyles();
    return (
        <div className={styles.root}>
            <aside className={styles.sidebar}>
                {sidebar}
            </aside>
            <main className={styles.main}>
                {main}
            </main>
        </div>
    );
};
