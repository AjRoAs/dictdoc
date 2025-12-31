import React from 'react';
import { Copy, Trash2, ClipboardList } from 'lucide-react';

interface ClipboardManagerProps {
    history: string[];
    onCopy: (text: string) => void;
    onDelete: (index: number) => void;
    onClear: () => void;
}

export const ClipboardManager: React.FC<ClipboardManagerProps> = ({
    history,
    onCopy,
    onDelete,
    onClear
}) => {
    return (
        <div className="clipboard-manager">
            <div className="clipboard-header">
                <h3><ClipboardList size={20} /> History</h3>
                {history.length > 0 && (
                    <button className="clear-btn" onClick={onClear} title="Clear All">
                        Clear
                    </button>
                )}
            </div>
            <div className="clipboard-list">
                {history.length === 0 ? (
                    <div className="empty-state">No history yet</div>
                ) : (
                    history.map((text, index) => (
                        <div key={index} className="clipboard-item">
                            <div className="clipboard-text" title={text}>
                                {text.length > 50 ? text.substring(0, 50) + '...' : text}
                            </div>
                            <div className="clipboard-actions">
                                <button onClick={() => onCopy(text)} title="Copy">
                                    <Copy size={16} />
                                </button>
                                <button onClick={() => onDelete(index)} title="Delete" className="delete-btn">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
