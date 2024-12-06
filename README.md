
# **Phaser Capacitor Template**

This repository provides a template for building Phaser games using Vite, TypeScript, Capacitor, and Biome. It is designed to support web and Android platforms with a streamlined setup.

---

## **Features**
- **Phaser 3** for game development.
- **Vite** for fast development and build tooling.
- **TypeScript** for type safety and modern JavaScript features.
- **Capacitor** for building native Android apps.
- **Biome** for linting and code formatting.

---

## **Getting Started**

### **Prerequisites**
Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 16.x or later is recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Android Studio](https://developer.android.com/studio) (for Android platform)

---

### **Installation**
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## **Development**

### **Run the Development Server**
Start the development server to test your game in the browser:
```bash
npm run dev
```
This will launch the game at `http://localhost:3000`.

---

## **Build for Production**

To create a production build of your game:
```bash
npm run build
```
The build files will be output to the `dist/` directory.

---

## **Android Setup**

To set up the Android platform, follow these steps:

1. Add the Android platform:
   ```bash
   npm run install:android
   ```

2. Open the Android project in Android Studio:
   ```bash
   npx cap open android
   ```

3. Build and run the app on an emulator or physical device from Android Studio.

---

## **Scripts**

Here are the available npm scripts for this project:

| Command             | Description                                                        |
|---------------------|--------------------------------------------------------------------|
| `npm run dev`       | Starts the development server.                                     |
| `npm run build`     | Builds the game for production.                                    |
| `npm run serve`     | Serves the production build locally.                               |
| `npm run lint`      | Runs Biome to check code quality.                                  |
| `npm run lint:fix`  | Runs Biome to fix linting issues.                                  |
| `npm run install:android` | Adds Android platform, builds web assets, and syncs with Capacitor. |

---

## **Folder Structure**

```
project-folder/
├── android/            # Android native platform (generated by Capacitor)
├── src/                # Source code
│   ├── assets/         # Game assets (images, sounds, etc.)
│   ├── scenes/         # Game scenes
│   ├── main.ts         # Entry point
│   └── index.html      # HTML file
├── dist/               # Production build output (generated by Vite)
├── capacitor.config.ts # Capacitor configuration
├── package.json        # Project configuration and scripts
├── vite.config.ts      # Vite configuration
└── .gitignore          # Ignored files and folders
```

---

## **Technologies Used**

- **Phaser 3**: Game development framework.
- **Vite**: Fast development server and bundler.
- **TypeScript**: Adds type safety and modern JavaScript features.
- **Capacitor**: Native runtime for Android and iOS.
- **Biome**: Linter and code formatter.

---

## **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add feature-name'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

---

## **License**

This project is licensed under the [MIT License](LICENSE).

---

## **Support**

If you encounter any issues, feel free to open an issue in the repository or contact the maintainer.
