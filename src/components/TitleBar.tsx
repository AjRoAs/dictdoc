import React from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import {
  Button,
  makeStyles,
  tokens,
  shorthands
} from '@fluentui/react-components';
import {
  DismissRegular,
  MaximizeRegular,
  SubtractRegular,
  SquareMultipleRegular,
  PinRegular,
  PinOffRegular
} from '@fluentui/react-icons';
import { useState, useEffect } from 'react';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '32px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    ...shorthands.padding('0px', '0px', '0px', '10px'),
    userSelect: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  title: {
    fontSize: '12px',
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  controls: {
    display: 'flex',
    height: '100%',
  },
  button: {
    height: '100%',
    width: '46px',
    minWidth: '46px',
    borderRadius: 0,
    border: 'none',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    ':active': {
      backgroundColor: tokens.colorNeutralBackground1Pressed,
    }
  },
  closeButton: {
    ':hover': {
      backgroundColor: tokens.colorPaletteRedBackground3,
      color: tokens.colorNeutralForegroundOnBrand,
    },
    ':active': {
      backgroundColor: tokens.colorPaletteRedBackground1,
    }
  }
});

export const TitleBar: React.FC = () => {
  const styles = useStyles();
  const [appWindow, setAppWindow] = useState<any>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

  useEffect(() => {
    // Only attempt to access Tauri APIs if we are in the Tauri environment
    // Note: window.__TAURI_INTERNALS__ is a common check, or just try-catch
    const initTauri = async () => {
        try {
            // @ts-ignore
            if (window.__TAURI_INTERNALS__) {
                 const win = getCurrentWindow();
                 setAppWindow(win);
            }
        } catch (e) {
            console.log("Not running in Tauri environment");
        }
    };
    initTauri();
  }, []);

  const handleMinimize = () => {
    appWindow?.minimize();
  };

  const handleMaximize = async () => {
    if (!appWindow) return;
    const maximized = await appWindow.isMaximized();
    if (maximized) {
        appWindow.unmaximize();
        setIsMaximized(false);
    } else {
        appWindow.maximize();
        setIsMaximized(true);
    }
  };

  const handleClose = () => {
    appWindow?.close();
  };

  const toggleAlwaysOnTop = async () => {
      if (!appWindow) return;
      const newState = !isAlwaysOnTop;
      await appWindow.setAlwaysOnTop(newState);
      setIsAlwaysOnTop(newState);
  };

  return (
    <div className={styles.container} data-tauri-drag-region>
      <div className={styles.title} data-tauri-drag-region>Medical Speech Recognition</div>
      <div className={styles.controls}>
        <Button
            appearance="subtle"
            icon={isAlwaysOnTop ? <PinOffRegular /> : <PinRegular />}
            className={styles.button}
            onClick={toggleAlwaysOnTop}
            title={isAlwaysOnTop ? "Unpin from Top" : "Always on Top"}
        />
        <Button
          appearance="subtle"
          icon={<SubtractRegular />}
          className={styles.button}
          onClick={handleMinimize}
          title="Minimize"
        />
        <Button
          appearance="subtle"
          icon={isMaximized ? <SquareMultipleRegular /> : <MaximizeRegular />}
          className={styles.button}
          onClick={handleMaximize}
          title={isMaximized ? "Restore" : "Maximize"}
        />
        <Button
          appearance="subtle"
          icon={<DismissRegular />}
          className={`${styles.button} ${styles.closeButton}`}
          onClick={handleClose}
          title="Close"
        />
      </div>
    </div>
  );
};
