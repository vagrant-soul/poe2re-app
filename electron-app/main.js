const { app, BrowserWindow, globalShortcut, Tray, Menu } = require('electron');  // 添加 Tray 和 Menu 模块
const path = require('path');

let tray = null; // 定义托盘变量
let win = null;  // 定义窗口变量，使其可以在函数外部访问

function createWindow() {
    win = new BrowserWindow({
        width: 920,
        height: 600,
        minWidth: 800,          // 添加最小尺寸限制
        minHeight: 500,
        autoHideMenuBar: true,
        backgroundColor: '#1a1a1a',    // 设置窗口背景色
        hasShadow: true,               // 启用窗口阴影
        thickFrame: true,              // 使用厚边框样式
        titleBarStyle: 'hiddenInset',  // 改进的标题栏样式
        icon: path.join(__dirname, 'icons/icon.png'),
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
    
    // 注册全局快捷键 - 修改为更高优先级的方式
    globalShortcut.unregisterAll(); // 先清除所有已注册的快捷键
    
    // 使用registerAll方法注册多个组合键，提高优先级
    globalShortcut.registerAll(['F5', 'CommandOrControl+F5', 'Alt+F5'], () => {
        if (win) {
            win.show();
            win.focus();
        }
    });
    
    globalShortcut.registerAll(['F6', 'CommandOrControl+F6', 'Alt+F6'], () => {
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
    
    // 添加窗口关闭事件处理
    win.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault();
            win.hide();
            return false;
        }
        return true;
    });
    
    // 添加窗口最小化事件处理
    win.on('minimize', (event) => {
        event.preventDefault();
        win.hide();
    });
    
    // 注释掉开发者工具自动打开
    // win.webContents.openDevTools();  
}

// 创建托盘图标
function createTray() {
    // 使用与应用相同的图标
    const iconPath = path.join(__dirname, 'icons/icon.png');
    tray = new Tray(iconPath);
    
    // 设置托盘图标的提示文本
    tray.setToolTip('流放之路2正则生成工具');
    
    // 创建托盘菜单
    const contextMenu = Menu.buildFromTemplate([
        { 
            label: '显示窗口-F5', 
            click: () => {
                if (win) {
                    win.show();
                    win.focus();
                }
            } 
        },
        { 
            label: '隐藏窗口-F6', 
            click: () => {
                if (win) {
                    win.hide();
                }
            } 
        },
        { type: 'separator' },
        { 
            label: '退出', 
            click: () => {
                app.isQuitting = true;
                app.quit();
            } 
        }
    ]);
    
    // 设置托盘的上下文菜单
    tray.setContextMenu(contextMenu);
    
    // 点击托盘图标时显示窗口
    tray.on('click', () => {
        if (win) {
            win.isVisible() ? win.hide() : win.show();
        }
    });
}

app.whenReady().then(() => {
    createWindow();
    createTray(); // 创建托盘图标
    
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// 添加应用退出时清除快捷键的处理
app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});