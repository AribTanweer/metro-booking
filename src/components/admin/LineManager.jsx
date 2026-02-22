import { useState } from 'react';
import { ChevronDown, ChevronRight, GripVertical, Plus, X, AlertTriangle } from 'lucide-react';
import { METRO_LINES, STATIONS } from '../../data/metroData';
import './LineManager.css';

export default function LineManager() {
    const [lines, setLines] = useState(() => {
        return Object.entries(METRO_LINES).map(([id, line]) => ({
            ...line,
            id,
            stations: line.stations.map(sId => ({
                id: sId,
                name: STATIONS[sId]?.name || sId,
                isInterchange: STATIONS[sId]?.isInterchange || false,
            })),
        }));
    });

    const [expandedLine, setExpandedLine] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverItem, setDragOverItem] = useState(null);
    const [newStationInput, setNewStationInput] = useState('');
    const [addingToLine, setAddingToLine] = useState(null);

    const toggleLine = (lineId) => {
        setExpandedLine(expandedLine === lineId ? null : lineId);
    };

    // Drag and drop handlers
    const handleDragStart = (lineId, index) => {
        setDraggedItem({ lineId, index });
    };

    const handleDragOver = (e, lineId, index) => {
        e.preventDefault();
        setDragOverItem({ lineId, index });
    };

    const handleDrop = (lineId, dropIndex) => {
        if (!draggedItem || draggedItem.lineId !== lineId) return;

        setLines(prev => prev.map(line => {
            if (line.id !== lineId) return line;
            const newStations = [...line.stations];
            const [removed] = newStations.splice(draggedItem.index, 1);
            newStations.splice(dropIndex, 0, removed);
            return { ...line, stations: newStations };
        }));

        setDraggedItem(null);
        setDragOverItem(null);
    };

    const removeStation = (lineId, stationIndex) => {
        setLines(prev => prev.map(line => {
            if (line.id !== lineId) return line;
            const newStations = line.stations.filter((_, i) => i !== stationIndex);
            return { ...line, stations: newStations };
        }));
    };

    const addStation = (lineId) => {
        if (!newStationInput.trim()) return;
        const stationId = newStationInput.toLowerCase().replace(/\s+/g, '-');
        const name = newStationInput.trim();

        // Check if this station exists on other lines (auto-detect interchange)
        const existsOnOtherLine = lines.some(
            l => l.id !== lineId && l.stations.some(s => s.id === stationId)
        );

        setLines(prev => prev.map(line => {
            if (line.id !== lineId) return line;
            return {
                ...line,
                stations: [...line.stations, {
                    id: stationId,
                    name,
                    isInterchange: existsOnOtherLine,
                }],
            };
        }));

        // If it exists on another line, mark it as interchange there too
        if (existsOnOtherLine) {
            setLines(prev => prev.map(line => ({
                ...line,
                stations: line.stations.map(s =>
                    s.id === stationId ? { ...s, isInterchange: true } : s
                ),
            })));
        }

        setNewStationInput('');
        setAddingToLine(null);
    };

    return (
        <div className="line-manager animate-fade-in">
            {lines.map(line => (
                <div key={line.id} className="line-card card">
                    <div className="line-card-header" onClick={() => toggleLine(line.id)}>
                        <div className="line-card-left">
                            <span className="line-dot line-dot-lg" style={{ background: line.color }} />
                            <span className="line-card-name">{line.name}</span>
                            <span className="chip">{line.stations.length} stations</span>
                        </div>
                        {expandedLine === line.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </div>

                    {expandedLine === line.id && (
                        <div className="line-stations-list animate-fade-in">
                            <div className="divider" />
                            {line.stations.map((station, index) => (
                                <div
                                    key={`${station.id}-${index}`}
                                    className={`station-row ${dragOverItem?.lineId === line.id && dragOverItem?.index === index
                                            ? 'station-row-dragover'
                                            : ''
                                        }`}
                                    draggable
                                    onDragStart={() => handleDragStart(line.id, index)}
                                    onDragOver={(e) => handleDragOver(e, line.id, index)}
                                    onDrop={() => handleDrop(line.id, index)}
                                    onDragEnd={() => { setDraggedItem(null); setDragOverItem(null); }}
                                >
                                    <GripVertical size={14} className="drag-handle" />
                                    <span className="station-index">{index + 1}</span>
                                    <span className="station-row-name">{station.name}</span>
                                    {station.isInterchange && (
                                        <span className="badge badge-interchange">
                                            <AlertTriangle size={10} />
                                            Interchange
                                        </span>
                                    )}
                                    <button
                                        className="btn-icon btn-sm remove-station-btn"
                                        onClick={() => removeStation(line.id, index)}
                                        title="Remove station"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}

                            {/* Add station */}
                            {addingToLine === line.id ? (
                                <div className="add-station-form">
                                    <input
                                        className="input-field"
                                        placeholder="Station name..."
                                        value={newStationInput}
                                        onChange={(e) => setNewStationInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addStation(line.id)}
                                        autoFocus
                                    />
                                    <button className="btn btn-primary btn-sm" onClick={() => addStation(line.id)}>
                                        Add
                                    </button>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setAddingToLine(null)}>
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="btn btn-ghost btn-sm add-station-btn"
                                    onClick={() => setAddingToLine(line.id)}
                                >
                                    <Plus size={14} />
                                    Add Station
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
