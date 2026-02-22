/**
 * CompatibilityMatrix
 * System compatibility matrix view.
 */
import { useState } from 'react';
import { VERSION_MATRIX } from '../../data/metroData';
import './CompatibilityMatrix.css';

export default function CompatibilityMatrix() {
    const [tooltip, setTooltip] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const { versions, compatibility } = VERSION_MATRIX;

    const getStatus = (source, target) => {
        if (source === target) return { status: 'self', tooltip: 'Same version' };
        const key = `${source}-${target}`;
        const reverseKey = `${target}-${source}`;
        return compatibility[key] || compatibility[reverseKey] || { status: 'none', tooltip: 'No data' };
    };

    const statusColors = {
        green: { bg: '#E8F5E9', border: '#66BB6A', text: '#2E7D32' },
        amber: { bg: '#FFF8E1', border: '#FFB74D', text: '#E65100' },
        red: { bg: '#FFEBEE', border: '#EF5350', text: '#C62828' },
        self: { bg: 'var(--bg-surface-variant)', border: 'var(--border-light)', text: 'var(--text-disabled)' },
        none: { bg: 'var(--bg-surface)', border: 'var(--border-light)', text: 'var(--text-disabled)' },
    };

    const handleMouseEnter = (e, info) => {
        const rect = e.target.getBoundingClientRect();
        setTooltipPos({
            x: rect.left + rect.width / 2,
            y: rect.top - 8,
        });
        setTooltip(info.tooltip);
    };

    return (
        <div className="compatibility-matrix animate-fade-in">
            <div className="matrix-legend">
                <div className="legend-item">
                    <span className="legend-dot" style={{ background: '#66BB6A' }} />
                    <span>Direct upgrade</span>
                </div>
                <div className="legend-item">
                    <span className="legend-dot" style={{ background: '#FFB74D' }} />
                    <span>Requires intermediate</span>
                </div>
                <div className="legend-item">
                    <span className="legend-dot" style={{ background: '#EF5350' }} />
                    <span>Blocked</span>
                </div>
            </div>

            <div className="matrix-table-wrapper">
                <table className="matrix-table">
                    <thead>
                        <tr>
                            <th className="matrix-corner">Source ↓ / Target →</th>
                            {versions.map(v => (
                                <th key={v} className="matrix-header">{v}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {versions.map(source => (
                            <tr key={source}>
                                <td className="matrix-row-header">{source}</td>
                                {versions.map(target => {
                                    const info = getStatus(source, target);
                                    const colors = statusColors[info.status] || statusColors.none;
                                    return (
                                        <td
                                            key={target}
                                            className={`matrix-cell ${info.status === 'self' ? 'matrix-cell-self' : ''}`}
                                            style={{
                                                background: colors.bg,
                                                borderColor: colors.border,
                                            }}
                                            onMouseEnter={(e) => handleMouseEnter(e, info)}
                                            onMouseLeave={() => setTooltip(null)}
                                        >
                                            {info.status === 'green' && '✓'}
                                            {info.status === 'amber' && '◐'}
                                            {info.status === 'red' && '✕'}
                                            {info.status === 'self' && '—'}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {}
            {tooltip && (
                <div
                    className="matrix-tooltip"
                    style={{
                        left: tooltipPos.x,
                        top: tooltipPos.y,
                    }}
                >
                    {tooltip}
                </div>
            )}
        </div>
    );
}
