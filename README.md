# Palazzo Mobile

A real state cross-platform mobile app built with Ionic and TypeScript. This repository contains the mobile client for "Palazzo" — an Ionic application intended for iOS and Android using Capacitor.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup (local development)](#setup-local-development)
- [Running in the browser (dev)](#running-in-the-browser-dev)
- [Running on device / emulator (Android & iOS)](#running-on-device--emulator-android--ios)

---

## Tech stack

- Ionic Framework
- Capacitor
- TypeScript
- Node.js / npm (or yarn)
- Web tooling (ESLint, Prettier)
- Android Studio (for Android builds)
- Xcode (for iOS builds)

---

## Prerequisites

- Node.js (LTS recommended, e.g. 18+)
- npm (or yarn)
- Ionic CLI: ```npm i -g @ionic/cli```
- Capacitor CLI: ```npm i -g @capacitor/cli```
- Android Studio (for Android builds & emulators)
- Xcode (for iOS builds — macOS only)

---

## Setup (local development)

1. Clone the repository
```cmd
git clone https://github.com/AlexandreTonin/palazzo-mobile.git
```
```cmd
cd palazzo-mobile
```

3. Install dependencies
```cmd
npm install
```

---

## Running in the browser (dev)

Ionic provides a local dev server with live-reload:

```cmd
ionic serve
```

This opens a browser preview. Note: native plugins will be stubbed in the browser; to test native features, run on a device/emulator.

If using npm scripts:
```cmd
npm run start
```

---

## Running on device / emulator (Android & iOS)

This project is set up with Capacitor. Typical workflow:

1. Build the web assets
```cmd
or: ionic build
```

3. Add or update native platforms (only once per platform)
```cmd
npx cap add android
```
```cmd
npx cap add ios
```

5. Sync web assets & plugins to native projects
```cmd
npx cap sync
```

7. Open native IDE

- Android
```cmd
npx cap open android
```
  - Build/run from Android Studio (select emulator or device)
  - Or from CLI: ```npx cap run android -l --external```

- iOS (macOS only)
  ```cmd
    npx cap open ios
  ```
  - Build/run from Xcode (select simulator or device)
  ```cmd
  ionic capacitor run ios -l --external
  ```
