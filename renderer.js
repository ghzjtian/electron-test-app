const information = document.getElementById('info')
information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`

// 单向通讯
const func = async () => {
  const response = await window.versions.ping()
  console.log(response);  // 会在 electron 应用的 console 中打印出来.
}

func()

// 双向通讯
const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')

btn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFile()
  filePathElement.innerText = filePath
})

// 主进程到渲染器进程通讯.
const counter = document.getElementById('counter')
window.electronAPI.handleCounter((event, value) => {
    const oldValue = Number(counter.innerText)
    const newValue = oldValue + value
    counter.innerText = newValue
    event.sender.send('counter-value', newValue)
})
