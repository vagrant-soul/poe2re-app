const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    // 创建浏览器窗口
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webSecurity: false  // 添加此项解决本地文件加载安全限制
        }
    });

    // 加载 React 项目的 build 文件夹中的 index.html 文件
    win.loadFile(path.join(__dirname, 'renderer/index.html'));
    win.webContents.openDevTools();  // 添加开发者工具便于调试
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});