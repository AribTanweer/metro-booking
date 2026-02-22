/**
 * AdminPage
 * Administration dashboard.
 */
import { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { List, Upload, Grid3X3, LogOut, PlusCircle, MinusCircle } from 'lucide-react';
import LineManager from '../components/admin/LineManager';
import BulkImport from '../components/admin/BulkImport';
import CompatibilityMatrix from '../components/admin/CompatibilityMatrix';
import AddStationTab from '../components/admin/AddStationTab';
import RemoveStationTab from '../components/admin/RemoveStationTab';
import { useAuth } from '../components/auth/AuthContext';
import { AdminProvider } from '../components/admin/AdminContext';
import './AdminPage.css';

export default function AdminPage() {
    const tabs = [
        { to: '/admin', label: 'Lines & Stations', icon: List, end: true },
        { to: '/admin/add-station', label: 'Add Station', icon: PlusCircle },
        { to: '/admin/remove-station', label: 'Remove Station', icon: MinusCircle },
        { to: '/admin/import', label: 'Bulk Import', icon: Upload },
        { to: '/admin/compatibility', label: 'Compatibility', icon: Grid3X3 },
    ];

    const { logout } = useAuth();

    return (
        <AdminProvider>
            <div className="admin-page">
                <div className="admin-header">
                    <div>
                        <h1>Network Management</h1>
                        <p className="text-secondary">Manage metro lines, stations, and data imports</p>
                    </div>
                    <button onClick={logout} className="btn btn-outline btn-sm">
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>

                <div className="admin-tabs">
                    {tabs.map(tab => (
                        <NavLink
                            key={tab.to}
                            to={tab.to}
                            end={tab.end}
                            className={({ isActive }) => `admin-tab ${isActive ? 'active' : ''}`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </NavLink>
                    ))}
                </div>

                <div className="admin-content">
                    <Routes>
                        <Route index element={<LineManager />} />
                        <Route path="add-station" element={<AddStationTab />} />
                        <Route path="remove-station" element={<RemoveStationTab />} />
                        <Route path="import" element={<BulkImport />} />
                        <Route path="compatibility" element={<CompatibilityMatrix />} />
                    </Routes>
                </div>
            </div>
        </AdminProvider>
    );
}
