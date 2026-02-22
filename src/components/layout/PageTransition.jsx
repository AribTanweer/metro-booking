/**
 * PageTransition
 * Animated page transition wrapper.
 */
import { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

export default function PageTransition({ children }) {
    const location = useLocation();
    const [displayChildren, setDisplayChildren] = useState(children);
    const [transitionStage, setTransitionStage] = useState('entered');
    const prevKey = useRef(location.key);

    useEffect(() => {
        if (location.key !== prevKey.current) {
            setTransitionStage('exiting');
        }
    }, [location.key]);

    const handleAnimationEnd = () => {
        if (transitionStage === 'exiting') {
            setDisplayChildren(children);
            setTransitionStage('entering');
            prevKey.current = location.key;
        } else if (transitionStage === 'entering') {
            setTransitionStage('entered');
        }
    };

    return (
        <div
            className={`page-transition page-transition-${transitionStage}`}
            onAnimationEnd={handleAnimationEnd}
        >
            {transitionStage === 'exiting' ? displayChildren : children}
        </div>
    );
}
