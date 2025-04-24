const { app, BrowserWindow, globalShortcut, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
const https = require('https');

// 添加应用启动时间记录
console.time('app-startup');

let tray = null;
let win = null;

// 预先定义菜单模板，避免每次创建托盘时重新生成
const contextMenuTemplate = [
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
];

function createWindow() {
    // 使用更轻量级的窗口配置
    win = new BrowserWindow({
        width: 920,
        height: 600,
        minWidth: 800,
        minHeight: 500,
        autoHideMenuBar: true,
        backgroundColor: '#1a1a1a',
        // 减少不必要的窗口特性
        hasShadow: true,
        thickFrame: true,
        titleBarStyle: 'hiddenInset',
        icon: path.join(__dirname, 'icons/app.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,  // 启用上下文隔离
            enableRemoteModule: false,
            webSecurity: true,
            preload: path.join(__dirname, 'preload.js')  // 添加预加载脚本
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
        // 使用setTimeout延迟注入非关键CSS
        setTimeout(() => {
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
        }, 100);
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
    const iconPath = path.join(__dirname, 'icons/app.ico');
    tray = new Tray(iconPath);
    tray.setToolTip('POE2词缀助手');
    
    // 使用预定义的菜单模板
    const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);
    tray.setContextMenu(contextMenu);
    
    // 点击托盘图标时显示窗口
    tray.on('click', () => {
        if (win) {
            win.isVisible() ? win.hide() : win.show();
        }
    });
}

// 使用app.whenReady()的Promise特性优化启动流程
app.whenReady().then(() => {
    // 并行创建窗口和托盘
    Promise.all([
        new Promise(resolve => {
            createWindow();
            resolve();
        }),
        new Promise(resolve => {
            createTray();
            resolve();
        })
    ]).then(() => {
        console.log('应用已启动');
    });
    
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

// 添加 IPC 处理程序
ipcMain.handle('check-for-updates', async () => {
  return new Promise((resolve, reject) => {
    const req = https.get('https://cnb.cool/vagrant_soul/poe2-app-update/-/git/raw/main/updata.txt', (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`请求失败，状态码: ${res.statusCode}`));
        return;
      }
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          // 简单解析版本信息，可以根据实际格式调整
          const versionMatch = data.match(/version:\s*([^\s]+)/i);
          if (versionMatch && versionMatch[1]) {
            resolve(versionMatch[1]);
          } else {
            reject(new Error('无法解析版本信息'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });
  });
});