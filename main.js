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

// cmd+alt+'
const BOOKMARK_KEY = "CommandOrControl+Alt+'";

// cmd+alt+1
const NUMBER_KEY = "CommandOrControl+Alt+";

// cmd+alt+e
const TOGGLE_KEY = "CommandOrControl+Alt+E";

// Handles persisting, sending updated store to renderer (react-app)
const getStore = (win) => {
  let data;
  let currentIndex = null;
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
    setCurrentIndex: (nextIndex) => {
      currentIndex = nextIndex;
    },
    getCurrentIndex: () => {
      return currentIndex;
    },
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

  globalShortcut.register(BOOKMARK_KEY, () => {
    const cursorPosition = screen.getCursorScreenPoint();
    if (storeAPI.length() < 10) {
      storeAPI.push(cursorPosition);
    }
  });

  ipcMain.on("toMain", (_e, message) => {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type === "deleteAtIndex") {
      storeAPI.deleteAtIndex(parsedMessage.payload.index);
    }
  });

  // Attach listeners for 9 number keys
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].forEach((n) => {
    globalShortcut.register(NUMBER_KEY + n, () => {
      const nextIndex = n === 0 ? 9 : n - 1;
      if (typeof storeAPI.get(nextIndex) !== "undefined") {
        storeAPI.setCurrentIndex(nextIndex);
        mouse.setPosition(
          new Point(
            storeAPI.get(storeAPI.getCurrentIndex()).x,
            storeAPI.get(storeAPI.getCurrentIndex()).y
          )
        );
      }
    });
  });

  globalShortcut.register(TOGGLE_KEY, () => {
    if (storeAPI.getCurrentIndex() === null) {
      storeAPI.setCurrentIndex(0);
    } else {
      storeAPI.setCurrentIndex(
        (storeAPI.getCurrentIndex() + 1) % storeAPI.length()
      );
    }

    mouse.setPosition(
      new Point(
        storeAPI.get(storeAPI.getCurrentIndex()).x,
        storeAPI.get(storeAPI.getCurrentIndex()).y
      )
    );
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
