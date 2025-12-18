import React, { useState, useEffect } from 'react';
import bwaYin from '../assets/bwa_yin.png';
import bwaYang from '../assets/bwa_yang.png';

// 精緻籤筒 SVG 元件
const FortuneTubeSVG = ({ isShaking }) => (
    <svg
        width="180"
        height="380"
        viewBox="0 0 180 380"
        className={`relative z-10 mt-20 origin-bottom ${isShaking ? 'animate-shake-intense' : ''}`}
    >
        <defs>
            {/* 籤筒主體漸層 - 深紅木色 */}
            <linearGradient id="tubeBodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2d0a0a" />
                <stop offset="20%" stopColor="#5c1818" />
                <stop offset="50%" stopColor="#6d2c2c" />
                <stop offset="80%" stopColor="#5c1818" />
                <stop offset="100%" stopColor="#2d0a0a" />
            </linearGradient>

            {/* 籤筒內部深色漸層 */}
            <linearGradient id="tubeInnerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0a0202" />
                <stop offset="100%" stopColor="#1a0505" />
            </linearGradient>

            {/* 金色裝飾漸層 */}
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffd700" />
                <stop offset="50%" stopColor="#b8860b" />
                <stop offset="100%" stopColor="#8b6914" />
            </linearGradient>

            {/* 雲紋圖案 */}
            <pattern id="cloudPattern" patternUnits="userSpaceOnUse" width="40" height="40">
                <path
                    d="M20 5 Q25 5 28 10 Q32 8 35 12 Q38 10 40 15 Q38 18 35 17 Q32 20 28 18 Q25 22 20 20 Q15 22 12 18 Q8 20 5 17 Q2 18 0 15 Q2 10 5 12 Q8 8 12 10 Q15 5 20 5Z"
                    fill="none"
                    stroke="url(#goldGradient)"
                    strokeWidth="0.5"
                    opacity="0.3"
                />
            </pattern>

            {/* 筒口陰影濾鏡 */}
            <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
                <feOffset in="blur" dx="0" dy="5" result="offsetBlur" />
                <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
            </filter>

            {/* 發光濾鏡 */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* 籤筒主體 */}
        <ellipse cx="90" cy="360" rx="70" ry="15" fill="#1a0505" /> {/* 底部陰影 */}
        <path
            d="M30 60 Q20 60 20 70 L20 340 Q20 360 40 360 L140 360 Q160 360 160 340 L160 70 Q160 60 150 60 Z"
            fill="url(#tubeBodyGradient)"
        />

        {/* 雲紋裝飾層 */}
        <path
            d="M30 60 Q20 60 20 70 L20 340 Q20 360 40 360 L140 360 Q160 360 160 340 L160 70 Q160 60 150 60 Z"
            fill="url(#cloudPattern)"
        />

        {/* 金色頂部邊框 */}
        <ellipse cx="90" cy="60" rx="65" ry="12" fill="url(#goldGradient)" />
        <ellipse cx="90" cy="60" rx="55" ry="8" fill="url(#tubeInnerGradient)" />

        {/* 金色裝飾帶 - 上方 */}
        <rect x="22" y="80" width="136" height="8" fill="url(#goldGradient)" rx="2" />
        <path
            d="M30 88 Q90 100 150 88"
            stroke="url(#goldGradient)"
            strokeWidth="1"
            fill="none"
        />

        {/* 金色裝飾帶 - 中間 */}
        <rect x="22" y="180" width="136" height="6" fill="url(#goldGradient)" rx="2" />

        {/* 金色裝飾帶 - 下方 */}
        <rect x="22" y="320" width="136" height="8" fill="url(#goldGradient)" rx="2" />
        <path
            d="M30 320 Q90 308 150 320"
            stroke="url(#goldGradient)"
            strokeWidth="1"
            fill="none"
        />

        {/* 底座裝飾 */}
        <ellipse cx="90" cy="360" rx="75" ry="18" fill="url(#goldGradient)" />
        <ellipse cx="90" cy="360" rx="70" ry="15" fill="url(#tubeBodyGradient)" />

        {/* 中央雕刻裝飾 - 福字簡化版 */}
        <rect x="60" y="200" width="60" height="80" fill="none" stroke="url(#goldGradient)" strokeWidth="2" rx="5" />
        <text x="90" y="255" textAnchor="middle" fill="url(#goldGradient)" fontSize="40" fontWeight="bold">福</text>
    </svg>
);

// 精緻籤 SVG 元件
const FortuneStickSVG = ({ state, style, className }) => (
    <svg
        width="30"
        height="300"
        viewBox="0 0 30 300"
        className={className}
        style={style}
    >
        <defs>
            {/* 竹籤漸層 */}
            <linearGradient id="stickGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d4a574" />
                <stop offset="30%" stopColor="#e8c9a0" />
                <stop offset="70%" stopColor="#e8c9a0" />
                <stop offset="100%" stopColor="#d4a574" />
            </linearGradient>

            {/* 紅色籤頭漸層 */}
            <linearGradient id="redHeadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b0000" />
                <stop offset="30%" stopColor="#cc0000" />
                <stop offset="70%" stopColor="#cc0000" />
                <stop offset="100%" stopColor="#8b0000" />
            </linearGradient>

            {/* 發光效果 */}
            <filter id="stickGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* 竹籤主體 */}
        <rect x="10" y="50" width="10" height="250" fill="url(#stickGradient)" rx="2" />

        {/* 木紋紋理 */}
        <line x1="12" y1="60" x2="12" y2="290" stroke="#c4956a" strokeWidth="0.5" opacity="0.5" />
        <line x1="15" y1="55" x2="15" y2="295" stroke="#c4956a" strokeWidth="0.3" opacity="0.3" />
        <line x1="18" y1="58" x2="18" y2="292" stroke="#c4956a" strokeWidth="0.5" opacity="0.5" />

        {/* 紅色籤頭 */}
        <rect x="8" y="0" width="14" height="55" fill="url(#redHeadGradient)" rx="3" />

        {/* 籤頭裝飾線 */}
        <line x1="10" y1="10" x2="20" y2="10" stroke="#ffd700" strokeWidth="1" opacity="0.8" />
        <line x1="10" y1="45" x2="20" y2="45" stroke="#ffd700" strokeWidth="1" opacity="0.8" />
    </svg>
);

export default function GameScene({ deity, onDrawComplete }) {
    const [isShaking, setIsShaking] = useState(false);
    const [stickState, setStickState] = useState('hidden'); // hidden, rising, risen
    const [btnState, setBtnState] = useState('start'); // start, drawing, reset
    const [showGlow, setShowGlow] = useState(false);

    // Bwa Bwei State
    const [bwaBweiState, setBwaBweiState] = useState('idle'); // idle, prompt, throwing, result
    const [pendingFortune, setPendingFortune] = useState(null);
    const [bwaBweiResult, setBwaBweiResult] = useState(null); // saint, laugh, yin

    const startDrawing = () => {
        if (isShaking) return;
        setIsShaking(true);
        setBtnState('drawing');
        setStickState('hidden');
        setShowGlow(false);

        // 劇烈搖晃 2 秒
        setTimeout(() => {
            setIsShaking(false);

            // 搖晃結束後，籤開始升起
            setStickState('rising');

            // 升起動畫 1.5 秒後完成
            setTimeout(() => {
                setStickState('risen');
                setShowGlow(true);

                // 抽取結果
                const randomIndex = Math.floor(Math.random() * deity.data.length);
                const result = deity.data[randomIndex];

                // 短暫展示發光效果後，進入擲筊流程
                setTimeout(() => {
                    setPendingFortune(result);
                    setBwaBweiState('prompt');
                }, 800);
            }, 1500);
        }, 2000);
    };

    const throwBwaBwei = () => {
        setBwaBweiState('throwing');

        // Simulate throw delay
        setTimeout(() => {
            const rand = Math.random();
            if (rand < 0.5) {
                // 50% Saint's Cup (Success)
                setBwaBweiResult('saint');
                setBwaBweiState('result');

                setTimeout(() => {
                    onDrawComplete(pendingFortune);
                    setBtnState('reset');
                    setBwaBweiState('idle'); // Close modal
                }, 1500);
            } else {
                // 50% Laughing/Yin Cup (Fail)
                setBwaBweiResult(rand < 0.75 ? 'laugh' : 'yin');
                setBwaBweiState('result');

                setTimeout(() => {
                    reset(); // Reset game to start
                }, 2500);
            }
        }, 1000);
    };

    const reset = () => {
        setStickState('hidden');
        setBtnState('start');
        setBwaBweiState('idle');
        setPendingFortune(null);
        setBwaBweiResult(null);
        setShowGlow(false);
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

            {/* 筒內的籤 (靜態裝飾) */}
            <div className="absolute z-5 flex gap-1" style={{ bottom: 'calc(50% + 80px)' }}>
                {[...Array(7)].map((_, i) => (
                    <div
                        key={i}
                        className="opacity-60"
                        style={{
                            transform: `rotate(${(i - 3) * 3}deg) translateY(${Math.abs(i - 3) * 5}px)`,
                        }}
                    >
                        <FortuneStickSVG />
                    </div>
                ))}
            </div>

            {/* Rising Stick - 升起的靈籤 */}
            <div
                className={`absolute z-20 pointer-events-none transition-all duration-300 ${stickState === 'hidden' ? 'opacity-0' : 'opacity-100'
                    } ${stickState === 'rising' ? 'animate-rise-up' : ''
                    } ${stickState === 'risen' ? 'risen-position' : ''
                    } ${showGlow ? 'animate-glow-pulse' : ''}`}
                style={{
                    bottom: stickState === 'hidden' ? 'calc(50% + 50px)' : undefined,
                }}
            >
                <FortuneStickSVG state={stickState} />
            </div>

            {/* Fortune Tube SVG */}
            <FortuneTubeSVG isShaking={isShaking} />

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

            {/* Bwa Bwei Modal */}
            {bwaBweiState !== 'idle' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1a0f0f] border-2 border-[#d4af37] p-8 rounded-xl max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                        {/* Decorative corners */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#d4af37]"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#d4af37]"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#d4af37]"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#d4af37]"></div>

                        {bwaBweiState === 'prompt' && (
                            <div className="animate-fade-in">
                                <h3 className="text-2xl text-[#d4af37] font-bold mb-6">
                                    已抽出 {pendingFortune?.title}
                                </h3>
                                <p className="text-gray-300 mb-8 text-lg">
                                    請擲筊請示神明是否為此籤
                                </p>
                                <button
                                    onClick={throwBwaBwei}
                                    className="bg-[#b91c1c] hover:bg-[#8B0000] text-[#ffd700] text-xl px-10 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(185,28,28,0.5)]"
                                >
                                    擲 筊
                                </button>
                            </div>
                        )}

                        {bwaBweiState === 'throwing' && (
                            <div className="animate-pulse flex justify-center gap-8 mb-8">
                                <img src={bwaYin} alt="Moon Block" className="w-24 h-24 animate-spin-slow" />
                                <img src={bwaYang} alt="Moon Block" className="w-24 h-24 animate-spin-slow" />
                            </div>
                        )}

                        {bwaBweiState === 'result' && (
                            <div className="animate-fade-in">
                                <div className="flex justify-center gap-8 mb-8">
                                    {bwaBweiResult === 'saint' ? (
                                        <>
                                            <img src={bwaYin} alt="Yin" className="w-24 h-24 drop-shadow-lg transform rotate-12" />
                                            <img src={bwaYang} alt="Yang" className="w-24 h-24 drop-shadow-lg transform -rotate-12" />
                                        </>
                                    ) : bwaBweiResult === 'laugh' ? (
                                        <>
                                            <img src={bwaYang} alt="Yang" className="w-24 h-24 drop-shadow-lg transform rotate-12" />
                                            <img src={bwaYang} alt="Yang" className="w-24 h-24 drop-shadow-lg transform -rotate-12" />
                                        </>
                                    ) : (
                                        <>
                                            <img src={bwaYin} alt="Yin" className="w-24 h-24 drop-shadow-lg transform rotate-12" />
                                            <img src={bwaYin} alt="Yin" className="w-24 h-24 drop-shadow-lg transform -rotate-12" />
                                        </>
                                    )}
                                </div>
                                <h3 className={`text-3xl font-bold mb-4 ${bwaBweiResult === 'saint' ? 'text-green-500' : 'text-red-500'}`}>
                                    {bwaBweiResult === 'saint' ? '聖 筊' :
                                        bwaBweiResult === 'laugh' ? '笑 筊' : '陰 筊'}
                                </h3>
                                <p className="text-gray-300 text-lg">
                                    {bwaBweiResult === 'saint'
                                        ? '神明應以此籤，即將顯示籤詩...'
                                        : '此籤非聖意，請重新誠心祈求'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
