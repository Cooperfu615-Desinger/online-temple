import React from 'react';

export default function Header({ showBack, onBack }) {
    return (
        <div className="absolute top-0 w-full p-6 z-30 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
            <div>
                <h1 className="text-4xl font-calligraphy text-gold tracking-widest drop-shadow-xl">線上靈籤</h1>
                <p className="text-[#d4af37] text-xs tracking-[0.5em] mt-2 opacity-80 uppercase">Fortune Sticks</p>
            </div>
            {showBack && (
                <button onClick={onBack} className="border border-[#d4af37] text-[#d4af37] px-4 py-1 rounded-sm text-sm hover:bg-[#d4af37] hover:text-black transition uppercase tracking-widest bg-black/40 backdrop-blur-sm">
                    返回
                </button>
            )}
        </div>
    );
}
