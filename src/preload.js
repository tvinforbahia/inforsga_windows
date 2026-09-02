const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('painelTV', {
  getConfig: () => ipcRenderer.invoke('get-config'),
  saveConfig: (cfg) => ipcRenderer.invoke('save-config', cfg),
  openSettings: () => ipcRenderer.invoke('open-settings'),
  exitApp: () => ipcRenderer.invoke('exit-app')
});
