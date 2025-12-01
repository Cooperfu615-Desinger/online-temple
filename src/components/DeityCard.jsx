import React from 'react';

const themeColors = {
    red: { text: 'text-red-500', shadow: 'drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' },
    green: { text: 'text-emerald-500', shadow: 'drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]' },
    orange: { text: 'text-amber-600', shadow: 'drop-shadow-[0_0_10px_rgba(217,119,6,0.5)]' },
};

const descriptions = {
    mazu: "六十甲子籤\n運勢指引",
    guanyin: "觀音靈籤\n慈悲解惑",
    guandi: "關帝靈籤\n功名財運",
};

export default function DeityCard({ deityKey, data, onSelect }) {
    const theme = themeColors[data.theme] || themeColors.red;
    const desc = descriptions[deityKey] || "";

    return (
        <div onClick={() => onSelect(deityKey)} className="deity-card group h-[400px] flex flex-col items-center justify-center cursor-pointer p-6">
            <div className={`text-6xl font-calligraphy ${theme.text} mb-6 ${theme.shadow} group-hover:scale-110 transition-transform duration-500`}>
                {data.shortName[0]}
            </div>
            <div className="border-y border-[#d4af37] py-2 w-full text-center mb-4">
                <h3 className="text-2xl font-bold text-gold tracking-widest">{data.name}</h3>
            </div>
            <div className="text-gray-400 text-sm vertical-text h-24 leading-loose tracking-widest border-r border-gray-700 pr-4 opacity-70 group-hover:opacity-100 transition-opacity whitespace-pre-line">
                {desc}
            </div>
            <div className="mt-8 text-[#d4af37] text-xs border border-[#d4af37] px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-500">
                叩問聖意
            </div>
        </div>
    );
}
