/**
 * AddStationTab
 * Dedicated admin form for creating new stations globally.
 */
import { useState } from 'react';
import { Plus, Check, MapPin } from 'lucide-react';
import { useAdminData } from './AdminContext';
import { useToast } from '../ui/Toast';
import './AddStationTab.css';

export default function AddStationTab() {
    const { lines, setLines } = useAdminData();
    const toast = useToast();

    const [stationName, setStationName] = useState('');
    const [stationId, setStationId] = useState('');
    const [selectedLines, setSelectedLines] = useState({});
    // Example: { yellow: 'end', blue: 'after:noida-sector-15' }
    const [insertPositions, setInsertPositions] = useState({});

    const handleNameChange = (e) => {
        const val = e.target.value;
        setStationName(val);
        setStationId(val.trim().toLowerCase().replace(/\s+/g, '-'));
    };

    const toggleLineSelection = (lineId) => {
        setSelectedLines(prev => {
            const next = { ...prev };
            if (next[lineId]) {
                delete next[lineId];

                const pos = { ...insertPositions };
                delete pos[lineId];
                setInsertPositions(pos);
            } else {
                next[lineId] = true;
                setInsertPositions(p => ({ ...p, [lineId]: 'end' }));
            }
            return next;
        });
    };

    const handlePositionChange = (lineId, pos) => {
        setInsertPositions(prev => ({ ...prev, [lineId]: pos }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!stationName.trim() || !stationId.trim()) {
            toast.error('Station name and ID are required.');
            return;
        }

        const selectedLineIds = Object.keys(selectedLines).filter(id => selectedLines[id]);
        if (selectedLineIds.length === 0) {
            toast.error('Please select at least one line.');
            return;
        }

        // Check if ID already exists on any SELECTED line
        const existsOnSelected = selectedLineIds.some(lineId =>
            lines.find(l => l.id === lineId)?.stations.some(s => s.id === stationId)
        );

        if (existsOnSelected) {
            toast.error('Station already exists on one of the selected lines.');
            return;
        }

        const isInterchange = selectedLineIds.length > 1;

        // Apply changes
        const newLines = lines.map(line => {
            if (!selectedLines[line.id]) {
                // Not selected for insertion, but check if we need to update interchange status
                // if it already exists here (from previous saves)
                const alreadyHasIt = line.stations.some(s => s.id === stationId);
                if (alreadyHasIt && isInterchange) {
                    return {
                        ...line,
                        stations: line.stations.map(s => s.id === stationId ? { ...s, isInterchange: true } : s)
                    };
                }
                return line;
            }

            const newStationObject = {
                id: stationId,
                name: stationName.trim(),
                isInterchange: isInterchange || lines.some(l => l.id !== line.id && l.stations.some(s => s.id === stationId))
            };

            const stations = [...line.stations];
            const pos = insertPositions[line.id];

            if (pos === 'end') {
                stations.push(newStationObject);
            } else if (pos.startsWith('after:')) {
                const afterId = pos.split(':')[1];
                const targetIdx = stations.findIndex(s => s.id === afterId);
                if (targetIdx !== -1) {
                    stations.splice(targetIdx + 1, 0, newStationObject);
                } else {
                    stations.push(newStationObject);
                }
            } else if (pos === 'start') {
                stations.unshift(newStationObject);
            }

            return { ...line, stations };
        });

        setLines(newLines);
        toast.success(`Successfully added ${stationName.trim()} to network!`);

        // Reset form
        setStationName('');
        setStationId('');
        setSelectedLines({});
        setInsertPositions({});
    };

    const getInsertOptions = (lineId) => {
        const line = lines.find(l => l.id === lineId);
        if (!line) return [];
        return [
            { value: 'end', label: 'Append to end' },
            { value: 'start', label: 'Prepend to start' },
            ...line.stations.map(s => ({
                value: `after:${s.id}`,
                label: `Insert after ${s.name}`
            }))
        ];
    };

    return (
        <div className="add-station-tab animate-fade-in">
            <div className="card add-station-card">
                <div className="card-header">
                    <h2><MapPin size={20} /> Deploy New Station</h2>
                    <p className="text-secondary">Configure a new physical station and plot its position on the network.</p>
                </div>

                <form className="add-station-form-grid" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Station Name</label>
                        <input
                            className="input-field"
                            placeholder="e.g. Anand Vihar ISBT"
                            value={stationName}
                            onChange={handleNameChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Generated ID</label>
                        <input
                            className="input-field id-field"
                            value={stationId}
                            onChange={(e) => setStationId(e.target.value)}
                            readOnly
                        />
                        <span className="help-text">Internal identifier (auto-generated)</span>
                    </div>

                    <div className="divider" style={{ gridColumn: '1 / -1', margin: '1rem 0' }} />

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Network Integration (Select Lines & Positions)</label>
                        <div className="lines-selection-grid">
                            {lines.map(line => (
                                <div key={line.id} className={`line-selection-row ${selectedLines[line.id] ? 'selected' : ''}`}>
                                    <label className="checkbox-label line-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={!!selectedLines[line.id]}
                                            onChange={() => toggleLineSelection(line.id)}
                                        />
                                        <span className="line-dot" style={{ background: line.color }} />
                                        {line.name}
                                    </label>

                                    {selectedLines[line.id] && (
                                        <select
                                            className="input-field select-sm animate-fade-in"
                                            value={insertPositions[line.id] || 'end'}
                                            onChange={(e) => handlePositionChange(line.id, e.target.value)}
                                        >
                                            {getInsertOptions(line.id).map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
                        <button type="submit" className="btn btn-primary btn-lg">
                            <Plus size={18} />
                            Deploy Station
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
