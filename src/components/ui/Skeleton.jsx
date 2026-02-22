/**
 * Skeleton
 * Loading skeleton placeholders.
 */
import MetroTrainIcon from './MetroTrainIcon';
import './Skeleton.css';

/**
 * Reusable skeleton loading component.
 * 
 * Variants:
 * - text:   single line of text (default, 60% width)
 * - title:  heading line (80% width, taller)
 * - circle: circular avatar/icon placeholder
 * - card:   full card-shaped block
 * - rect:   custom width/height rectangle
 */
export default function Skeleton({ variant = 'text', width, height, count = 1, className = '' }) {
    const items = Array.from({ length: count }, (_, i) => i);

    return (
        <>
            {items.map(i => (
                <div
                    key={i}
                    className={`skeleton skeleton-${variant} ${className}`}
                    style={{
                        width: width || undefined,
                        height: height || undefined,
                    }}
                />
            ))}
        </>
    );
}

/**
 * Animated metro train loading state for route search
 */
export function RouteResultsSkeleton() {
    return (
        <div className="skeleton-route-results">
            <div className="skeleton-train-loader">
                <MetroTrainIcon size={80} animate />
                <div className="skeleton-train-text">
                    <span className="skeleton-train-title">Finding best routes…</span>
                    <span className="skeleton-train-sub">Checking lines &amp; transfers</span>
                </div>
            </div>
            <div className="skeleton-track">
                <div className="skeleton-track-line" />
                <div className="skeleton-track-dots">
                    <span className="skeleton-dot" style={{ animationDelay: '0ms' }} />
                    <span className="skeleton-dot" style={{ animationDelay: '200ms' }} />
                    <span className="skeleton-dot" style={{ animationDelay: '400ms' }} />
                    <span className="skeleton-dot" style={{ animationDelay: '600ms' }} />
                    <span className="skeleton-dot" style={{ animationDelay: '800ms' }} />
                </div>
            </div>
        </div>
    );
}

/**
 * Pre-composed skeleton for station search card
 */
export function StationSearchSkeleton() {
    return (
        <div className="skeleton-search-card">
            <div className="skeleton-search-fields">
                <Skeleton variant="rect" width="100%" height="44px" />
                <Skeleton variant="circle" width="36px" height="36px" />
                <Skeleton variant="rect" width="100%" height="44px" />
            </div>
            <Skeleton variant="rect" width="140px" height="44px" />
        </div>
    );
}
