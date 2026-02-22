/**
 * LineManager
 * Metro line management interface.
 */
import { useState } from 'react';
import { ChevronDown, ChevronRight, GripVertical, X, AlertTriangle } from 'lucide-react';
import { useAdminData } from './AdminContext';
import './LineManager.css';

export default function LineManager() {
    const { lines, setLines } = useAdminData();
    const [expandedLine, setExpandedLine] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverItem, setDragOverItem] = useState(null);

    const toggleLine = (lineId) => {
        setExpandedLine(expandedLine === lineId ? null : lineId);
    };
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
        setLines(lines.map(line => {
            if (line.id !== lineId) return line;
            const newStations = line.stations.filter((_, i) => i !== stationIndex);
            return { ...line, stations: newStations };
        }));
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
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
