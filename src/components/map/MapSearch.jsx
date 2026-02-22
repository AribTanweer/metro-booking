import { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { searchStations } from '../../data/metroData';
import './MapSearch.css';

export default function MapSearch({ onStationSelect }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (query.length >= 1) {
            const matches = searchStations(query);
            setResults(matches);
        } else {
            setResults([]);
        }
    }, [query]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSelect = (station) => {
        onStationSelect?.(station);
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
        inputRef.current?.focus();
    };

    return (
        <div className="map-search" ref={wrapperRef}>
            <div className={`map-search-input-wrapper ${isOpen ? 'map-search-open' : ''}`}>
                <Search size={16} className="map-search-icon" />
                <input
                    ref={inputRef}
                    type="text"
                    className="map-search-input"
                    placeholder="Search stations..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
                {query && (
                    <button className="map-search-clear" onClick={handleClear}>
                        <X size={14} />
                    </button>
                )}
            </div>

            {isOpen && results.length > 0 && (
                <div className="map-search-dropdown">
                    {results.map(station => (
                        <button
                            key={station.id}
                            className="map-search-result"
                            onClick={() => handleSelect(station)}
                        >
                            <MapPin size={14} className="result-pin" />
                            <div className="result-info">
                                <span className="result-name">{station.name}</span>
                                <div className="result-lines">
                                    {station.lines.map(l => (
                                        <span
                                            key={l.lineId}
                                            className="line-dot"
                                            style={{ background: l.lineColor }}
                                        />
                                    ))}
                                </div>
                            </div>
                            {station.isInterchange && (
                                <span className="result-badge">interchange</span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {isOpen && query.length >= 1 && results.length === 0 && (
                <div className="map-search-dropdown">
                    <div className="map-search-empty">No stations found</div>
                </div>
            )}
        </div>
    );
}
