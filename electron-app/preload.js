const { contextBridge, ipcRenderer } = require('electron');

// 将 electron API 暴露给渲染进程
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel, ...args) => {
      // 白名单通道
      const validChannels = ['check-for-updates'];
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, ...args);
      }
      return Promise.reject(new Error(`未授权的 IPC 通道: ${channel}`));
    }
  }
});