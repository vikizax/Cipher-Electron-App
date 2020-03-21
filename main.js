const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const { ipcMain } = require("electron");
if (process.env.NODE_ENV === "developement") {
  require("electron-reload")(__dirname);
}

let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1024,
    height: 720,
    minWidth: 500,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true
    },
    icon: __dirname + "/app-ico.png"
  });

  // and load the index.html of the app.
  win.loadFile(path.join(__dirname, "src/index.html"));

  if (process.env.NODE_ENV === "development") {
    // // Open the DevTools.
    win.webContents.openDevTools();
  }
  Menu.setApplicationMenu(null);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("showAlert", (event, msg, type) => {
  msg = typeof msg !== "string" ? "Ops Something really wrong ! 😩" : msg;
  const { dialog } = require("electron");
  type = type ? type : "info";
  dialog.showMessageBox(win, {
    title: "Cipher",
    message: msg,
    type: type
  });
});
