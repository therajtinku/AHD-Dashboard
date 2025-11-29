# AHD Performance Dashboard

A modern, interactive dashboard for tracking and visualizing the performance of AHD support agents. Built with React, TypeScript, and Tailwind CSS.

## Features

-   **📊 Interactive Leaderboard**: Sortable table displaying key performance metrics (Chats, SL, FRT, ART, AHT).
-   **🏆 Top Performers Podium**: Visually distinct podium highlighting the top 3 eligible agents.
-   **📅 Weekly & Monthly Views**: Toggle between weekly and monthly performance data.
-   **📈 Unified Aggregation**: Monthly data is automatically aggregated (weighted averages) from weekly records.
-   **📥 Flexible Data Import**:
    -   Upload CSV files directly.
    -   Import from a published Google Sheet CSV URL.
    -   Manual add/edit/delete of agent records.
-   **💾 Local Persistence**: All data is saved securely in your browser's local storage.
-   **🎨 Premium UI**: Polished design with smooth animations, glassmorphism effects, and responsive layout.

## Tech Stack

-   **Framework**: React 18
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Build Tool**: Vite
-   **Icons**: Lucide React

## Getting Started

### Prerequisites

-   Node.js (v16 or higher)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repo-url>
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## CSV Data Format

To import data, your CSV should have the following headers (order doesn't matter):

| Header | Description | Example |
| :--- | :--- | :--- |
| `agentId` | Unique Employee ID | `R552145` |
| `agentName` | Full Name | `John Doe` |
| `role` | Role (Must be 'AHD') | `AHD` |
| `week` | Week Identifier | `2025-W45` |
| `month` | Month Identifier | `2025-11` |
| `numberOfChats` | Total Chats Taken | `98` |
| `slPercentage` | Service Level % | `96.0` |
| `frtSeconds` | First Response Time | `25.0` |
| `artSeconds` | Avg Response Time | `15.0` |
| `ahtMinutes` | Avg Handle Time | `6.0` |
| `imageUrl` | Profile Picture URL | `https://example.com/pic.jpg` |

> **Note**: You can also use `sl`, `frt`, `art`, `aht` as shorthand headers.

## License

© 2025 Raju Goud. All rights reserved.
