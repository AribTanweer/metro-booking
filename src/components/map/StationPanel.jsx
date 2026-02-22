import { useNavigate } from 'react-router-dom';
import { X, MapPin, ArrowRight, Accessibility, Car, DoorOpen, ChevronRight } from 'lucide-react';
import './StationPanel.css';

const FACILITY_ICONS = {
    accessibility: { icon: Accessibility, label: 'Accessible' },
    parking: { icon: Car, label: 'Parking' },
    elevator: { icon: ChevronRight, label: 'Elevator' },
    exits: { icon: DoorOpen, label: 'Multiple Exits' },
};

export default function StationPanel({ station, onClose }) {
    const navigate = useNavigate();

    const handleBookFrom = () => {
        navigate('/', { state: { source: station } });
    };

    const handleBookTo = () => {
        navigate('/', { state: { destination: station } });
    };

    return (
        <div className="station-panel animate-slide-right">
            <div className="panel-header">
                <div>
                    <h3>{station.name}</h3>
                    {station.isInterchange && (
                        <span className="badge badge-interchange" style={{ marginTop: 4 }}>Interchange Station</span>
                    )}
                </div>
                <button className="btn-icon" onClick={onClose}>
                    <X size={18} />
                </button>
            </div>

            <div className="divider" />

            <div className="panel-section">
                <span className="panel-section-title">Lines</span>
                <div className="panel-lines">
                    {station.lines.map(l => (
                        <div key={l.lineId} className="panel-line-item">
                            <span className="line-dot line-dot-lg" style={{ background: l.lineColor }} />
                            <span>{l.lineName}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="divider" />

            <div className="panel-section">
                <span className="panel-section-title">Facilities</span>
                <div className="panel-facilities">
                    {station.facilities.map(fac => {
                        const info = FACILITY_ICONS[fac];
                        if (!info) return null;
                        const Icon = info.icon;
                        return (
                            <div key={fac} className="facility-item">
                                <Icon size={16} />
                                <span>{info.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="divider" />

            <div className="panel-actions">
                <button className="btn btn-outline panel-action-btn" onClick={handleBookFrom}>
                    <MapPin size={14} />
                    Book from here
                </button>
                <button className="btn btn-primary panel-action-btn" onClick={handleBookTo}>
                    <ArrowRight size={14} />
                    Book to here
                </button>
            </div>
        </div>
    );
}
