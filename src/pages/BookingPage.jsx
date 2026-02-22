/**
 * BookingPage
 * UI component for the Metro Booking application.
 */
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StationSearch from '../components/booking/StationSearch';
import RouteResults from '../components/booking/RouteResults';
import BookingConfirmation from '../components/booking/BookingConfirmation';
import { RouteResultsSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { findRoutes, saveRecentSearch, getStationById, generateBookingRef } from '../data/metroData';
import './BookingPage.css';

export default function BookingPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useToast();
    const [source, setSource] = useState(null);
    const [destination, setDestination] = useState(null);
    const [routes, setRoutes] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [booking, setBooking] = useState(null);
    const [step, setStep] = useState('search');
    const [isSearching, setIsSearching] = useState(false);
    useEffect(() => {
        const navState = location.state;
        if (navState?.source) {
            setSource(navState.source);
        }
        if (navState?.destination) {
            setDestination(navState.destination);
        }
        const saved = sessionStorage.getItem('bookingState');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSource(parsed.source);
                setDestination(parsed.destination);
                setRoutes(parsed.routes);
                setSelectedRoute(parsed.selectedRoute);
                setStep(parsed.step || 'results');
            } catch (e) {  }
            sessionStorage.removeItem('bookingState');
        }
        if (navState?.source || navState?.destination) {
            window.history.replaceState({}, '');
        }
    }, []);

    const handleSearch = () => {
        if (!source || !destination) return;
        setIsSearching(true);
        setStep('loading');
        setTimeout(() => {
            const results = findRoutes(source.id, destination.id);
            setRoutes(results);
            setIsSearching(false);
            setStep('results');
            saveRecentSearch(source.id, destination.id);
            if (results.length > 0) {
                toast.info(`${results.length} route${results.length > 1 ? 's' : ''} found`);
            } else {
                toast.error('No routes found between these stations');
            }
        }, 800);
    };

    const handleSwap = () => {
        const temp = source;
        setSource(destination);
        setDestination(temp);
    };

    const handleSelectRoute = (route) => {
        setSelectedRoute(route);
    };

    const handleConfirmBooking = () => {
        const ref = generateBookingRef();
        setBooking({
            ref,
            source: getStationById(source.id),
            destination: getStationById(destination.id),
            route: selectedRoute,
            timestamp: new Date().toISOString(),
            qrData: `METROBOOK:${ref}:${source.id}:${destination.id}:${Date.now()}`,
        });
        setStep('confirmation');
        toast.success(`Booking confirmed! Ref: ${ref}`);
    };

    const handleNewBooking = () => {
        setSource(null);
        setDestination(null);
        setRoutes(null);
        setSelectedRoute(null);
        setBooking(null);
        setStep('search');
    };

    const handleBackToResults = () => {
        setSelectedRoute(null);
        setBooking(null);
        setStep('results');
    };

    const handleViewOnMap = (route) => {
        sessionStorage.setItem('bookingState', JSON.stringify({
            source, destination, routes, selectedRoute: route, step: 'results',
        }));
        navigate('/map', { state: { highlightedRoute: route, source, destination } });
    };

    return (
        <div className="booking-page">
            <div className="booking-page-header">
                <h1>Book Your Journey</h1>
                <p className="text-secondary">Search stations and find the best route</p>
            </div>

            {(step === 'search' || step === 'loading') && (
                <div className="animate-fade-in">
                    <StationSearch
                        source={source}
                        destination={destination}
                        onSourceChange={setSource}
                        onDestinationChange={setDestination}
                        onSwap={handleSwap}
                        onSearch={handleSearch}
                        isLoading={isSearching}
                    />
                </div>
            )}

            {step === 'loading' && (
                <div className="animate-fade-in">
                    <RouteResultsSkeleton />
                </div>
            )}

            {step === 'results' && (
                <div className="animate-fade-in">
                    <StationSearch
                        source={source}
                        destination={destination}
                        onSourceChange={setSource}
                        onDestinationChange={setDestination}
                        onSwap={handleSwap}
                        onSearch={handleSearch}
                    />
                    <RouteResults
                        routes={routes}
                        selectedRoute={selectedRoute}
                        onSelectRoute={handleSelectRoute}
                        onConfirm={handleConfirmBooking}
                        onViewOnMap={handleViewOnMap}
                        source={source}
                        destination={destination}
                    />
                </div>
            )}

            {step === 'confirmation' && booking && (
                <div className="animate-fade-in-up">
                    <BookingConfirmation
                        booking={booking}
                        onNewBooking={handleNewBooking}
                        onBack={handleBackToResults}
                    />
                </div>
            )}
        </div>
    );
}
