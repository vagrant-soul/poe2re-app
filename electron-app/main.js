const { app, BrowserWindow, globalShortcut } = require('electron');  // 添加globalShortcut模块
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 920,
        height: 600,
        minWidth: 800,          // 添加最小尺寸限制
        minHeight: 500,
        autoHideMenuBar: true,
        backgroundColor: '#1a1a1a',    // 设置窗口背景色
        hasShadow: true,               // 启用窗口阴影
        thickFrame: true,              // 使用厚边框样式
        titleBarStyle: 'hiddenInset',  // 改进的标题栏样式
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webSecurity: false  
        }
    });

    // 设置窗口位置居中偏上
    const { width, height } = win.getBounds();
    const { width: screenWidth, height: screenHeight } = require('electron').screen.getPrimaryDisplay().workAreaSize;
    win.setPosition(
        Math.round((screenWidth - width) / 2 + 50),  // 向右偏移50px
        Math.round(screenHeight / 4)                // 垂直位置在1/4处
    );
    
    // 注册全局快捷键
    globalShortcut.register('F5', () => {
        if (win) {
            win.show();
            win.focus();
        }
    });
    
    globalShortcut.register('F6', () => {
        if (win) {
            win.minimize();
        }
    });

    // 移除原有的窗口级快捷键监听代码
    win.loadFile(path.join(__dirname, 'renderer/index.html'));
    
    // 在页面加载完成后注入滚动条样式
    win.webContents.on('did-finish-load', () => {
        win.webContents.insertCSS(`
            ::-webkit-scrollbar {
                width: 8px;
                background-color: rgba(30,30,30,0.1);
            }
            ::-webkit-scrollbar-thumb {
                background-color: #3a3a3a;
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background-color: #4a4a4a;
            }
        `);
    });
    // 注释掉开发者工具自动打开
    // win.webContents.openDevTools();  
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