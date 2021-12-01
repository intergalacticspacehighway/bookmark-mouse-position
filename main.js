const {
  app,
  BrowserWindow,
  globalShortcut,
  screen,
  ipcMain,
} = require("electron");
const path = require("path");
const { mouse, Point } = require("@nut-tree/nut-js");
const isDev = require("electron-is-dev");
const fs = require("fs");

const STORE_FILE = path.join(__dirname, "saved-data.json");

// Handles persisting, sending updated store to renderer (react-app)
const getStore = (win) => {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(STORE_FILE));
  } catch (e) {
    data = [];
    fs.writeFileSync(STORE_FILE, JSON.stringify(data));
  }

  const sendUpdatedMousePoisitionsToRenderer = () => {
    win.webContents.send("fromMain", {
      type: "mousePositions",
      payload: JSON.stringify(data),
    });
  };

  // send last saved positions when the renderer (react-app) is mounted. This is a listener
  ipcMain.on("toMain", (_e, message) => {
    if (JSON.parse(message).type === "mounted") {
      sendUpdatedMousePoisitionsToRenderer();
    }
  });

  return {
    push: (value) => {
      data.push(value);
      fs.writeFileSync(STORE_FILE, JSON.stringify(data));
      sendUpdatedMousePoisitionsToRenderer();
    },
    deleteAtIndex: (index) => {
      data.splice(index, 1);
      fs.writeFileSync(STORE_FILE, JSON.stringify(data));
      sendUpdatedMousePoisitionsToRenderer();
    },
    get: (index) => {
      return data[index];
    },
    length: () => data.length,
  };
};

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

  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? "http://localhost:1234"
      : `file://${path.join(__dirname, "dist", "index.html")}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools();
  }
  return win;
};

app.whenReady().then(() => {
  const win = createWindow();
  const storeAPI = getStore(win);

  globalShortcut.register("CommandOrControl+Shift+R", () => {
    const cursorPosition = screen.getCursorScreenPoint();
    if (storeAPI.length() < 4) {
      storeAPI.push(cursorPosition);
    }
  });

  ipcMain.on("toMain", (_e, message) => {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type === "deleteAtIndex") {
      storeAPI.deleteAtIndex(parsedMessage.payload.index);
    }
  });

  globalShortcut.register("CommandOrControl+Shift+1", () => {
    if (storeAPI.length() >= 1)
      mouse.setPosition(new Point(storeAPI.get(0).x, storeAPI.get(0).y));
  });

  globalShortcut.register("CommandOrControl+Shift+2", () => {
    if (storeAPI.length() >= 2)
      mouse.setPosition(new Point(storeAPI.get(1).x, storeAPI.get(1).y));
  });

  globalShortcut.register("CommandOrControl+Shift+3", () => {
    if (storeAPI.length() >= 3)
      mouse.setPosition(new Point(storeAPI.get(2).x, storeAPI.get(2).y));
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
