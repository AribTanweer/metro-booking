/**
 * Metro train icon – inline SVG based on the user-provided icon.
 * Props:
 *   size     – CSS width/height (default 24)
 *   animate  – if true, wheels spin + train sways (for loading states)
 *   className
 */
import './MetroTrainIcon.css';

export default function MetroTrainIcon({ size = 24, animate = false, className = '' }) {
    return (
        <svg
            viewBox="0 0 128 128"
            width={size}
            height={size}
            className={`metro-train-icon ${animate ? 'metro-train-animate' : ''} ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            {/* Track / rail */}
            <rect x="8" y="108" width="112" height="5" rx="2" fill="#333" />

            {/* Train body group */}
            <g className="train-body">
                {/* Undercarriage / skirt – coral/pink */}
                <path d="M22 92 L106 92 L108 100 L20 100 Z" fill="#F09898" stroke="#2D2D2D" strokeWidth="3" strokeLinejoin="round" />

                {/* Main body – cream/yellow */}
                <path d="M18 46 C18 38, 26 32, 34 32 L94 32 C104 32, 110 38, 110 46 L110 92 L18 92 Z" fill="#F5E6A3" stroke="#2D2D2D" strokeWidth="3.5" strokeLinejoin="round" />

                {/* Window divider strip */}
                <rect x="18" y="78" width="92" height="6" fill="#E8D48B" />

                {/* Windows – sky blue */}
                <path d="M28 44 C28 40, 30 38, 34 38 L52 38 L48 74 L28 74 Z" fill="#7EC8E3" stroke="#2D2D2D" strokeWidth="2.5" strokeLinejoin="round" />
                <rect x="56" y="38" width="38" height="36" rx="3" fill="#7EC8E3" stroke="#2D2D2D" strokeWidth="2.5" />

                {/* Window shine accents */}
                <line x1="58" y1="38" x2="66" y2="74" stroke="#2D2D2D" strokeWidth="2" />
                <line x1="80" y1="38" x2="88" y2="74" stroke="#2D2D2D" strokeWidth="2" />

                {/* Door detail dots */}
                <circle cx="68" cy="84" r="2" fill="#2D2D2D" />
                <circle cx="76" cy="84" r="2" fill="#2D2D2D" />
                <circle cx="84" cy="84" r="2" fill="#2D2D2D" />
            </g>

            {/* Wheels */}
            <g className="train-wheels">
                <circle cx="38" cy="106" r="9" fill="#888" stroke="#2D2D2D" strokeWidth="3" className="train-wheel" />
                <circle cx="38" cy="106" r="3" fill="#666" />
                <circle cx="64" cy="106" r="9" fill="#888" stroke="#2D2D2D" strokeWidth="3" className="train-wheel" />
                <circle cx="64" cy="106" r="3" fill="#666" />
                <circle cx="90" cy="106" r="9" fill="#888" stroke="#2D2D2D" strokeWidth="3" className="train-wheel" />
                <circle cx="90" cy="106" r="3" fill="#666" />
            </g>
        </svg>
    );
}
