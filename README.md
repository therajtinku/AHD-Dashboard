# AHD Performance Dashboard

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

A modern, interactive dashboard designed to track, visualize, and optimize the performance of AHD support agents. Built with a focus on usability, aesthetics, and real-time data insights.

---

## Project Goal

The primary goal of the **AHD Performance Dashboard** is to empower team leads and stakeholders with a transparent, data-driven view of support operations. By consolidating metrics like **Service Level (SL)**, **First Response Time (FRT)**, and **Average Handle Time (AHT)** into a unified interface, this project aims to:

*   **Identify Top Talent**: Automatically highlight high-performing agents with a dynamic podium system.
*   **Track Trends**: Visualize performance over weeks and months to spot improvement areas.
*   **Simplify Reporting**: Replace manual spreadsheet crunching with automated aggregation and easy CSV imports.

---

## 🎥 Project Demo

Watch the full demo of the application in action:

[![Watch the Demo](https://img.shields.io/badge/Watch_Demo_Video-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/posts/rajugoud_customersupport-dashboard-cfbr-activity-7402554850045259776-5LvY?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAADdLS24B0nSrvU5qnuMNfab9WCU_bJN8Gcg)

> **Note**: Click the badge above to view the demo on LinkedIn.

---

## 📸 Dashboard Preview

![Dashboard Preview](public/dashboard-preview.png)

---

## ✨ Features

*   **📊 Interactive Leaderboard**: Deeply sortable table displaying critical KPIs (Chats, SL, FRT, ART, AHT).
*   **🏆 Top Performers Podium**: A visually distinct, animated podium showcasing the top 3 eligible agents.
*   **📅 Time-Based Filtering**: Seamlessly toggle between weekly breakdowns and monthly aggregated views.
*   **📈 Smart Aggregation**: Monthly data is automatically calculated using weighted averages for accuracy.
*   **📥 Robust Data Import**:
    *   **Drag-and-Drop CSV**: Effortless file uploads.
    *   **URL Import**: Connect directly to published Google Sheets.
    *   **CRUD Operations**: Manually add, edit, or delete agent records on the fly.
*   **💾 Persistent Storage**: Secure, local browser storage ensures data is never lost on refresh.

---

## 🛠️ Tech Stack

*   **Framework**: [React 18](https://reactjs.org/)
*   **Language**: [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

*   **Node.js** (v16 or higher)
*   **npm** or **yarn**

### Installation

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd performance
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

    The app will typically run at `http://localhost:5173`.

---

## 📄 CSV Data Format

To import data effectively, ensure your CSV file matches the following schema. The order of columns does not matter.

| Header | Description | Example |
| :--- | :--- | :--- |
| `agentId` | Unique Employee ID | `R552145` |
| `agentName` | Full Name | `Tinku` |
| `role` | Role (Must be 'AHD') | `AHD` |
| `week` | Week Identifier (ISO Format) | `2025-W45` |
| `month` | Month Identifier (YYYY-MM) | `2025-11` |
| `numberOfChats` | Total Chats Taken | `98` |
| `slPercentage` | Service Level % | `96.0` |
| `frtSeconds` | First Response Time (s) | `25.0` |
| `artSeconds` | Avg Response Time (s) | `15.0` |
| `ahtMinutes` | Avg Handle Time (min) | `6.0` |
| `imageUrl` | Profile Picture URL (Optional) | `https://example.com/pic.jpg` |

> **Note**: You can also use shorthand headers: `sl`, `frt`, `art`, `aht`.
