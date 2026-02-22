/**
 * App
 * Main application router and layout.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider, useAuth } from './components/auth/AuthContext';
import Navbar from './components/layout/Navbar';
import PageTransition from './components/layout/PageTransition';
import BookingPage from './pages/BookingPage';
import MapPage from './pages/MapPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import FareChartPage from './pages/FareChartPage';
import { Navigate, useLocation } from 'react-router-dom';
import './App.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null; // Or a spinner

  if (!isAuthenticated) {
    // Redirect to login, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <div className="app-layout">
            <Navbar />
            <main className="app-main" id="main-content">
              <PageTransition>
                <Routes>
                  <Route path="/" element={<BookingPage />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/fares" element={<FareChartPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/admin/*" element={
                    <ProtectedRoute>
                      <AdminPage />
                    </ProtectedRoute>
                  } />
                </Routes>
              </PageTransition>
            </main>
          </div>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
