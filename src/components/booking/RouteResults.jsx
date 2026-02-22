/**
 * RouteResults
 * Displays calculated route options and comparisons.
 */
import { useState } from 'react';
import { Clock, ArrowRight, Repeat, ChevronDown, ChevronUp, MapPin, AlertCircle, Map, BarChart3, List } from 'lucide-react';
import { getStationById } from '../../data/metroData';
import './RouteResults.css';

export default function RouteResults({ routes, selectedRoute, onSelectRoute, onConfirm, onViewOnMap, source, destination }) {
    const [expandedAlt, setExpandedAlt] = useState(false);
    const [viewMode, setViewMode] = useState('list');

    if (!routes || routes.length === 0) {
        return (
            <div className="route-results-empty card animate-fade-in">
                <div className="empty-state">
                    <AlertCircle size={48} className="empty-state-icon" />
                    <h3>No Routes Found</h3>
                    <p className="text-secondary">We couldn't find a route between {source?.name} and {destination?.name}. Try different stations.</p>
                </div>
            </div>
        );
    }

    const recommended = routes[0];
    const alternatives = routes.slice(1);
    const maxStops = Math.max(...routes.map(r => r.totalStops));
    const maxDuration = Math.max(...routes.map(r => r.totalDuration));
    const maxFare = Math.max(...routes.map(r => r.fare));
    const maxTransfers = Math.max(...routes.map(r => r.transfers), 1);

    return (
        <div className="route-results stagger-children">
            <div className="route-results-header">
                <h2>Routes Available</h2>
                <div className="route-results-header-right">
                    {routes.length > 1 && (
                        <div className="view-toggle" role="group" aria-label="View mode">
                            <button
                                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                                aria-label="List view"
                                title="List view"
                            >
                                <List size={15} />
                            </button>
                            <button
                                className={`view-toggle-btn ${viewMode === 'compare' ? 'active' : ''}`}
                                onClick={() => setViewMode('compare')}
                                aria-label="Comparison view"
                                title="Compare routes"
                            >
                                <BarChart3 size={15} />
                            </button>
                        </div>
                    )}
                    <span className="chip">{routes.length} {routes.length === 1 ? 'route' : 'routes'} found</span>
                </div>
            </div>

            {}
            {viewMode === 'compare' && routes.length > 1 ? (
                <div className="comparison-view animate-fade-in">
                    {}
                    <div className="comparison-grid" style={{ '--col-count': routes.length }}>
                        {routes.map((route, idx) => (
                            <div
                                key={idx}
                                className={`comparison-col ${selectedRoute === route ? 'comparison-col-selected' : ''}`}
                                onClick={() => onSelectRoute(route)}
                            >
                                {}
                                <div className="comparison-col-header">
                                    <span className="comparison-route-label">
                                        {route.label === "Fastest" ? `★ ${route.label}` : route.label || `Option ${idx + 1}`}
                                    </span>
                                    {selectedRoute === route && (
                                        <span className="badge badge-interchange" style={{ fontSize: '0.6rem' }}>Selected</span>
                                    )}
                                </div>

                                {}
                                <div className="comparison-fare">
                                    <span className="comparison-fare-currency">₹</span>
                                    <span className="comparison-fare-amount">{route.fare}</span>
                                </div>

                                {}
                                <div className="comparison-stats">
                                    <ComparisonBar
                                        icon={<MapPin size={12} />}
                                        label="Stops"
                                        value={route.totalStops}
                                        max={maxStops}
                                        color="var(--info)"
                                        isBest={route.totalStops === Math.min(...routes.map(r => r.totalStops))}
                                    />
                                    <ComparisonBar
                                        icon={<Clock size={12} />}
                                        label="Duration"
                                        value={route.totalDuration}
                                        max={maxDuration}
                                        unit="min"
                                        color="var(--success)"
                                        isBest={route.totalDuration === Math.min(...routes.map(r => r.totalDuration))}
                                    />
                                    <ComparisonBar
                                        icon={<Repeat size={12} />}
                                        label="Transfers"
                                        value={route.transfers}
                                        max={maxTransfers}
                                        color="var(--warning)"
                                        isBest={route.transfers === Math.min(...routes.map(r => r.transfers))}
                                    />
                                </div>

                                {}
                                <div className="comparison-lines">
                                    {route.segments.map((seg, si) => (
                                        <span key={si} className="comparison-line-chip">
                                            <span className="line-dot" style={{ background: seg.lineColor, width: 8, height: 8 }} />
                                            <span className="comparison-line-name">{seg.lineName.replace(' Line', '')}</span>
                                        </span>
                                    ))}
                                </div>

                                {}
                                <button
                                    className={`btn btn-sm ${selectedRoute === route ? 'btn-primary' : 'btn-outline'}`}
                                    style={{ width: '100%', marginTop: 'auto' }}
                                    onClick={(e) => { e.stopPropagation(); onSelectRoute(route); }}
                                >
                                    {selectedRoute === route ? '✓ Selected' : 'Select'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                                <>
                    <RouteCard
                        route={recommended}
                        isRecommended
                        isSelected={selectedRoute === recommended}
                        onSelect={() => onSelectRoute(recommended)}
                    />

                    {alternatives.length > 0 && (
                        <div className="alternatives-section">
                            <button
                                className="alternatives-toggle btn btn-ghost btn-sm"
                                onClick={() => setExpandedAlt(!expandedAlt)}
                            >
                                {expandedAlt ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                {expandedAlt ? 'Hide' : 'Show'} {alternatives.length} alternative{alternatives.length > 1 ? 's' : ''}
                            </button>
                            {expandedAlt && (
                                <div className="alternatives-list stagger-children">
                                    {alternatives.map((route, idx) => (
                                        <RouteCard
                                            key={idx}
                                            route={route}
                                            isSelected={selectedRoute === route}
                                            onSelect={() => onSelectRoute(route)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {selectedRoute && (
                <div className="route-confirm-bar animate-fade-in">
                    <div className="confirm-fare">
                        <span className="confirm-fare-label">Fare</span>
                        <span className="confirm-fare-amount">₹{selectedRoute.fare}</span>
                    </div>
                    <div className="confirm-actions-group">
                        {onViewOnMap && (
                            <button
                                className="btn btn-outline"
                                onClick={() => onViewOnMap(selectedRoute)}
                            >
                                <Map size={16} />
                                View on Map
                            </button>
                        )}
                        <button className="btn btn-primary btn-lg" onClick={onConfirm}>
                            Confirm Booking
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function ComparisonBar({ icon, label, value, max, unit = '', color, isBest }) {
    const pct = max > 0 ? (value / max) * 100 : 0;
    return (
        <div className="comp-bar-row">
            <div className="comp-bar-label">
                {icon}
                <span>{label}</span>
            </div>
            <div className="comp-bar-track">
                <div
                    className="comp-bar-fill"
                    style={{ width: `${pct}%`, background: color }}
                />
            </div>
            <span className={`comp-bar-value ${isBest ? 'comp-bar-best' : ''}`}>
                {value}{unit && ` ${unit}`}
                {isBest && <span className="comp-best-badge">Best</span>}
            </span>
        </div>
    );
}

function RouteCard({ route, isRecommended, isSelected, onSelect }) {
    return (
        <div
            className={`route-card card animate-fade-in ${isSelected ? 'route-card-selected' : ''} ${isRecommended ? 'route-card-recommended' : ''}`}
            onClick={onSelect}
        >
            <div className="route-card-header">
                <div className="route-meta">
                    <div className="route-meta-item">
                        <MapPin size={14} />
                        <span>{route.totalStops} stops</span>
                    </div>
                    <div className="route-meta-item">
                        <Clock size={14} />
                        <span>{route.totalDuration} min</span>
                    </div>
                    {route.transfers > 0 && (
                        <div className="route-meta-item">
                            <Repeat size={14} />
                            <span>{route.transfers} transfer{route.transfers > 1 ? 's' : ''}</span>
                        </div>
                    )}
                </div>
                <div className="route-card-right">
                    {route.label && <span className="badge badge-interchange">{route.label}</span>}
                    <span className="route-fare">₹{route.fare}</span>
                </div>
            </div>

            <div className="route-timeline">
                {route.segments.map((segment, segIdx) => (
                    <div key={segIdx} className="timeline-segment">
                        <div className="segment-header">
                            <span className="segment-line-dot" style={{ background: segment.lineColor }} />
                            <span className="segment-line-name">{segment.lineName}</span>
                            <span className="segment-duration">{segment.duration} min</span>
                        </div>

                        <div className="segment-stops">
                            {segment.stations.map((stop, stopIdx) => {
                                const station = getStationById(stop.stationId);
                                if (!station) return null;
                                const isFirst = stopIdx === 0;
                                const isLast = stopIdx === segment.stations.length - 1;
                                const isTransfer = isLast && segIdx < route.segments.length - 1;

                                return (
                                    <div
                                        key={stop.stationId}
                                        className={`timeline-stop ${isFirst || isLast ? 'timeline-stop-terminal' : ''} ${isTransfer ? 'timeline-stop-transfer' : ''}`}
                                    >
                                        <div className="stop-line" style={{ background: segment.lineColor }} />
                                        <div className="stop-dot" style={{
                                            borderColor: segment.lineColor,
                                            background: isFirst || isLast ? segment.lineColor : 'var(--bg-surface)',
                                        }} />
                                        <span className="stop-name">
                                            {station.name}
                                            {isTransfer && (
                                                <span className="transfer-badge">
                                                    <Repeat size={10} />
                                                    Change to {route.segments[segIdx + 1]?.lineName}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
