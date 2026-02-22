import { useState, useRef, useEffect } from 'react';
import { ArrowDownUp, Search, Clock, ArrowRight } from 'lucide-react';
import { searchStations, getRecentSearches, getStationById } from '../../data/metroData';
import './StationSearch.css';

export default function StationSearch({ source, destination, onSourceChange, onDestinationChange, onSwap, onSearch }) {
    const [sourceQuery, setSourceQuery] = useState(source?.name || '');
    const [destQuery, setDestQuery] = useState(destination?.name || '');
    const [sourceResults, setSourceResults] = useState([]);
    const [destResults, setDestResults] = useState([]);
    const [showSourceDropdown, setShowSourceDropdown] = useState(false);
    const [showDestDropdown, setShowDestDropdown] = useState(false);
    const [isSwapped, setIsSwapped] = useState(false);
    const [showRecent, setShowRecent] = useState(false);
    const sourceRef = useRef(null);
    const destRef = useRef(null);

    useEffect(() => {
        setSourceQuery(source?.name || '');
    }, [source]);

    useEffect(() => {
        setDestQuery(destination?.name || '');
    }, [destination]);

    const handleSourceInput = (val) => {
        setSourceQuery(val);
        if (val.length >= 1) {
            setSourceResults(searchStations(val));
            setShowSourceDropdown(true);
        } else {
            setShowSourceDropdown(false);
        }
    };

    const handleDestInput = (val) => {
        setDestQuery(val);
        if (val.length >= 1) {
            setDestResults(searchStations(val));
            setShowDestDropdown(true);
        } else {
            setShowDestDropdown(false);
        }
    };

    const selectSource = (station) => {
        onSourceChange(station);
        setSourceQuery(station.name);
        setShowSourceDropdown(false);
    };

    const selectDest = (station) => {
        onDestinationChange(station);
        setDestQuery(station.name);
        setShowDestDropdown(false);
    };

    const handleSwap = () => {
        setIsSwapped(!isSwapped);
        onSwap();
    };

    const recentSearches = getRecentSearches();

    const handleRecentSelect = (recent) => {
        const src = getStationById(recent.source);
        const dest = getStationById(recent.destination);
        if (src && dest) {
            onSourceChange(src);
            onDestinationChange(dest);
            setSourceQuery(src.name);
            setDestQuery(dest.name);
        }
        setShowRecent(false);
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (sourceRef.current && !sourceRef.current.contains(e.target)) {
                setShowSourceDropdown(false);
            }
            if (destRef.current && !destRef.current.contains(e.target)) {
                setShowDestDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div className="station-search card">
            <div className="search-fields">
                <div className="search-input-wrapper" ref={sourceRef}>
                    <label className="input-label">From</label>
                    <div className="search-input-container">
                        <Search size={16} className="search-icon" />
                        <input
                            className="input-field search-input"
                            type="text"
                            placeholder="Search source station..."
                            value={sourceQuery}
                            onChange={(e) => handleSourceInput(e.target.value)}
                            onFocus={() => sourceQuery.length >= 1 && setShowSourceDropdown(true)}
                        />
                    </div>
                    {showSourceDropdown && sourceResults.length > 0 && (
                        <div className="search-dropdown animate-fade-in">
                            {sourceResults.map(station => (
                                <button
                                    key={station.id}
                                    className="search-dropdown-item"
                                    onClick={() => selectSource(station)}
                                >
                                    <div className="dropdown-item-left">
                                        <div className="line-dots">
                                            {station.lines.map(l => (
                                                <span key={l.lineId} className="line-dot" style={{ background: l.lineColor }} />
                                            ))}
                                        </div>
                                        <span className="dropdown-item-name">{station.name}</span>
                                    </div>
                                    {station.isInterchange && <span className="badge badge-interchange">Interchange</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    className="swap-btn btn-icon"
                    onClick={handleSwap}
                    title="Swap stations"
                    style={{ transform: isSwapped ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                    <ArrowDownUp size={18} />
                </button>

                <div className="search-input-wrapper" ref={destRef}>
                    <label className="input-label">To</label>
                    <div className="search-input-container">
                        <Search size={16} className="search-icon" />
                        <input
                            className="input-field search-input"
                            type="text"
                            placeholder="Search destination station..."
                            value={destQuery}
                            onChange={(e) => handleDestInput(e.target.value)}
                            onFocus={() => destQuery.length >= 1 && setShowDestDropdown(true)}
                        />
                    </div>
                    {showDestDropdown && destResults.length > 0 && (
                        <div className="search-dropdown animate-fade-in">
                            {destResults.map(station => (
                                <button
                                    key={station.id}
                                    className="search-dropdown-item"
                                    onClick={() => selectDest(station)}
                                >
                                    <div className="dropdown-item-left">
                                        <div className="line-dots">
                                            {station.lines.map(l => (
                                                <span key={l.lineId} className="line-dot" style={{ background: l.lineColor }} />
                                            ))}
                                        </div>
                                        <span className="dropdown-item-name">{station.name}</span>
                                    </div>
                                    {station.isInterchange && <span className="badge badge-interchange">Interchange</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="search-actions">
                {recentSearches.length > 0 && (
                    <div className="recent-searches-wrapper">
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setShowRecent(!showRecent)}
                        >
                            <Clock size={14} />
                            Recent
                        </button>
                        {showRecent && (
                            <div className="recent-dropdown animate-fade-in">
                                {recentSearches.map((r, idx) => {
                                    const src = getStationById(r.source);
                                    const dest = getStationById(r.destination);
                                    if (!src || !dest) return null;
                                    return (
                                        <button key={idx} className="recent-item" onClick={() => handleRecentSelect(r)}>
                                            <span>{src.name}</span>
                                            <ArrowRight size={12} />
                                            <span>{dest.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
                <button
                    className="btn btn-primary btn-lg search-submit-btn"
                    onClick={onSearch}
                    disabled={!source || !destination}
                >
                    <Search size={16} />
                    Find Routes
                </button>
            </div>
        </div>
    );
}
