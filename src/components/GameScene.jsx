import React, { useState, useEffect } from 'react';
import bwaYin from '../assets/bwa_yin.png';
import bwaYang from '../assets/bwa_yang.png';

// 精緻籤 SVG 元件 - 包含動態籤號顯示
const FortuneStickSVG = ({ fortuneTitle, showGlow }) => (
    <svg
        width="80"
        height="400"
        viewBox="0 0 80 400"
        className={showGlow ? 'animate-glow-pulse' : ''}
    >
        <defs>
            {/* 竹籤漸層 */}
            <linearGradient id="stickGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c4956a" />
                <stop offset="20%" stopColor="#e8c9a0" />
                <stop offset="50%" stopColor="#f5e6d3" />
                <stop offset="80%" stopColor="#e8c9a0" />
                <stop offset="100%" stopColor="#c4956a" />
            </linearGradient>

            {/* 紅色籤頭漸層 */}
            <linearGradient id="redHeadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6b0000" />
                <stop offset="20%" stopColor="#8b0000" />
                <stop offset="50%" stopColor="#cc0000" />
                <stop offset="80%" stopColor="#8b0000" />
                <stop offset="100%" stopColor="#6b0000" />
            </linearGradient>

            {/* 金色漸層 */}
            <linearGradient id="goldAccent" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffd700" />
                <stop offset="50%" stopColor="#b8860b" />
                <stop offset="100%" stopColor="#8b6914" />
            </linearGradient>

            {/* 發光效果 */}
            <filter id="stickGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* 籤身陰影 */}
        <rect x="32" y="75" width="20" height="320" fill="rgba(0,0,0,0.3)" rx="3" />

        {/* 竹籤主體 */}
        <rect x="28" y="70" width="24" height="325" fill="url(#stickGradient)" rx="4" />

        {/* 木紋紋理 */}
        <line x1="32" y1="80" x2="32" y2="385" stroke="#d4a574" strokeWidth="0.5" opacity="0.4" />
        <line x1="40" y1="75" x2="40" y2="390" stroke="#d4a574" strokeWidth="0.3" opacity="0.3" />
        <line x1="48" y1="78" x2="48" y2="388" stroke="#d4a574" strokeWidth="0.5" opacity="0.4" />

        {/* 紅色籤頭 */}
        <rect x="24" y="0" width="32" height="75" fill="url(#redHeadGradient)" rx="5" />

        {/* 籤頭金色裝飾 */}
        <rect x="24" y="8" width="32" height="4" fill="url(#goldAccent)" rx="2" />
        <rect x="24" y="63" width="32" height="4" fill="url(#goldAccent)" rx="2" />

        {/* 籤號文字 - 垂直書寫 */}
        {fortuneTitle && (
            <text
                x="40"
                y="130"
                textAnchor="middle"
                fill="#4a2c2a"
                fontSize="22"
                fontWeight="bold"
                fontFamily="'Noto Sans TC', sans-serif"
                writingMode="vertical-rl"
                letterSpacing="0.1em"
            >
                {fortuneTitle}
            </text>
        )}
    </svg>
);

export default function GameScene({ deity, onDrawComplete }) {
    const [stickState, setStickState] = useState('hidden'); // hidden, appearing, appeared
    const [btnState, setBtnState] = useState('start'); // start, drawing, reset
    const [showGlow, setShowGlow] = useState(false);

    // Bwa Bwei State
    const [bwaBweiState, setBwaBweiState] = useState('idle'); // idle, prompt, throwing, result
    const [pendingFortune, setPendingFortune] = useState(null);
    const [bwaBweiResult, setBwaBweiResult] = useState(null); // saint, laugh, yin

    const startDrawing = () => {
        if (stickState === 'appearing') return;

        // 立即隨機抽取一支籤
        const randomIndex = Math.floor(Math.random() * deity.data.length);
        const result = deity.data[randomIndex];
        setPendingFortune(result);

        // 開始籤升起動畫
        setBtnState('drawing');
        setStickState('appearing');

        // 動畫完成後進入擲筊流程
        setTimeout(() => {
            setStickState('appeared');
            setShowGlow(true);

            // 短暫展示發光效果後，彈出擲筊視窗
            setTimeout(() => {
                setBwaBweiState('prompt');
            }, 800);
        }, 1000); // 升起動畫 1 秒
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
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            {/* Background Text */}
            <div className="absolute top-1/4 text-[120px] font-calligraphy text-[#d4af37] opacity-5 select-none pointer-events-none whitespace-nowrap">
                {deity.name}
            </div>

            {/* 神明圖片 - 畫面中央視覺焦點 */}
            <div className="relative z-10 flex flex-col items-center">
                <div className="relative">
                    {/* 神明圖片光暈背景 */}
                    <div className="absolute inset-0 bg-gradient-radial from-[#d4af37]/20 via-transparent to-transparent blur-2xl scale-150" />

                    {/* 神明圖片 */}
                    <img
                        src={deity.image}
                        alt={deity.name}
                        className="relative w-48 h-auto object-contain drop-shadow-2xl"
                        style={{
                            filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))'
                        }}
                    />

                    {/* 裝飾框 */}
                    <div className="absolute -inset-4 border-2 border-[#d4af37]/30 rounded-lg pointer-events-none" />
                    <div className="absolute -inset-6 border border-[#d4af37]/20 rounded-xl pointer-events-none" />
                </div>

                {/* 神明名稱 */}
                <h2 className="mt-6 text-3xl font-bold text-[#d4af37] tracking-widest">
                    {deity.name}
                </h2>
            </div>

            {/* Rising Stick - 從下方升起的靈籤 */}
            <div
                className={`absolute z-20 pointer-events-none transition-all duration-1000 ease-out
                    ${stickState === 'hidden' ? 'translate-y-[500px] opacity-0' : ''}
                    ${stickState === 'appearing' ? 'animate-appear-up' : ''}
                    ${stickState === 'appeared' ? 'translate-y-0 opacity-100' : ''}
                `}
                style={{
                    bottom: '25%',
                }}
            >
                <FortuneStickSVG
                    fortuneTitle={pendingFortune?.title}
                    showGlow={showGlow}
                />
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
