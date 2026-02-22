/**
 * MetroDataContext
 * Provides reactive metro data (lines, stations, graph) to the entire app.
 * Admin mutations (add/remove station) propagate to map, search, booking, etc.
 */
import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
    METRO_LINES,
    buildStationData,
    buildGraph,
    generateFacilities,
    getStationPosition,
    STATION_POSITIONS,
    stationPairDuration,
    saveRecentSearch,
    getRecentSearches,
    generateBookingRef,
    VERSION_MATRIX,
} from './metroData';

const MetroDataContext = createContext(null);

export const useMetroData = () => {
    const ctx = useContext(MetroDataContext);
    if (!ctx) throw new Error('useMetroData must be used within MetroDataProvider');
    return ctx;
};

// Transfer penalty for line changes (used in Dijkstra)
const TRANSFER_PENALTY = 5;

export function MetroDataProvider({ children }) {
    // Mutable copy of METRO_LINES as the single source of truth
    const [metroLines, setMetroLines] = useState(() => ({ ...METRO_LINES }));

    // Derive stations and graph from current metroLines
    const stations = useMemo(() => buildStationData(metroLines), [metroLines]);
    const graph = useMemo(() => buildGraph(metroLines), [metroLines]);

    // ---- Helper functions that operate on reactive data ----

    const getStationById = useCallback((id) => {
        return stations[id] || null;
    }, [stations]);

    const searchStations = useCallback((query) => {
        if (!query || query.length < 1) return [];
        const q = query.toLowerCase();
        return Object.values(stations)
            .filter(s => s.name.toLowerCase().includes(q))
            .slice(0, 10);
    }, [stations]);

    // Dijkstra operating on the reactive graph
    const dijkstra = useCallback((sourceId, destId, excludeEdges = new Set()) => {
        const dist = {};
        const prev = {};
        const pq = [];

        const startKey = `${sourceId}:_start`;
        dist[startKey] = 0;
        pq.push({ key: startKey, stationId: sourceId, line: '_start', time: 0 });

        while (pq.length > 0) {
            pq.sort((a, b) => a.time - b.time);
            const current = pq.shift();

            if (current.time > (dist[current.key] ?? Infinity)) continue;

            if (current.stationId === destId) {
                const path = [];
                let k = current.key;
                while (k) {
                    const [sid, line] = k.split(':');
                    path.unshift({ stationId: sid, line: line === '_start' ? null : line, duration: 0 });
                    k = prev[k];
                }
                for (let i = 1; i < path.length; i++) {
                    const edge = (graph[path[i - 1].stationId] || []).find(
                        e => e.to === path[i].stationId && e.line === path[i].line
                    );
                    path[i].duration = edge?.duration ?? 3;
                }
                return path;
            }

            const neighbors = graph[current.stationId] || [];
            for (const edge of neighbors) {
                const edgeKey = `${current.stationId}->${edge.to}:${edge.line}`;
                if (excludeEdges.has(edgeKey)) continue;
                const transferCost =
                    current.line !== '_start' && current.line !== edge.line ? TRANSFER_PENALTY : 0;
                const newTime = current.time + edge.duration + transferCost;
                const nextKey = `${edge.to}:${edge.line}`;

                if (newTime < (dist[nextKey] ?? Infinity)) {
                    dist[nextKey] = newTime;
                    prev[nextKey] = current.key;
                    pq.push({ key: nextKey, stationId: edge.to, line: edge.line, time: newTime });
                }
            }
        }

        return null;
    }, [graph]);

    const buildRoute = useCallback((path) => {
        const segments = [];
        let currentLine = null;
        let segmentStops = [];

        for (let i = 1; i < path.length; i++) {
            const step = path[i];
            if (step.line !== currentLine) {
                if (segmentStops.length > 0) {
                    segments.push({
                        line: currentLine,
                        lineColor: metroLines[currentLine]?.color || '#999',
                        lineName: metroLines[currentLine]?.name || 'Unknown',
                        stations: [...segmentStops],
                        duration: segmentStops.reduce((sum, s) => sum + (s.duration || 2), 0),
                    });
                }
                currentLine = step.line;
                segmentStops = [{ stationId: path[i - 1].stationId, duration: 0 }];
            }
            segmentStops.push({ stationId: step.stationId, duration: step.duration });
        }

        if (segmentStops.length > 0) {
            segments.push({
                line: currentLine,
                lineColor: metroLines[currentLine]?.color || '#999',
                lineName: metroLines[currentLine]?.name || 'Unknown',
                stations: [...segmentStops],
                duration: segmentStops.reduce((sum, s) => sum + (s.duration || 2), 0),
            });
        }

        const totalStops = path.length - 1;
        const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0) + (segments.length - 1) * 3;
        const transfers = segments.length - 1;
        const fare = calculateFare(totalStops);

        return { segments, totalStops, totalDuration, transfers, fare };
    }, [metroLines]);

    const findRoutes = useCallback((sourceId, destId) => {
        if (!sourceId || !destId || sourceId === destId) return [];
        if (!graph[sourceId] || !graph[destId]) return [];

        const results = [];
        const excludeEdges = new Set();
        for (let k = 0; k < 3; k++) {
            const path = dijkstra(sourceId, destId, excludeEdges);
            if (!path) break;

            const route = buildRoute(path);
            const lineSeq = route.segments.map(s => s.line).join(',');
            const isDuplicate = results.some(
                r => r.segments.map(s => s.line).join(',') === lineSeq
            );
            if (!isDuplicate) {
                results.push(route);
            }
            for (let i = 1; i < path.length - 1; i++) {
                const seg = path[i];
                const prev = path[i - 1];
                excludeEdges.add(`${prev.stationId}->${seg.stationId}:${seg.line}`);
            }
        }
        results.sort((a, b) => a.totalDuration - b.totalDuration || a.transfers - b.transfers);
        if (results.length > 0) results[0].label = 'Fastest';
        if (results.length > 1) {
            const fewestTransfers = [...results].sort((a, b) => a.transfers - b.transfers)[0];
            const fewestStops = [...results].sort((a, b) => a.totalStops - b.totalStops)[0];
            results.forEach(r => {
                if (!r.label) {
                    if (r === fewestTransfers) r.label = 'Fewest Transfers';
                    else if (r === fewestStops) r.label = 'Fewest Stops';
                    else r.label = 'Alternative';
                }
            });
        }

        return results;
    }, [graph, dijkstra, buildRoute]);

    // ---- Mutation functions ----

    const addStationToNetwork = useCallback((stationId, stationName, lineInsertions) => {
        // lineInsertions: { [lineId]: 'end' | 'start' | 'after:<stationId>' }
        setMetroLines(prev => {
            const next = { ...prev };
            Object.entries(lineInsertions).forEach(([lineId, position]) => {
                if (!next[lineId]) return;
                const line = { ...next[lineId], stations: [...next[lineId].stations] };

                if (position === 'end') {
                    line.stations.push(stationId);
                } else if (position === 'start') {
                    line.stations.unshift(stationId);
                } else if (position.startsWith('after:')) {
                    const afterId = position.split(':')[1];
                    const idx = line.stations.indexOf(afterId);
                    if (idx !== -1) {
                        line.stations.splice(idx + 1, 0, stationId);
                    } else {
                        line.stations.push(stationId);
                    }
                }

                next[lineId] = line;
            });

            // Add position for the new station if not already in STATION_POSITIONS
            if (!STATION_POSITIONS[stationId]) {
                // Auto-assign a position near the last station on the first line
                const firstLineId = Object.keys(lineInsertions)[0];
                const firstLine = next[firstLineId];
                if (firstLine && firstLine.stations.length > 1) {
                    const prevStationId = firstLine.stations[firstLine.stations.length - 2];
                    const prevPos = STATION_POSITIONS[prevStationId] || { x: 700, y: 550 };
                    STATION_POSITIONS[stationId] = { x: prevPos.x + 50, y: prevPos.y };
                } else {
                    STATION_POSITIONS[stationId] = { x: 700, y: 550 };
                }
            }

            return next;
        });
    }, []);

    const removeStationFromNetwork = useCallback((stationId) => {
        setMetroLines(prev => {
            const next = {};
            Object.entries(prev).forEach(([lineId, line]) => {
                next[lineId] = {
                    ...line,
                    stations: line.stations.filter(sid => sid !== stationId),
                };
            });
            return next;
        });
    }, []);

    // For admin: get lines in the admin-friendly format [{id, name, color, stations: [{id, name, isInterchange}]}]
    const adminLines = useMemo(() => {
        return Object.entries(metroLines).map(([id, line]) => ({
            ...line,
            id,
            stations: line.stations.map(sId => ({
                id: sId,
                name: stations[sId]?.name || sId,
                isInterchange: stations[sId]?.isInterchange || false,
            })),
        }));
    }, [metroLines, stations]);

    const setAdminLines = useCallback((newAdminLines) => {
        // Convert admin format back to METRO_LINES format
        if (typeof newAdminLines === 'function') {
            setMetroLines(prev => {
                const prevAdmin = Object.entries(prev).map(([id, line]) => ({
                    ...line,
                    id,
                    stations: line.stations.map(sId => ({
                        id: sId,
                        name: stations[sId]?.name || sId,
                        isInterchange: stations[sId]?.isInterchange || false,
                    })),
                }));
                const result = newAdminLines(prevAdmin);
                const next = {};
                result.forEach(line => {
                    next[line.id] = {
                        ...prev[line.id],
                        id: line.id,
                        name: line.name,
                        color: line.color,
                        stations: line.stations.map(s => s.id),
                    };
                });
                return next;
            });
        } else {
            setMetroLines(() => {
                const next = {};
                newAdminLines.forEach(line => {
                    next[line.id] = {
                        id: line.id,
                        name: line.name,
                        color: line.color,
                        stations: line.stations.map(s => s.id),
                    };
                });
                return next;
            });
        }
    }, [stations]);

    const value = useMemo(() => ({
        // Raw data
        metroLines,
        stations,
        graph,

        // Query functions
        getStationById,
        searchStations,
        findRoutes,

        // Mutation functions
        addStationToNetwork,
        removeStationFromNetwork,

        // Admin-compatible interface
        adminLines,
        setAdminLines,

        // Pass-through utilities
        saveRecentSearch,
        getRecentSearches,
        generateBookingRef,
    }), [metroLines, stations, graph, getStationById, searchStations, findRoutes,
        addStationToNetwork, removeStationFromNetwork, adminLines, setAdminLines]);

    return (
        <MetroDataContext.Provider value={value}>
            {children}
        </MetroDataContext.Provider>
    );
}

function calculateFare(stops) {
    if (stops <= 2) return 10;
    if (stops <= 5) return 20;
    if (stops <= 12) return 30;
    if (stops <= 21) return 40;
    return 50;
}
