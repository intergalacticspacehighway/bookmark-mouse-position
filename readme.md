## Bookmark mouse locations

Save mouse positions using a shortcut key and quickly traverse to them using another shortcut key.

### Current shortcut keys

- To save mouse location -

  - macOS: `cmd+shift+r`
  - windows/linux: `ctrl+shift+r`

- To traverse mouse location -
  - macOS: `cmd+shift+1`, `cmd+shift+2`, `cmd+shift+3`
  - windows/linux: `ctrl+shift+1`, `ctrl+shift+2`, `ctrl+shift+3`

### Why?

- This makes it easier to traverse mouse location in multiple display monitors.
- I found it useful.

### Install dependencies

```
npm i
```

### To run locally

```
// To bundle react app and start parcel server
npm run parcel
// To start electron app
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

### Read more on building electron app

https://www.electronjs.org/docs/latest/tutorial/quick-start#package-and-distribute-your-application

**NOTE**

Might require Node 16+
