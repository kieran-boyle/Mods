const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => 
{
  const win = new BrowserWindow
  ({
    width: 800,
    height: 600,
    webPreferences: 
    {
      nodeIntegration: true,
      contextIsolation: false,
      nativeWindowOpen: true,
      enableRemoteModule: true,
      sandbox:false,
      nodeIntegrationInSubFrames:true, //for subContent nodeIntegration Enable
      webviewTag:true, //for webView          
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => 
{
    createWindow()
  
    app.on('activate', () => 
    {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => 
{
  if (process.platform !== 'darwin') app.quit()
})
