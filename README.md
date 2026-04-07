# Forbidden Lands Character Sheet & Manager

A modern, mobile-optimized character manager and dice roller for the **Forbidden Lands** tabletop RPG.

![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 Features

- **Character Management**: Track Attributes, Skills, and Critical Injuries.
- **Inventory & Equipment**: Manage items with weight (Encumbrance) tracking.
- **Interactive Dice Roller**: Dedicated roller for Base, Skill, and Gear dice.
- **Comprehensive Database**: Browse through Talents and Spells (Druid & Sorcerer).
- **Mobile-First Design**: Optimized for mobile devices with safe-area support, built with React and Capacitor.
- **Dark Mode**: High-contrast dark theme designed for gaming sessions.

## 🛠 Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Mobile Wrapper**: [Capacitor](https://capacitorjs.com/)
- **Data Processing**: Node.js scripts for converting raw RPG data into the application.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository.
2. Navigate to the core application folder:
   ```bash
   cd zz-denik
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server with hot-reload:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Mobile

The project uses Capacitor to target Android and iOS.

- **Android**: `npx cap open android`
- **iOS**: `npx cap open ios`

## 📂 Project Structure

- `zz-denik/src/`: React source code and application logic.
- `zz-denik/public/`: Static assets.
- `zz-denik/scripts/`: Utility scripts for data conversion (CSV to JSON, Spell extraction).
- `android/`: Android native project.
- `ios/`: iOS native project.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Acknowledgments

Based on the **Forbidden Lands** (Zapovězené země) RPG system by Free League Publishing.
