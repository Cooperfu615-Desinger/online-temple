import React from 'react';
import DeityCard from './DeityCard';
import { fortuneDatabase } from '../data/fortuneDatabase';

export default function SelectionMenu({ onSelect }) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-start md:justify-center pt-32 md:pt-4 p-4 z-20 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4">
                {Object.entries(fortuneDatabase).map(([key, data]) => (
                    <DeityCard key={key} deityKey={key} data={data} onSelect={onSelect} />
                ))}
            </div>
        </div>
    );
}
