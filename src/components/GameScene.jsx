import React, { useState, useEffect } from 'react';

export default function GameScene({ deity, onDrawComplete }) {
    const [isShaking, setIsShaking] = useState(false);
    const [stickState, setStickState] = useState('hidden'); // hidden, dropping, dropped
    const [btnState, setBtnState] = useState('start'); // start, drawing, reset

    const startDrawing = () => {
        if (isShaking) return;
        setIsShaking(true);
        setBtnState('drawing');

        // Random shake duration 2-3s
        setTimeout(() => {
            setIsShaking(false);
            setStickState('dropping');

            // Wait for drop animation (1s) + a bit
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * deity.data.length);
                const result = deity.data[randomIndex];
                onDrawComplete(result);
                setBtnState('reset');
            }, 1500);
        }, 2000 + Math.random() * 1000);
    };

    const reset = () => {
        setStickState('hidden');
        setBtnState('start');
    };

    // Reset when deity changes
    useEffect(() => {
        reset();
    }, [deity]);

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Background Text */}
            <div className="absolute top-1/4 text-[120px] font-calligraphy text-[#d4af37] opacity-5 select-none pointer-events-none whitespace-nowrap">
                {deity.name}
            </div>

            {/* Falling Stick */}
            <div className={`absolute z-20 pointer-events-none ${stickState === 'hidden' ? 'opacity-0' : ''} ${stickState === 'dropping' ? 'animate-drop' : ''}`} style={{ bottom: '35%' }}>
                <svg width="30" height="240" viewBox="0 0 20 200">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <rect x="2" y="0" width="16" height="200" rx="1" fill="#eecfa1" stroke="#8B4513" strokeWidth="0.5" filter="url(#glow)" />
                    <rect x="2" y="0" width="16" height="40" rx="1" fill="#b91c1c" />
                    <text x="10" y="20" fontSize="14" fill="#ffd700" textAnchor="middle" dominantBaseline="middle" fontFamily="serif" fontWeight="bold">{deity.shortName[0]}</text>
                    <text x="10" y="110" fontSize="12" fill="#5e2f0d" textAnchor="middle" dominantBaseline="middle" writingMode="tb" fontFamily="serif" letterSpacing="4">{deity.shortName}靈籤</text>
                </svg>
            </div>

            {/* Tube */}
            <div className={`relative origin-bottom z-10 mt-20 ${isShaking ? 'animate-shake' : ''}`}>
                <svg width="260" height="360" viewBox="0 0 200 300" className="overflow-visible drop-shadow-2xl">
                    <defs>
                        <linearGradient id="bambooGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#2a1a15', stopOpacity: 1 }} />
                            <stop offset="30%" style={{ stopColor: '#5c3a2e', stopOpacity: 1 }} />
                            <stop offset="50%" style={{ stopColor: '#6d4c41', stopOpacity: 1 }} />
                            <stop offset="70%" style={{ stopColor: '#5c3a2e', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#2a1a15', stopOpacity: 1 }} />
                        </linearGradient>
                        <radialGradient id="holeGradient" cx="50%" cy="50%" r="50%">
                            <stop offset="50%" style={{ stopColor: '#0f0808', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#2a1a15', stopOpacity: 1 }} />
                        </radialGradient>
                    </defs>

                    {/* Static Sticks */}
                    <g transform="translate(0, 10)">
                        <rect x="60" y="-30" width="12" height="150" fill="#c49a6c" stroke="#3e2723" transform="rotate(-10 60 100)" />
                        <rect x="80" y="-40" width="12" height="150" fill="#c49a6c" stroke="#3e2723" transform="rotate(-5 80 100)" />
                        <rect x="100" y="-45" width="12" height="150" fill="#c49a6c" stroke="#3e2723" transform="rotate(0 100 100)" />
                        <rect x="120" y="-35" width="12" height="150" fill="#c49a6c" stroke="#3e2723" transform="rotate(6 120 100)" />
                        <rect x="135" y="-25" width="12" height="150" fill="#c49a6c" stroke="#3e2723" transform="rotate(12 135 100)" />
                        {/* Heads */}
                        <rect x="60" y="-30" width="12" height="25" fill="#8B0000" transform="rotate(-10 60 100)" />
                        <rect x="80" y="-40" width="12" height="25" fill="#8B0000" transform="rotate(-5 80 100)" />
                        <rect x="100" y="-45" width="12" height="25" fill="#8B0000" transform="rotate(0 100 100)" />
                        <rect x="120" y="-35" width="12" height="25" fill="#8B0000" transform="rotate(6 120 100)" />
                        <rect x="135" y="-25" width="12" height="25" fill="#8B0000" transform="rotate(12 135 100)" />
                    </g>

                    {/* Body */}
                    <g>
                        <path d="M40,80 L160,80 L152,280 L48,280 Z" fill="url(#bambooGradient)" stroke="#1a0f0f" strokeWidth="2" />
                        <ellipse cx="100" cy="80" rx="60" ry="15" fill="url(#holeGradient)" stroke="#3e2723" strokeWidth="2" />

                        <path d="M41,100 Q100,115 159,100" fill="none" stroke="#d4af37" strokeWidth="4" strokeOpacity="0.8" />
                        <path d="M47,260 Q100,275 153,260" fill="none" stroke="#d4af37" strokeWidth="4" strokeOpacity="0.8" />

                        <rect x="75" y="125" width="50" height="110" fill="#8B0000" stroke="#d4af37" strokeWidth="2" rx="2">
                            <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
                        </rect>

                        <text x="100" y="180" fontFamily="'Zhi Mang Xing', serif" fontSize="36" fill="#FFD700" textAnchor="middle" dominantBaseline="middle" writingMode="tb" style={{ textShadow: '1px 1px 2px black' }}>
                            {deity.shortName}
                        </text>
                    </g>
                </svg>
            </div>

            {/* Buttons */}
            <div className="absolute bottom-16 w-full flex justify-center z-30">
                {btnState === 'start' && (
                    <button onClick={startDrawing} className="btn-temple text-2xl px-16 py-4 rounded-lg font-bold tracking-[0.5em]">
                        開始求籤
                    </button>
                )}
                {btnState === 'drawing' && (
                    <button disabled className="btn-temple text-2xl px-16 py-4 rounded-lg font-bold tracking-[0.5em] opacity-80 cursor-wait">
                        誠心祈求中...
                    </button>
                )}
                {btnState === 'reset' && (
                    <button onClick={reset} className="btn-temple bg-gradient-to-b from-gray-700 to-gray-900 border-gray-500 text-xl px-12 py-3 rounded-lg font-bold tracking-widest">
                        再求一支
                    </button>
                )}
            </div>
        </div>
    );
}
