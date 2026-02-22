/**
 * MetroMap
 * Interactive SVG metro map visualization.
 */
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useMetroData } from '../../data/MetroDataContext';
import './MetroMap.css';
const LABEL_STATIONS = new Set([
    'kashmere-gate', 'rajiv-chowk', 'central-secretariat', 'hauz-khas',
    'mandi-house', 'new-delhi', 'huda-city-centre', 'dwarka',
    'rithala', 'noida-electronic-city', 'botanical-garden',
    'janakpuri-west', 'inder-lok', 'raja-nahar-singh',
    'shaheed-sthal', 'samaypur-badli', 'qutab-minar',
    'brigadier-hoshiar-singh',
]);

const LABEL_ANCHORS = {
    'samaypur-badli': 'right',
    'ghitorni': 'left',
    'arjan-garh': 'left',
    'huda-city-centre': 'left',
    'vishwavidyalaya': 'above-right',
    'vidhan-sabha': 'right',
    'civil-lines': 'right',
    'kashmere-gate': 'right',
    'chandni-chowk': 'right',
    'chawri-bazar': 'right',
    'new-delhi': 'right',
    'rajiv-chowk': 'right',
    'patel-chowk': 'right',
    'central-secretariat': 'right',
    'udyog-bhawan': 'right',
    'race-course': 'right',
    'jor-bagh': 'right',
    'ina': 'left',
    'aiims': 'left',
    'green-park': 'left',
    'hauz-khas': 'left',
    'malviya-nagar': 'left',
    'saket': 'left',
    'qutab-minar': 'left',
    'noida-electronic-city': 'right',
    'noida-sector-62': 'above',
    'noida-sector-59': 'below',
    'noida-sector-52': 'above',
    'noida-sector-34': 'below',
    'noida-sector-15': 'above',
    'new-ashok-nagar': 'below',
    'mayur-vihar-ext': 'above',
    'mayur-vihar-1': 'below',
    'akshardham': 'above',
    'yamuna-bank': 'below',
    'indraprastha': 'above',
    'pragati-maidan': 'below',
    'mandi-house': 'above-right',
    'barakhamba-road': 'below',
    'ramakrishna-ashram': 'above',
    'jhandewalan': 'below',
    'karol-bagh': 'above',
    'rajendra-place': 'below',
    'patel-nagar': 'above',
    'shadipur': 'below',
    'kirti-nagar': 'above',
    'moti-nagar': 'below',
    'ramesh-nagar': 'above',
    'rajouri-garden': 'below',
    'tagore-garden': 'above',
    'subhash-nagar': 'left',
    'tilak-nagar': 'left',
    'janakpuri-east': 'left',
    'janakpuri-west': 'left',
    'dwarka': 'left',
    'shaheed-sthal': 'right',
    'hindon-river': 'above',
    'arthala': 'below',
    'mohan-nagar': 'above',
    'shyam-park': 'below',
    'major-mohit-sharma': 'above',
    'raj-bagh': 'below',
    'shaheed-nagar': 'above',
    'dilshad-garden': 'below',
    'jhilmil': 'above',
    'mansarovar-park': 'below',
    'shahdara': 'above',
    'welcome': 'below',
    'seelampur': 'above',
    'shastri-park': 'below',
    'tis-hazari': 'above',
    'pul-bangash': 'below',
    'pratap-nagar': 'above',
    'shastri-nagar': 'below',
    'inder-lok': 'above',
    'kanhaiya-nagar': 'below',
    'keshav-puram': 'above',
    'netaji-subhash-place': 'below',
    'kohat-enclave': 'above',
    'pitam-pura': 'below',
    'rohini-east': 'above',
    'rohini-west': 'below',
    'rithala': 'above',
    'inderlok-green': 'right',
    'ashok-park-main': 'left',
    'punjabi-bagh': 'left',
    'shivaji-park': 'left',
    'madipur': 'above',
    'paschim-vihar-east': 'below',
    'paschim-vihar-west': 'above',
    'peeragarhi': 'below',
    'udyog-nagar': 'above',
    'surajmal-stadium': 'left',
    'nangloi': 'left',
    'nangloi-railway': 'left',
    'rajdhani-park': 'left',
    'mundka': 'left',
    'mundka-ind-area': 'left',
    'ghevra': 'left',
    'tikri-kalan': 'left',
    'tikri-border': 'left',
    'pandit-shree-ram-sharma': 'left',
    'bahadurgarh-city': 'left',
    'brigadier-hoshiar-singh': 'left',
    'kashmere-gate-violet': 'above-right',
    'lal-quila': 'right',
    'jama-masjid': 'right',
    'delhi-gate': 'right',
    'ito': 'right',
    'janpath': 'right',
    'khan-market': 'right',
    'jawaharlal-nehru-stadium': 'right',
    'jangpura': 'right',
    'lajpat-nagar': 'right',
    'moolchand': 'right',
    'kailash-colony': 'right',
    'nehru-place': 'right',
    'greater-kailash': 'right',
    'govindpuri': 'right',
    'harkesh-nagar-okhla': 'below',
    'jasola-apollo': 'above',
    'sarita-vihar': 'below',
    'mohan-estate': 'above',
    'tughlakabad': 'below',
    'badarpur-border': 'above',
    'sarai': 'left',
    'nhpc-chowk': 'left',
    'mewala-maharajpur': 'left',
    'sector-28-faridabad': 'below',
    'badkhal-mor': 'above',
    'old-faridabad': 'below',
    'neelam-chowk-ajronda': 'above',
    'escorts-mujesar': 'below',
    'raja-nahar-singh': 'right',
    'dabri-mor': 'right',
    'dashrathpuri': 'right',
    'palam': 'right',
    'sadar-bazar-cantonment': 'right',
    'terminal-1-igi-airport': 'right',
    'shankar-vihar': 'right',
    'vasant-vihar': 'right',
    'munirka': 'right',
    'r-k-puram': 'right',
    'ina-magenta': 'right',
    'sarojini-nagar': 'left',
    'ignou': 'left',
    'sultanpur': 'left',
    'chattarpur': 'left',
    'panchsheel-park': 'right',
    'chirag-delhi': 'above',
    'nehru-enclave': 'right',
    'kalkaji-mandir': 'above',
    'okhla-nsic': 'below',
    'sukhdev-vihar': 'above',
    'jamia-millia-islamia': 'below',
    'okhla-vihar': 'above',
    'jasola-vihar-shaheen-bagh': 'below',
    'kalindi-kunj': 'above',
    'botanical-garden': 'right',
};

/**
 * Returns { dx, dy, textAnchor, dominantBaseline } for a given anchor direction.
 * isInterchange adds more offset for the multi-ring circles.
 */
function getLabelOffset(anchor, isInterchange) {
    const gap = isInterchange ? 15 : 8;
    switch (anchor) {
        case 'left':
            return { dx: -gap, dy: 4, textAnchor: 'end', baseline: 'auto' };
        case 'above':
            return { dx: 0, dy: -(gap + 2), textAnchor: 'middle', baseline: 'auto' };
        case 'below':
            return { dx: 0, dy: gap + 8, textAnchor: 'middle', baseline: 'auto' };
        case 'above-right':
            return { dx: gap, dy: -(gap - 2), textAnchor: 'start', baseline: 'auto' };
        case 'above-left':
            return { dx: -gap, dy: -(gap - 2), textAnchor: 'end', baseline: 'auto' };
        case 'below-right':
            return { dx: gap, dy: gap + 8, textAnchor: 'start', baseline: 'auto' };
        case 'below-left':
            return { dx: -gap, dy: gap + 8, textAnchor: 'end', baseline: 'auto' };
        case 'right':
        default:
            return { dx: gap, dy: 4, textAnchor: 'start', baseline: 'auto' };
    }
}

export default function MetroMap({ onStationClick, highlightedRoute, focusedStation }) {
    const { metroLines: METRO_LINES, stations: STATIONS } = useMetroData();
    const svgRef = useRef(null);
    const wrapperRef = useRef(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [tooltip, setTooltip] = useState(null);

    const handleZoom = useCallback((delta) => {
        setZoom(z => Math.min(4, Math.max(0.3, z + delta)));
    }, []);

    const handleWheel = useCallback((e) => {
        e.preventDefault();
        handleZoom(e.deltaY < 0 ? 0.15 : -0.15);
    }, [handleZoom]);

    const handleMouseDown = useCallback((e) => {
        if (e.target.closest('.map-controls')) return;
        setDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }, [pan]);

    const handleMouseMove = useCallback((e) => {
        if (!dragging) return;
        setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }, [dragging, dragStart]);

    const handleMouseUp = useCallback(() => setDragging(false), []);
    const handleReset = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, []);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => el.removeEventListener('wheel', handleWheel);
    }, [handleWheel]);
    useEffect(() => {
        if (!focusedStation || !wrapperRef.current) return;
        const pos = STATIONS[focusedStation.id]?.position;
        if (!pos) return;
        const wrapper = wrapperRef.current;
        const rect = wrapper.getBoundingClientRect();

        const targetZoom = 2.5;
        const vbWidth = 1500;
        const vbHeight = 1380;
        // The viewBox starts at -20, so center is (-20 + 1500/2) and (-20 + 1380/2)
        const cx = 730;
        const cy = 670;

        const scaleX = rect.width / vbWidth;
        const scaleY = rect.height / vbHeight;
        const scale = Math.min(scaleX, scaleY);

        // CSS transform-origin is center center. 
        // Thus, scale() expands from the element's center.
        const dx = pos.x - cx;
        const dy = pos.y - cy;

        setPan({
            x: -dx * scale * targetZoom,
            y: -dy * scale * targetZoom,
        });
        setZoom(targetZoom);
    }, [focusedStation]);

    const highlightedStations = new Set();
    const highlightedLines = new Set();
    if (highlightedRoute) {
        highlightedRoute.segments.forEach(seg => {
            highlightedLines.add(seg.line);
            seg.stations.forEach(s => highlightedStations.add(s.stationId));
        });
    }

    const routeOverlay = useMemo(() => {
        if (!highlightedRoute) return null;

        const routePoints = [];
        highlightedRoute.segments.forEach(seg => {
            seg.stations.forEach((s, i) => {
                const station = STATIONS[s.stationId];
                if (!station) return;
                if (routePoints.length > 0) {
                    const last = routePoints[routePoints.length - 1];
                    if (last.id === s.stationId) return;
                }
                routePoints.push({
                    id: s.stationId,
                    x: station.position.x,
                    y: station.position.y,
                    color: seg.lineColor,
                    isTerminal: (i === 0 && routePoints.length === 0) || false,
                });
            });
        });
        if (routePoints.length > 0) {
            routePoints[routePoints.length - 1].isTerminal = true;
            routePoints[0].isTerminal = true;
        }

        const d = buildSmoothPath(routePoints);

        const segmentPaths = [];
        highlightedRoute.segments.forEach((seg, segIndex) => {
            const segPoints = [];
            seg.stations.forEach((s) => {
                const station = STATIONS[s.stationId];
                if (!station) return;
                const pos = { x: station.position.x, y: station.position.y };
                if (segPoints.length > 0) {
                    const last = segPoints[segPoints.length - 1];
                    if (last.x === pos.x && last.y === pos.y) return;
                }
                segPoints.push(pos);
            });
            if (segPoints.length >= 2) {
                segmentPaths.push({
                    d: buildSmoothPath(segPoints),
                    color: seg.lineColor,
                    key: segIndex,
                });
            }
        });

        return { routePoints, fullPath: d, segmentPaths };
    }, [highlightedRoute]);

    const renderLabel = (station, x, y, isMajor, isInterchange, opacity) => {
        const anchor = LABEL_ANCHORS[station.id] || 'right';
        const { dx, dy, textAnchor } = getLabelOffset(anchor, isInterchange);
        return (
            <text
                x={x + dx}
                y={y + dy}
                className={`station-label ${isMajor ? 'station-label-major' : 'station-label-minor'}`}
                textAnchor={textAnchor}
                opacity={opacity}
                fontSize={isMajor ? 9 : 6.5}
                fontWeight={isMajor ? 600 : 400}
                aria-hidden="true"
            >
                {station.name}
            </text>
        );
    };

    const renderLines = () =>
        Object.entries(METRO_LINES).map(([lineId, line]) => {
            const points = line.stations
                .map(sid => STATIONS[sid]?.position)
                .filter(Boolean);
            if (points.length < 2) return null;

            const d = buildSmoothPath(points);
            const isDimmed = highlightedRoute && !highlightedLines.has(lineId);

            return (
                <g key={lineId} role="img" aria-label={`${line.name} route`}>
                    <path
                        d={d}
                        fill="none"
                        stroke="#fff"
                        strokeWidth={6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={isDimmed ? 0.05 : 0.9}
                    />
                    <path
                        d={d}
                        fill="none"
                        stroke={line.color}
                        strokeWidth={3.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={isDimmed ? 0.15 : 1}
                    />
                </g>
            );
        });

    const renderRouteOverlay = () => {
        if (!routeOverlay) return null;

        return (
            <g className="route-overlay" aria-label="Highlighted route">
                {routeOverlay.segmentPaths.map(seg => (
                    <path key={`glow-${seg.key}`} d={seg.d} fill="none"
                        stroke={seg.color} strokeWidth={12}
                        strokeLinecap="round" strokeLinejoin="round"
                        opacity={0.15} className="route-glow" />
                ))}
                {routeOverlay.segmentPaths.map(seg => (
                    <path key={`outline-${seg.key}`} d={seg.d} fill="none"
                        stroke="#fff" strokeWidth={7}
                        strokeLinecap="round" strokeLinejoin="round" />
                ))}
                {routeOverlay.segmentPaths.map(seg => (
                    <path key={`path-${seg.key}`} d={seg.d} fill="none"
                        stroke={seg.color} strokeWidth={4.5}
                        strokeLinecap="round" strokeLinejoin="round"
                        className="route-draw" />
                ))}
                <path d={routeOverlay.fullPath} fill="none"
                    stroke="#fff" strokeWidth={2}
                    strokeLinecap="round" strokeDasharray="6 8"
                    opacity={0.6} className="route-dash-flow" />

                {routeOverlay.routePoints.map((pt, i) => (
                    <g key={`stop-${pt.id}-${i}`}>
                        {pt.isTerminal ? (
                            <>
                                <circle cx={pt.x} cy={pt.y} r={8}
                                    fill={pt.color} opacity={0.2}
                                    className="route-stop-pulse" />
                                <circle cx={pt.x} cy={pt.y} r={5.5}
                                    fill="#fff" stroke={pt.color} strokeWidth={2.5} />
                                <circle cx={pt.x} cy={pt.y} r={2.5}
                                    fill={pt.color} />
                            </>
                        ) : (
                            <>
                                <circle cx={pt.x} cy={pt.y} r={6}
                                    fill={pt.color} opacity={0.12}
                                    className="route-stop-pulse" />
                                <circle cx={pt.x} cy={pt.y} r={4}
                                    fill="#fff" stroke={pt.color} strokeWidth={2} />
                            </>
                        )}
                    </g>
                ))}

                <circle r={5} fill="#1a1a2e" stroke="#fff" strokeWidth={2}
                    className="train-dot">
                    <animateMotion dur="4s" repeatCount="indefinite"
                        path={routeOverlay.fullPath} />
                </circle>
                <circle r={10} fill="#1a1a2e" opacity={0.15}
                    className="train-dot-glow">
                    <animateMotion dur="4s" repeatCount="indefinite"
                        path={routeOverlay.fullPath} />
                </circle>
            </g>
        );
    };

    const renderStations = () =>
        Object.values(STATIONS).map(station => {
            const { x, y } = station.position;
            const isInterchange = station.isInterchange;
            const isDimmed = highlightedRoute && !highlightedStations.has(station.id);
            const isMajor = LABEL_STATIONS.has(station.id) || isInterchange;
            const labelOpacity = isDimmed ? 0.12 : (isMajor ? 0.9 : 0.7);
            if (highlightedRoute && highlightedStations.has(station.id)) {
                return (
                    <g
                        key={station.id}
                        className="map-station"
                        onClick={() => onStationClick?.(station)}
                        onMouseEnter={(e) => {
                            const rect = wrapperRef.current?.getBoundingClientRect();
                            if (rect) {
                                setTooltip({
                                    station,
                                    x: e.clientX - rect.left,
                                    y: e.clientY - rect.top - 40,
                                });
                            }
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        style={{ cursor: 'pointer' }}
                        role="button"
                        tabIndex={0}
                        aria-label={`${station.name}${isInterchange ? ' interchange' : ''} station`}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onStationClick?.(station); }}
                    >
                        {renderLabel(station, x, y, isMajor, isInterchange, 0.9)}
                    </g>
                );
            }

            return (
                <g
                    key={station.id}
                    className="map-station"
                    onClick={() => onStationClick?.(station)}
                    onMouseEnter={(e) => {
                        const rect = wrapperRef.current?.getBoundingClientRect();
                        if (rect) {
                            setTooltip({
                                station,
                                x: e.clientX - rect.left,
                                y: e.clientY - rect.top - 40,
                            });
                        }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${station.name}${isInterchange ? ' interchange' : ''} station`}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onStationClick?.(station); }}
                >
                    {isInterchange ? (
                        <>
                            <circle cx={x} cy={y} r={6} fill="#fff" stroke="#ccc" strokeWidth={1}
                                opacity={isDimmed ? 0.25 : 1} />
                            {station.lines.map((l, i) => (
                                <circle
                                    key={l.lineId}
                                    cx={x} cy={y}
                                    r={6 + (i + 1) * 2.5}
                                    fill="none"
                                    stroke={l.lineColor}
                                    strokeWidth={2}
                                    opacity={isDimmed ? 0.2 : 0.9}
                                />
                            ))}
                        </>
                    ) : (
                        <circle
                            cx={x} cy={y} r={3.5}
                            fill="#fff"
                            stroke={station.lines[0]?.lineColor || '#999'}
                            strokeWidth={2}
                            opacity={isDimmed ? 0.2 : 1}
                        />
                    )}
                    {renderLabel(station, x, y, isMajor, isInterchange, labelOpacity)}
                </g>
            );
        });

    const renderLegend = () => (
        <div className="map-legend" role="complementary" aria-label="Metro line legend">
            {Object.values(METRO_LINES).map(line => (
                <div className="legend-row" key={line.id}>
                    <span className="legend-swatch" style={{ background: line.color }} aria-hidden="true" />
                    <span className="legend-name">{line.name}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div
            className="metro-map-wrapper"
            ref={wrapperRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            role="application"
            aria-label="Interactive Metro Map. Use mouse wheel to zoom, click and drag to pan."
        >
            <svg
                ref={svgRef}
                className="metro-map-svg"
                viewBox="-20 -20 1500 1380"
                preserveAspectRatio="xMidYMid meet"
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    cursor: dragging ? 'grabbing' : 'grab',
                }}
                role="img"
                aria-label="Delhi Metro network schematic map"
            >
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="0.5" fill="#ddd" />
                    </pattern>
                </defs>
                <rect x="-20" y="-20" width="1500" height="1380" fill="url(#grid)" />

                {renderLines()}
                {renderRouteOverlay()}
                {renderStations()}
            </svg>

            <div className="map-controls" role="group" aria-label="Map controls">
                <button className="map-control-btn" onClick={() => handleZoom(0.25)} aria-label="Zoom in">
                    <ZoomIn size={18} />
                </button>
                <button className="map-control-btn" onClick={() => handleZoom(-0.25)} aria-label="Zoom out">
                    <ZoomOut size={18} />
                </button>
                <button className="map-control-btn" onClick={handleReset} aria-label="Reset view">
                    <Maximize2 size={18} />
                </button>
            </div>

            {renderLegend()}

            {tooltip && (
                <div className="map-tooltip" style={{ left: tooltip.x, top: tooltip.y }} role="tooltip">
                    <span className="map-tooltip-name">{tooltip.station.name}</span>
                    <div className="map-tooltip-lines">
                        {tooltip.station.lines.map(l => (
                            <span key={l.lineId} className="line-dot" style={{ background: l.lineColor }} />
                        ))}
                    </div>
                    {tooltip.station.isInterchange && (
                        <span className="map-tooltip-badge">interchange</span>
                    )}
                </div>
            )}
        </div>
    );
}

function buildSmoothPath(points) {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
}
