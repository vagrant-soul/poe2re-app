interface Window {
  electron?: {
    ipcRenderer: {
      invoke(channel: string, ...args: any[]): Promise<any>;
    }
  }
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

export {};