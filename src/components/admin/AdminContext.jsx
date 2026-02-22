/**
 * AdminContext
 * Provides shared state for Metro Lines across Admin tabs.
 * Delegates to MetroDataContext for the actual data.
 */
import { createContext, useContext } from 'react';
import { useMetroData } from '../../data/MetroDataContext';

const AdminContext = createContext(null);

export const useAdminData = () => useContext(AdminContext);

export function AdminProvider({ children }) {
    const { adminLines, setAdminLines } = useMetroData();

    return (
        <AdminContext.Provider value={{ lines: adminLines, setLines: setAdminLines }}>
            {children}
        </AdminContext.Provider>
    );
}
