# 🌌 Complexity Explorer

A web-based interactive platform for exploring, simulating, and understanding complex systems through Cellular Automata (CA) and Agent-Based Models (ABM). 

Complexity Explorer provides an intuitive interface to visualize classic complex systems, experiment with their parameters in real-time, write your own custom simulation rules, and export models to Python or R for further scientific analysis.

## ✨ Features

* **🔬 Cellular Automata (CA) Lab**: Explore grid-based simulations where complex global patterns emerge from simple local rules.
* **🧬 Agent-Based Modeling (ABM) Lab**: Simulate the simultaneous operations and interactions of multiple agents to recreate and predict the appearance of complex phenomena.
* **🛠️ Model Playground**: Write your own custom JavaScript rules for both CA and ABM simulations and watch them execute in real-time on the canvas.
* **💻 Code Export**: Instantly generate and download equivalent Python (NumPy/Matplotlib) and R scripts for any of the pre-built models to run locally or integrate into your data science workflows.
* **🎨 Syntax Highlighting**: Beautifully formatted and colored code exports for easy reading.

## 📚 Available Models

### Cellular Automata
* **Conway's Game of Life**: The classic zero-player game demonstrating cellular evolution.
* **Elementary Rule 30 & 110**: 1D cellular automata known for chaotic behavior and Turing completeness.
* **Langton's Ant**: A universal Turing machine with simple rules that result in complex emergent behavior.
* **WireWorld**: A cellular automaton particularly suited for simulating electronic logic elements.
* **Brian's Brain**: A 3-state cellular automaton that produces patterns resembling neural activity.

### Agent-Based Models
* **Boids Flocking**: Simulates the flocking behavior of birds using cohesion, separation, and alignment.
* **Schelling's Segregation**: Demonstrates how macro-segregation can arise from mild micro-preferences.
* **Sugarscape**: A foundational model of artificial societies and resource gathering.
* **Axelrod's Culture Model**: Explores the dissemination of culture and how local convergence can lead to global polarization.
* **Artificial Stock Market**: Simulates herd behavior and market dynamics among bull and bear traders.
* **Epidemiological SIR Model**: Simulates the spread of an infectious disease (Susceptible, Infected, Recovered) through a population.

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
* [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
* npm (comes with Node.js)

### Installation & Running Locally

1. **Clone the repository** (or download the source code):
   ```bash
   git clone <repository-url>
   cd complexity-explorer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000` (or the port specified in your terminal) to view the application.

## 📖 How to Use

### 1. Exploring Labs (CA & ABM)
* Navigate to the **CA Lab** or **ABM Lab** using the top navigation bar.
* Select a model from the sidebar presets.
* Use the **Run/Halt** button to start or pause the simulation.
* Use the **Reset** button to re-initialize the simulation state.
* Adjust the sliders in the sidebar to change model parameters in real-time (e.g., population size, infection rate, speed).

### 2. Exporting Code
* While in any Lab, scroll down to the **Code Export** section.
* Select your preferred language (**Python** or **R Script**).
* The code will be syntax-highlighted for easy reading.
* Click **Copy Code** to copy it to your clipboard, or **Download** to save it as a `.py` or `.R` file.

### 3. Using the Model Playground
* Navigate to the **Playground**.
* Choose your simulation mode: **Cellular Automata** or **Agent-Based**.
* Write your custom JavaScript logic in the **Rule Editor**.
  * *For CA*: You have access to `state` (current cell state) and `neighbors` (count of active surrounding cells). Return `1` or `0`.
  * *For ABM*: You have access to `agent` (object with x, y, vx, vy) and canvas dimensions. Return an object with new velocities `{ vx, vy }`.
* Click **Run** to see your custom rules come to life on the canvas.

## 🛠️ Tech Stack

* **Frontend Framework**: React 18
* **Build Tool**: Vite
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Code Highlighting**: React Syntax Highlighter
* **Canvas**: Native HTML5 Canvas API

## 📄 License

This project is open-source and available under the MIT License.
