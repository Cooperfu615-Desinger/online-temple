# 線上靈籤 (Online Temple) - React Refactor

This project has been refactored from a single HTML file to a standard React application using Vite and Tailwind CSS.

## Project Structure

- `src/components/`: Contains all React components.
  - `DeityCard.jsx`: Card component for selecting a deity.
  - `GameScene.jsx`: The main interactive scene for drawing sticks.
  - `Header.jsx`: The top navigation bar.
  - `ResultModal.jsx`: The modal displaying the fortune result.
  - `SelectionMenu.jsx`: The menu to choose a deity.
- `src/data/`: Contains the fortune data.
  - `fortuneDatabase.js`: The database of poems and explanations.
- `src/App.jsx`: The main application controller.
- `src/index.css`: Global styles and Tailwind directives.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Technologies

- React
- Vite
- Tailwind CSS
