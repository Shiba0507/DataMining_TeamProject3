# Manga Recommendation System

## Overview

This project is a web-based manga recommendation system. It allows users to receive manga recommendations based on their viewing history and emotional preferences. The application is designed to provide a personalized and engaging experience for manga enthusiasts.

## Features

- **User Viewing History-Based Recommendations:**
  - Suggests manga titles based on a user's past viewing habits.
- **Emotion-Based Recommendations:**
  - Provides manga recommendations tailored to one of five emotions: `Happy`, `Sad`, `Angry`, `Surprised`, and `Funny`.
- **Interactive and User-Friendly Web Interface:**
  - Built with Vite and Node.js for a fast and seamless frontend experience.
- **Efficient API Backend:**
  - Developed with Flask to handle recommendations and data efficiently.

## Technologies Used

### Frontend

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- **Vite:** Build tool for fast and optimized development.
- **Node.js:** For managing dependencies and frontend logic.

### Backend

- **Flask:** Lightweight Python web framework to create APIs.
- **Recommendation Algorithm:** Custom logic based on user history and emotions.

## Installation

### Prerequisites

- Node.js and npm
- Python 3.x
- Flask framework

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/Shiba0507/DataMining_TeamProject3
   cd DataMining_TeamProject3
   ```

2. Set up the backend:

   ```bash
   cd DataMining_TeamProject3
   python app.py
   ```

3. Set up the frontend:

   ````
   install nodejs
   bash
   npm create vite@latest
   y
   ProjectName: <YourFileFolder>
   SelectFrameWork: React
   Select a variant: JS
   ```bash
   cd DataMining_TeamProject3
   npm install
   npm run dev
   ````

4. Open your browser and navigate to the local server

## Usage

1. Enter your user preferences or history on the website.
2. Select an emotion from the options provided (`Happy`, `Sad`, `Angry`, `Surprised`, `Funny`).
3. Receive manga recommendations tailored to your inputs.

## Recommendation Algorithm

- **History-Based Recommendation:**
  - Analyzes user's previously viewed manga titles to identify similar genres and recommend accordingly.
- **Emotion-Based Recommendation:**
  - Maps user-selected emotions to predefined manga genres and provides tailored suggestions.

## Contributing

Contributions are welcome! Feel free to fork the repository, make changes, and submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Enjoy exploring new manga titles with our recommendation system! For any questions or feedback, feel free to open an issue or contact the project maintainers.
