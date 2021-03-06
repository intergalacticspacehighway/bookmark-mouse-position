## Bookmark mouse position

Save mouse positions using a shortcut key and quickly traverse to them using another shortcut key.

<br />

https://user-images.githubusercontent.com/23293248/144154421-ac103144-acd5-43aa-9372-42e123a911bd.mp4

<br />

### Current shortcut keys

- To save mouse position -

  - macOS: `cmd+shift+r`
  - windows/linux: `ctrl+shift+r`

- To traverse mouse position -
  - macOS: `cmd+shift+1`, `cmd+shift+2`, `cmd+shift+3`
  - windows/linux: `ctrl+shift+1`, `ctrl+shift+2`, `ctrl+shift+3`

### Downloads

- macOS - <a href="https://github.com/intergalacticspacehighway/bookmark-mouse-position/releases/download/v1/Bookmark.mouse.position.dmg" download>Download latest dmg</a>

- Windows - N/A (I don't have a windows system. Need help!)

- Linux - N/A (I don't have a linux system. Need help!)

### Why?

- This makes it easier to traverse mouse position in multiple display monitors.
- [I found it useful](https://twitter.com/nishanbende/status/1465791430312398862)

## Develop

### Folder/file structure

- main.js contains the electron app entry point.
- src/index.js contains browser renderer entry point. This is a react app.
- No webpack or complicated bundler setup, we're using parcel 🎉

### Install dependencies

```
npm i
```

### To run locally

```
// 1. Bundle react app and start parcel server
npm run parcel
// 2. Start electron app
npm start
```

### To build

```
// 1. Bundle react app
npm run bundle
// 2. Build electron app
npm run make
```

- Build will be generated in out/

## Enable permissions to the app

- You'll need to enable `Accessibility` and `Input Monitoring` permissions for the app as shown below.
  ![macos security and permissions](/permissions.png)

### Read more on building electron app

https://www.electronjs.org/docs/latest/tutorial/quick-start#package-and-distribute-your-application

**NOTE**

Might require Node 16+

### Todo

- Better shortcut keys!
- Make a non electron version to reduce the app size.
  If someone has any ideas, please let me know!
