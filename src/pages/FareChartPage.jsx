import { useState, useCallback } from 'react';
import { IndianRupee, Calculator, Clock, CreditCard, Info, Zap } from 'lucide-react';
import { searchStations, findRoutes, getStationById } from '../data/metroData';
import './FareChartPage.css';

const FARE_TIERS = [
    { tier: 1, stops: '1 – 2', fare: 10, color: '#4CAF50', bg: '#E8F5E9', label: 'Short Hop' },
    { tier: 2, stops: '3 – 5', fare: 20, color: '#2196F3', bg: '#E3F2FD', label: 'Local' },
    { tier: 3, stops: '6 – 12', fare: 30, color: '#FF9800', bg: '#FFF3E0', label: 'Mid Range' },
    { tier: 4, stops: '13 – 21', fare: 40, color: '#AB47BC', bg: '#F3E5F5', label: 'Long Distance' },
    { tier: 5, stops: '22+', fare: 50, color: '#EF5350', bg: '#FFEBEE', label: 'Full Network' },
];

export default function FareChartPage() {
    const [fromQuery, setFromQuery] = useState('');
    const [toQuery, setToQuery] = useState('');
    const [fromStation, setFromStation] = useState(null);
    const [toStation, setToStation] = useState(null);
    const [fromResults, setFromResults] = useState([]);
    const [toResults, setToResults] = useState([]);
    const [calcResult, setCalcResult] = useState(null);

    const handleFromChange = useCallback((e) => {
        const q = e.target.value;
        setFromQuery(q);
        setFromStation(null);
        setCalcResult(null);
        setFromResults(q.length >= 2 ? searchStations(q).slice(0, 5) : []);
    }, []);

    const handleToChange = useCallback((e) => {
        const q = e.target.value;
        setToQuery(q);
        setToStation(null);
        setCalcResult(null);
        setToResults(q.length >= 2 ? searchStations(q).slice(0, 5) : []);
    }, []);

    const selectFrom = (station) => {
        setFromStation(station);
        setFromQuery(station.name);
        setFromResults([]);
    };

    const selectTo = (station) => {
        setToStation(station);
        setToQuery(station.name);
        setToResults([]);
    };

    const calculateFare = useCallback(() => {
        if (!fromStation || !toStation) return;
        const routes = findRoutes(fromStation.id, toStation.id);
        if (routes.length > 0) {
            const best = routes[0];
            setCalcResult({
                fare: best.fare,
                stops: best.totalStops,
                duration: best.totalDuration,
                transfers: best.transfers,
            });
        } else {
            setCalcResult({ error: true });
        }
    }, [fromStation, toStation]);

    return (
        <div className="fare-chart-page">
            <div className="fare-chart-header">
                <h1>Fare Chart</h1>
                <p>Metro fares are distance-based, calculated by the number of stations traveled</p>
            </div>

            {/* Fare Tiers Table */}
            <div className="card fare-table-card animate-fade-in">
                <table className="fare-table" role="table" aria-label="Fare tiers by number of stops">
                    <thead>
                        <tr>
                            <th scope="col">Tier</th>
                            <th scope="col">Stations</th>
                            <th scope="col">Fare</th>
                            <th scope="col">Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        {FARE_TIERS.map(tier => (
                            <tr key={tier.tier}>
                                <td>
                                    <span
                                        className="fare-tier-badge"
                                        style={{ background: tier.bg, color: tier.color }}
                                    >
                                        <span className="tier-dot" style={{ background: tier.color }} />
                                        {tier.label}
                                    </span>
                                </td>
                                <td className="fare-stops">{tier.stops} stops</td>
                                <td>
                                    <span className="fare-amount">
                                        <span className="currency">₹</span>{tier.fare}
                                    </span>
                                </td>
                                <td className="fare-stops">
                                    {tier.tier === 1 && 'Rajiv Chowk → Patel Chowk'}
                                    {tier.tier === 2 && 'New Delhi → Mandi House'}
                                    {tier.tier === 3 && 'Kashmere Gate → Hauz Khas'}
                                    {tier.tier === 4 && 'Rithala → Rajiv Chowk'}
                                    {tier.tier === 5 && 'Rithala → Noida Electronic City'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Fare Calculator */}
            <div className="card fare-calculator-card animate-fade-in" style={{ animationDelay: '100ms' }}>
                <h3>
                    <Calculator size={18} />
                    Fare Calculator
                </h3>
                <div className="fare-calc-form">
                    <div className="input-group" style={{ position: 'relative' }}>
                        <label className="input-label" htmlFor="fare-from">From</label>
                        <input
                            id="fare-from"
                            className="input-field"
                            placeholder="Source station..."
                            value={fromQuery}
                            onChange={handleFromChange}
                            autoComplete="off"
                        />
                        {fromResults.length > 0 && (
                            <div className="map-search-dropdown" style={{
                                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                                background: '#fff', borderRadius: 'var(--radius-md)',
                                boxShadow: 'var(--shadow-lg)', maxHeight: 200, overflowY: 'auto',
                            }}>
                                {fromResults.map(s => (
                                    <div key={s.id}
                                        className="map-search-result"
                                        onClick={() => selectFrom(s)}
                                        style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '0.875rem' }}
                                        onMouseOver={e => e.currentTarget.style.background = 'var(--bg-surface-variant)'}
                                        onMouseOut={e => e.currentTarget.style.background = ''}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            {s.lines.map(l => (
                                                <span key={l.lineId} className="line-dot"
                                                    style={{ background: l.lineColor, width: 8, height: 8 }} />
                                            ))}
                                            {s.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="input-group" style={{ position: 'relative' }}>
                        <label className="input-label" htmlFor="fare-to">To</label>
                        <input
                            id="fare-to"
                            className="input-field"
                            placeholder="Destination station..."
                            value={toQuery}
                            onChange={handleToChange}
                            autoComplete="off"
                        />
                        {toResults.length > 0 && (
                            <div className="map-search-dropdown" style={{
                                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                                background: '#fff', borderRadius: 'var(--radius-md)',
                                boxShadow: 'var(--shadow-lg)', maxHeight: 200, overflowY: 'auto',
                            }}>
                                {toResults.map(s => (
                                    <div key={s.id}
                                        className="map-search-result"
                                        onClick={() => selectTo(s)}
                                        style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '0.875rem' }}
                                        onMouseOver={e => e.currentTarget.style.background = 'var(--bg-surface-variant)'}
                                        onMouseOut={e => e.currentTarget.style.background = ''}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            {s.lines.map(l => (
                                                <span key={l.lineId} className="line-dot"
                                                    style={{ background: l.lineColor, width: 8, height: 8 }} />
                                            ))}
                                            {s.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={calculateFare}
                        disabled={!fromStation || !toStation}
                        style={{ height: 42, minWidth: 140 }}
                    >
                        <IndianRupee size={16} />
                        Calculate
                    </button>
                </div>

                {calcResult && !calcResult.error && (
                    <div className="fare-calc-result">
                        <span className="fare-calc-result-amount">₹{calcResult.fare}</span>
                        <div className="fare-calc-result-details">
                            <strong>{fromStation.name} → {toStation.name}</strong>
                            <span>{calcResult.stops} stops · ~{calcResult.duration} min · {calcResult.transfers} transfer{calcResult.transfers !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                )}

                {calcResult?.error && (
                    <div className="fare-calc-result" style={{ color: 'var(--error)' }}>
                        No route found between these stations
                    </div>
                )}
            </div>

            {/* Info Cards */}
            <div className="fare-info-grid animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="card fare-info-card">
                    <div className="fare-info-icon" style={{ background: '#4CAF50' }}>
                        <CreditCard size={18} />
                    </div>
                    <div>
                        <h4>Smart Card Discount</h4>
                        <p>Get 10% off on every trip when using a rechargeable Metro Smart Card</p>
                    </div>
                </div>

                <div className="card fare-info-card">
                    <div className="fare-info-icon" style={{ background: '#2196F3' }}>
                        <Clock size={18} />
                    </div>
                    <div>
                        <h4>Off-Peak Hours</h4>
                        <p>Travel between 11 AM – 4 PM for reduced crowding and comfortable journeys</p>
                    </div>
                </div>

                <div className="card fare-info-card">
                    <div className="fare-info-icon" style={{ background: '#FF9800' }}>
                        <Zap size={18} />
                    </div>
                    <div>
                        <h4>Tourist Pass</h4>
                        <p>Unlimited rides for ₹200/day or ₹500/3-days across the entire metro network</p>
                    </div>
                </div>

                <div className="card fare-info-card">
                    <div className="fare-info-icon" style={{ background: '#AB47BC' }}>
                        <Info size={18} />
                    </div>
                    <div>
                        <h4>Concessions</h4>
                        <p>Senior citizens, students, and differently-abled passengers get special fare concessions</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
