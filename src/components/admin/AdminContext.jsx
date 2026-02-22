/**
 * AdminContext
 * Provides shared state for Metro Lines across Admin tabs.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { METRO_LINES, STATIONS } from '../../data/metroData';

const AdminContext = createContext(null);

export const useAdminData = () => useContext(AdminContext);

export function AdminProvider({ children }) {
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

    const updateLines = (newLines) => {
        setLines(newLines);
    };

    return (
        <AdminContext.Provider value={{ lines, setLines: updateLines }}>
            {children}
        </AdminContext.Provider>
    );
}
