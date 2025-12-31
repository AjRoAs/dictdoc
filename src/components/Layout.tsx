import React from 'react';

interface LayoutProps {
    sidebar: React.ReactNode;
    main: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ sidebar, main }) => {
    return (
        <div className="app-layout">
            <aside className="sidebar">
                {sidebar}
            </aside>
            <main className="main-content">
                {main}
            </main>
        </div>
    );
};
