const { app, BrowserWindow, ipcMain, globalShortcut, powerSaveBlocker } = require('electron');
const path = require('path');
const fs = require('fs');

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('disable-features', 'HardwareMediaKeyHandling');

let win;
let powerBlockerId = null;

function configPath() {
  return path.join(app.getPath('userData'), 'config.json');
}

function loadConfig() {
  try {
    const p = configPath();
    if (fs.existsSync(p)) {
      const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (cfg && cfg.url) return cfg;
    }
  } catch (_) {}
  return null;
}

function saveConfig(cfg) {
  fs.writeFileSync(configPath(), JSON.stringify(cfg, null, 2), 'utf8');
}

function normalizeUrl(url) {
  url = String(url || '').trim();
  if (!url) return '';
  if (!/^https?:\/\//i.test(url)) url = 'http://' + url;
  return url;
}

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    fullscreen: false,
    autoHideMenuBar: true,
    backgroundColor: '#000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      autoplayPolicy: 'no-user-gesture-required'
    }
  });

  win.setMenuBarVisibility(false);

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) {
      win.loadURL(url);
      return { action: 'deny' };
    }
    return { action: 'deny' };
  });

  win.webContents.on('did-finish-load', () => {
    const current = win.webContents.getURL();
    if (/^https?:/i.test(current)) {
      win.setFullScreen(true);
    }
  });

  const cfg = loadConfig();
  if (cfg && cfg.url) {
    win.loadURL(normalizeUrl(cfg.url));
  } else {
    win.loadFile(path.join(__dirname, 'settings.html'));
  }

  win.on('closed', () => { win = null; });
}

ipcMain.handle('get-config', () => loadConfig());

ipcMain.handle('save-config', async (_event, cfg) => {
  const url = normalizeUrl(cfg?.url);
  if (!url) return { ok: false, error: 'Informe a URL do painel.' };

  saveConfig({ url });
  await win.loadURL(url);
  win.setFullScreen(true);
  return { ok: true };
});

ipcMain.handle('open-settings', async () => {
  win.setFullScreen(false);
  await win.loadFile(path.join(__dirname, 'settings.html'));
  return true;
});

ipcMain.handle('exit-app', () => {
  app.quit();
  return true;
});

app.whenReady().then(() => {
  powerBlockerId = powerSaveBlocker.start('prevent-display-sleep');
  createWindow();

  globalShortcut.register('F11', () => {
    if (win) win.setFullScreen(!win.isFullScreen());
  });

  globalShortcut.register('F5', () => {
    if (win) win.webContents.reloadIgnoringCache();
  });

  globalShortcut.register('CommandOrControl+Shift+S', async () => {
    if (!win) return;
    win.setFullScreen(false);
    await win.loadFile(path.join(__dirname, 'settings.html'));
  });

  globalShortcut.register('CommandOrControl+Shift+R', () => {
    if (win) win.webContents.reloadIgnoringCache();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  if (powerBlockerId !== null && powerSaveBlocker.isStarted(powerBlockerId)) {
    powerSaveBlocker.stop(powerBlockerId);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
