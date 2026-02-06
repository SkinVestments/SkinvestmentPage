import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const skins = [
    { name: 'AWP | Asiimov', price: '$85.42', change: '+2.4%', up: true },
    { name: 'AK-47 | Redline', price: '$24.10', change: '-0.5%', up: false },
    { name: 'Karambit | Doppler', price: '$1,240.00', change: '+5.1%', up: true },
    { name: 'M4A4 | Howl', price: '$5,400.00', change: '+12.4%', up: true },
    { name: 'Butterfly Knife | Fade', price: '$2,850.50', change: '+1.2%', up: true },
    { name: 'Desert Eagle | Blaze', price: '$650.00', change: '-1.8%', up: false },
    { name: 'Sport Gloves | Pandora', price: '$4,200.00', change: '+3.4%', up: true },
    { name: 'Glove Case', price: '$4.20', change: '+15.2%', up: true },
];

export const SkinTicker: React.FC = () => {
    return (
        <div className="w-full bg-[#0d0f12] border-y border-white/5 overflow-hidden py-3">
            <div className="flex animate-scroll whitespace-nowrap gap-12 w-max">
                {/* Duplicate the list to ensure smooth infinite scroll */}
                {[...skins, ...skins, ...skins].map((skin, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">{skin.name}</span>
                        <div className="flex items-center gap-1">
                            <span className="text-white font-mono">{skin.price}</span>
                            <span className={`text-xs flex items-center ${skin.up ? 'text-steam-success' : 'text-steam-loss'}`}>
                                {skin.up ? <TrendingUp size={12} className="mr-0.5" /> : <TrendingDown size={12} className="mr-0.5" />}
                                {skin.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};