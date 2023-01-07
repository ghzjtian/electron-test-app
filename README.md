# Electron


## 参考
* [Electron](https://www.electronjs.org/zh/)



## 记录
* 要发布个签名的应用到 app store, 需要个苹果开发者帐号.(没有也可以，不过首次运行时会有个安全提醒)
* 因为打包的机器只能打包该系统的程序，所以可以试试用 [github Action](https://docs.github.com/zh/actions/quickstart) 去打包所有平台的包, (但签名证书要怎么解决???) 

## 日记
### 进程间通讯
* 单向: 
```
// main.js
ipcMain.on('set-title', handleSetTitle)

// preload.js
contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title)
})

// renderer.js
window.electronAPI.setTitle(title)
```

* 双向
```
// main.js
ipcMain.handle('dialog:openFile', handleFileOpen)

// preload.js
contextBridge.exposeInMainWorld('electronAPI',{
  openFile: () => ipcRenderer.invoke('dialog:openFile')
})

// renderer.js
const filePath = await window.electronAPI.openFile()

```