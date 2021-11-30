const {
  app,
  BrowserWindow,
  globalShortcut,
  screen,
  ipcMain,
} = require("electron");
const { mouse, Point } = require("@nut-tree/nut-js");
const isDev = require("electron-is-dev");

const recordedCursorPositions = [];

const path = require("path");
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.webContents.openDevTools();

  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? "http://localhost:1234"
      : `file://${path.join(__dirname, "../dist/index.html")}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
  return win;
};

const sendUpdatedMousePositions = (win) => {
  win.webContents.send("fromMain", {
    type: "mousePositions",
    payload: JSON.stringify(recordedCursorPositions),
  });
};

app.whenReady().then(() => {
  const win = createWindow();

  globalShortcut.register("CommandOrControl+Shift+R", () => {
    const cursorPosition = screen.getCursorScreenPoint();
    recordedCursorPositions.push(cursorPosition);
    sendUpdatedMousePositions(win);
  });

  ipcMain.on("toMain", (_e, message) => {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type === "deleteAtIndex") {
      recordedCursorPositions.splice(parsedMessage.payload.index, 1);
      sendUpdatedMousePositions(win);
    }
  });

  globalShortcut.register("CommandOrControl+Shift+1", () => {
    console.log("Electron loves M1 shortcuts!");
    mouse.setPosition(
      new Point(recordedCursorPositions[0].x, recordedCursorPositions[0].y)
    );
  });

  globalShortcut.register("CommandOrControl+Shift+2", () => {
    console.log("Electron loves M1 shortcuts!");
    mouse.setPosition(
      new Point(recordedCursorPositions[1].x, recordedCursorPositions[1].y)
    );
  });

  globalShortcut.register("CommandOrControl+Shift+3", () => {
    console.log("Electron loves M1 shortcuts!");
    mouse.setPosition(
      new Point(recordedCursorPositions[2].x, recordedCursorPositions[2].y)
    );
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
