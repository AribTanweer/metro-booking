/**
 * Navbar
 * Main application navigation bar.
 */
import { NavLink, useLocation } from 'react-router-dom';
import { Map, Settings, Ticket, IndianRupee } from 'lucide-react';
import MetroTrainIcon from '../ui/MetroTrainIcon';

export default function Navbar() {
    const location = useLocation();

    const links = [
        { to: '/', label: 'Book', icon: Ticket },
        { to: '/map', label: 'Map', icon: Map },
        { to: '/fares', label: 'Fares', icon: IndianRupee },
        { to: '/admin', label: 'Admin', icon: Settings },
    ];

    return (
        <>
            <a href="#main-content" className="skip-link">
                Skip to main content
            </a>
            <nav className="navbar" role="navigation" aria-label="Main navigation">
                <div className="navbar-brand">
                    <div className="navbar-brand-icon" aria-hidden="true">
                        <MetroTrainIcon size={22} />
                    </div>
                    <span>MetroBook</span>
                </div>
                <div className="navbar-nav" role="menubar">
                    {links.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/'}
                            role="menuitem"
                            aria-current={
                                (link.to === '/' && location.pathname === '/') ||
                                    (link.to !== '/' && location.pathname.startsWith(link.to))
                                    ? 'page'
                                    : undefined
                            }
                            className={({ isActive }) =>
                                `navbar-link ${isActive || (link.to === '/admin' && location.pathname.startsWith('/admin')) ? 'active' : ''}`
                            }
                        >
                            <link.icon size={16} aria-hidden="true" />
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </>
    );
}
