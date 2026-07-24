# FlagIt - Personal Interactive Activity Map

A browser-based interactive workout tracker built as part of Jonas Schmedtmann's JavaScript course on Udemy. Users can log running and cycling workouts by clicking directly on a map, with each entry pinned to its exact location and persisted across sessions.

## Features

- **Interactive Map** - Click anywhere on the map to open the workout entry form at that location.
- **Workout Types** - Log either a running or cycling workout with type-specific input fields.
- **Running Metrics** - Record distance, duration, and cadence; pace is calculated automatically.
- **Cycling Metrics** - Record distance, duration, and elevation gain; speed is calculated automatically.
- **Map Markers** - Each saved workout is pinned to the map with a descriptive popup.
- **Workout List** - All workouts are listed in the sidebar with their key stats displayed.
- **Navigate to Workout** - Click any workout in the sidebar to pan the map back to its marker.
- **Local Storage** - All workouts persist across page reloads using the browser's localStorage.
- **Geolocation** - The map loads centered on the user's current position on startup.

## Demo

🔗 [Live Demo on Netlify](https://myflagit.netlify.app/)

## Tech Stack

- **HTML5** - Structure & Content
- **CSS3** - Styling & Layout
- **JavaScript (ES6+)** - Application Logic, OOP, & DOM Manipulation
- **Leaflet.js** - Interactive Map Rendering
- **Geolocation API** - User Position Detection
- **localStorage API** - Client-Side Data Persistence
- **Netlify** - Hosting & Deployment

## Course Reference

This project was built as part of:
📚 [The Complete JavaScript Course 2025 — Jonas Schmedtmann](https://www.udemy.com/course/the-complete-javascript-course/)

## Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/Balsha98/Repository-FlagIt.git
```

Navigate to the project directory:

```bash
cd Repository-FlagIt/flag-it
```

Open the project in your browser:

```bash
# Simply open index.html in your preferred browser,
# or use a local server like Live Server in VS Code.
```

## Usage

1. **Allow Location Access**: Grant the browser permission to detect your position on startup.
2. **Click the Map**: Click any point on the map to open the workout form in the sidebar.
3. **Select Workout Type**: Choose between Running and Cycling from the dropdown.
4. **Fill In Details**: Enter distance, duration, and the type-specific field (cadence or elevation).
5. **Submit**: Press Enter to save the workout, pin it to the map, and add it to the sidebar list.
6. **Navigate**: Click any workout in the sidebar to pan and zoom the map to its marker.
7. **Reload**: All logged workouts are automatically restored from localStorage on the next visit.

## Project Structure

```
Repository-FlagIt/
│
├── flag-it/                  # Main application directory.
│   │
│   ├── assets/             # Assets directory.
│   │   │
│   │   ├── css/            # Styling.
│   │   │
│   │   ├── javascript/     # Application logic & class architecture.
│   │   │
│   │   └── media/          # Icons and UI assets.
│   │
│   └── index.html          # Main application page.
│
└── README.md               # Project documentation.
```

## How It Works

The application is structured around ES6 classes and runs entirely in the browser:

- A `Workout` parent class holds shared properties (coordinates, distance, duration, date, description), with `Running` and `Cycling` subclasses extending it to handle type-specific metric calculations (pace and speed respectively).
- The `App` class manages the full application lifecycle — initialising the Leaflet map via the **Geolocation API**, handling map click events, rendering markers and sidebar entries, and coordinating localStorage reads and writes.
- Workouts are serialised to JSON and saved to **localStorage** on every submission. On page load, stored entries are deserialised, their class prototypes are restored, and they are re-rendered to both the map and the sidebar.
- Clicking a sidebar entry calls `setView()` on the Leaflet map instance to smoothly pan and zoom to the corresponding marker's coordinates.

## Let's Connect

If you enjoyed this project or have any questions, feel free to reach out!

[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)](https://bazovich.dev)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:balsa.bazovic@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/balsha-bazovic)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Balsha98)

⭐ If you found this project helpful, please consider giving it a star!

## License

Personal project - all rights reserved.
