import { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { List, Upload, Grid3X3 } from 'lucide-react';
import LineManager from '../components/admin/LineManager';
import BulkImport from '../components/admin/BulkImport';
import CompatibilityMatrix from '../components/admin/CompatibilityMatrix';
import './AdminPage.css';

export default function AdminPage() {
    const tabs = [
        { to: '/admin', label: 'Lines & Stations', icon: List, end: true },
        { to: '/admin/import', label: 'Bulk Import', icon: Upload },
        { to: '/admin/compatibility', label: 'Compatibility', icon: Grid3X3 },
    ];

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Network Management</h1>
                <p className="text-secondary">Manage metro lines, stations, and data imports</p>
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
                    <Route path="import" element={<BulkImport />} />
                    <Route path="compatibility" element={<CompatibilityMatrix />} />
                </Routes>
            </div>
        </div>
    );
}
