/**
 * App
 * Main application router and layout.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import Navbar from './components/layout/Navbar';
import PageTransition from './components/layout/PageTransition';
import BookingPage from './pages/BookingPage';
import MapPage from './pages/MapPage';
import AdminPage from './pages/AdminPage';
import FareChartPage from './pages/FareChartPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="app-layout">
          <Navbar />
          <main className="app-main" id="main-content">
            <PageTransition>
              <Routes>
                <Route path="/" element={<BookingPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/fares" element={<FareChartPage />} />
                <Route path="/admin/*" element={<AdminPage />} />
              </Routes>
            </PageTransition>
          </main>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
