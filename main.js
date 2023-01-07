// main.js

// electron 模块可以用来控制应用的生命周期和创建原生浏览窗口
const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron')
const path = require('path')

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}

const createWindow = () => {
  // 创建浏览窗口
  const mainWindow = new BrowserWindow({
    width: 1800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sanbox: true,
      contextIsolation: true,
      webSecurity: true,
    }
  })

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
      {
        click: () => mainWindow.webContents.send('update-counter', 1),
        label: 'Increment',
      },
      {
        click: () => mainWindow.webContents.send('update-counter', -1),
        label: 'Decrement',
      }
      ]
    }

  ])

  ipcMain.handle('ping', () => 'pong')
  Menu.setApplicationMenu(menu)
  // 加载本地 index.html
  mainWindow.loadFile('index.html')
  // 加载远程 html
  // mainWindow.loadURL('https://google.com')

  // 打开开发工具
  mainWindow.webContents.openDevTools()
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)

  ipcMain.on('counter-value', (_event, value) => {
    console.log(value) // will print value to Node console
  })

  createWindow()

  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态, 
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
  // Electron 目前只支持三个平台：win32 (Windows), linux (Linux) 和 darwin (macOS) 。
  if (process.platform !== 'darwin') app.quit()
})

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。