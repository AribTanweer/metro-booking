# MetroBook

A modern web application for metro route planning and fare calculation. Built with React and Vite.

## Features

- **Route Planning:** Finds the best routes using a Dijkstra algorithm with realistic time weights and transfer penalties.
- **Interactive Map:** Visualizes the entire metro network with zoom, pan, and interactive station selection.
- **Route Comparison:** View multiple route options side-by-side to compare time, stops, and fares.
- **Fare Calculator:** Check ticket prices across different station combinations.
- **Responsive Design:** Optimized for mobile, tablet, and desktop devices.
- **Accessibility:** Fully supports keyboard navigation and respects reduced-motion preferences.

## Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## Building for Production

To create a production-optimized build:

```bash
npm run build
```

This will generate the built assets in the `dist` directory, ready to be deployed to any static hosting service (e.g., GitHub Pages, Vercel, Netlify).

To preview the production build locally:
```bash
npm run preview
```

## Technologies

- React 18
- Vite
- React Router DOM
- Vanilla CSS
- Lucide React (Icons)
