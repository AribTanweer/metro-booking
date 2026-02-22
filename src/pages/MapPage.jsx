/**
 * MapPage
 * Interactive map viewer page.
 */
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MetroMap from '../components/map/MetroMap';
import MapSearch from '../components/map/MapSearch';
import StationPanel from '../components/map/StationPanel';
import { useToast } from '../components/ui/Toast';
import './MapPage.css';

export default function MapPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useToast();
    const [selectedStation, setSelectedStation] = useState(null);
    const [highlightRoute, setHighlightRoute] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);
    const [focusedStation, setFocusedStation] = useState(null);
    const [bookingSource, setBookingSource] = useState(null);
    useEffect(() => {
        if (location.state?.highlightedRoute) {
            setHighlightRoute(location.state.highlightedRoute);
            setRouteInfo({
                source: location.state.source,
                destination: location.state.destination,
                route: location.state.highlightedRoute,
            });
            window.history.replaceState({}, '');
        }
    }, [location.state]);

    const handleClearHighlight = () => {
        setHighlightRoute(null);
        setRouteInfo(null);
    };

    const handleSearchSelect = useCallback((station) => {
        setFocusedStation(station);
        setSelectedStation(station);
        toast.info(`Showing ${station.name}`);
    }, [toast]);

    const handleStationClick = useCallback((station) => {
        if (bookingSource) {
            // User selected destination
            if (station.id === bookingSource.id) {
                toast.error("Destination must be different from source");
                return;
            }
            navigate('/', { state: { source: bookingSource, destination: station } });
        } else {
            setSelectedStation(station);
        }
    }, [bookingSource, navigate, toast]);

    const handleBookFromMap = useCallback((station) => {
        setBookingSource(station);
        setSelectedStation(null); // hide panel to let user click the map
        toast.info(`Select destination station on the map`);
    }, [toast]);

    const handleCancelBookingMode = () => {
        setBookingSource(null);
    };

    return (
        <div className="map-page">
            <div className="map-container">
                <MetroMap
                    onStationClick={handleStationClick}
                    highlightedRoute={highlightRoute}
                    focusedStation={focusedStation}
                />
            </div>

            { }
            <MapSearch onStationSelect={handleSearchSelect} />

            { }
            {routeInfo && (
                <div className="map-route-banner animate-fade-in">
                    <div className="banner-info">
                        <span className="banner-label">Showing route</span>
                        <span className="banner-route">
                            {routeInfo.source?.name} → {routeInfo.destination?.name}
                        </span>
                        <span className="banner-meta">
                            {routeInfo.route.totalStops} stops · {routeInfo.route.totalDuration} min · ₹{routeInfo.route.fare}
                        </span>
                    </div>
                    <div className="banner-actions">
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => navigate('/', {
                                state: {
                                    source: routeInfo.source,
                                    destination: routeInfo.destination,
                                }
                            })}
                        >
                            <ArrowLeft size={14} />
                            Back to Booking
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={handleClearHighlight}>
                            Clear
                        </button>
                    </div>
                </div>
            )}

            {bookingSource && !routeInfo && (
                <div className="map-route-banner animate-fade-in" style={{ borderColor: 'var(--primary)', borderLeft: '4px solid var(--primary)' }}>
                    <div className="banner-info">
                        <span className="banner-label" style={{ color: 'var(--primary)' }}>Booking Mode</span>
                        <span className="banner-route">
                            From: {bookingSource.name}
                        </span>
                        <span className="banner-meta">
                            Please select a destination station on the map...
                        </span>
                    </div>
                    <div className="banner-actions">
                        <button className="btn btn-outline btn-sm" onClick={handleCancelBookingMode}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {selectedStation && !bookingSource && (
                <StationPanel
                    station={selectedStation}
                    onClose={() => setSelectedStation(null)}
                    onBookFrom={handleBookFromMap}
                />
            )}
        </div>
    );
}
