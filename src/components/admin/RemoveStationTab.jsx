/**
 * RemoveStationTab
 * Dedicated admin interface for removing stations from the metro network.
 */
import { useState, useMemo } from 'react';
import { Trash2, Search, MapPin, AlertTriangle } from 'lucide-react';
import { useAdminData } from './AdminContext';
import { useMetroData } from '../../data/MetroDataContext';
import { useToast } from '../ui/Toast';
import './RemoveStationTab.css';

export default function RemoveStationTab() {
    const { lines, setLines } = useAdminData();
    const { removeStationFromNetwork } = useMetroData();
    const toast = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [lineFilter, setLineFilter] = useState(null); // null = all lines
    const [confirmingId, setConfirmingId] = useState(null);

    // Build a deduplicated station list with their line memberships
    const allStations = useMemo(() => {
        const stationMap = {};
        lines.forEach(line => {
            line.stations.forEach(station => {
                if (!stationMap[station.id]) {
                    stationMap[station.id] = {
                        id: station.id,
                        name: station.name,
                        lines: [],
                    };
                }
                stationMap[station.id].lines.push({
                    lineId: line.id,
                    lineName: line.name,
                    lineColor: line.color,
                });
            });
        });
        return Object.values(stationMap).sort((a, b) => a.name.localeCompare(b.name));
    }, [lines]);

    // Filter stations by search query and line filter
    const filteredStations = useMemo(() => {
        let result = allStations;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(s =>
                s.name.toLowerCase().includes(q) || s.id.includes(q)
            );
        }

        if (lineFilter) {
            result = result.filter(s =>
                s.lines.some(l => l.lineId === lineFilter)
            );
        }

        return result;
    }, [allStations, searchQuery, lineFilter]);

    const handleRemoveStation = (stationId, stationName) => {
        removeStationFromNetwork(stationId);
        setConfirmingId(null);
        toast.success(`Removed "${stationName}" from the network.`);
    };

    const toggleLineFilter = (lineId) => {
        setLineFilter(prev => (prev === lineId ? null : lineId));
    };

    return (
        <div className="remove-station-tab animate-fade-in">
            <div className="card remove-station-card">
                <div className="card-header">
                    <h2><MapPin size={20} /> Remove Station</h2>
                    <p className="text-secondary">Search for and remove stations from the metro network.</p>
                </div>

                <div className="remove-search-bar">
                    <Search size={18} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                    <input
                        className="input-field"
                        placeholder="Search by station name or ID…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="remove-filter-chips">
                    {lines.map(line => (
                        <button
                            key={line.id}
                            className={`filter-chip ${lineFilter === line.id ? 'active' : ''}`}
                            style={lineFilter === line.id ? { background: line.color, borderColor: line.color } : {}}
                            onClick={() => toggleLineFilter(line.id)}
                        >
                            <span className="line-dot" style={{ background: line.color }} />
                            {line.name}
                        </button>
                    ))}
                </div>

                <p className="remove-station-count">
                    {filteredStations.length} station{filteredStations.length !== 1 ? 's' : ''} found
                </p>

                <div className="station-results-list">
                    {filteredStations.length === 0 && (
                        <div className="empty-state" style={{ padding: '2rem' }}>
                            <Search size={32} className="empty-state-icon" />
                            <p>No stations match your search.</p>
                        </div>
                    )}

                    {filteredStations.map(station => (
                        <div key={station.id}>
                            <div className="station-result-row">
                                <div className="station-result-info">
                                    <span className="station-result-name">{station.name}</span>
                                    <div className="station-result-lines">
                                        {station.lines.map(l => (
                                            <span
                                                key={l.lineId}
                                                className="station-line-tag"
                                                style={{ background: l.lineColor }}
                                            >
                                                {l.lineName}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="station-result-actions">
                                    {station.lines.length > 1 && (
                                        <span className="badge badge-interchange" style={{ marginRight: '0.25rem' }}>
                                            <AlertTriangle size={10} />
                                            Interchange
                                        </span>
                                    )}
                                    <button
                                        className="btn-danger"
                                        onClick={() => setConfirmingId(
                                            confirmingId === station.id ? null : station.id
                                        )}
                                    >
                                        <Trash2 size={14} />
                                        Remove
                                    </button>
                                </div>
                            </div>

                            {confirmingId === station.id && (
                                <div className="confirm-overlay">
                                    <AlertTriangle size={18} style={{ color: '#E65100', flexShrink: 0 }} />
                                    <span>
                                        Remove <strong>{station.name}</strong> from{' '}
                                        {station.lines.length === 1
                                            ? station.lines[0].lineName
                                            : `all ${station.lines.length} lines`
                                        }?
                                    </span>
                                    <button
                                        className="btn-confirm-danger"
                                        onClick={() => handleRemoveStation(station.id, station.name)}
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        className="btn-confirm-cancel"
                                        onClick={() => setConfirmingId(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
