import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Loader2, Diamond } from 'lucide-react';

// --- KONFIGURACJA KOLORÓW I RZADKOŚCI ---

// Dokładne kolory ze wzoru
const RARITY_COLORS: Record<string, string> = {
  'contraband': '#EAB308', // Gold / Złoty
  'covert': '#EF4444',     // Red / Czerwony
  'classified': '#EC4899', // Pink / Różowy
  'restricted': '#A855F7', // Purple / Fioletowy
  'mil-spec': '#3B82F6',   // Blue / Niebieski
  'industrial': '#6B7280', // Gray / Szary (dla niższych)
  'consumer': '#4B5563',   // Dark Gray
  'base grade': '#374151', // Default
};

// Kolejność sortowania (najrzadsze na górze piramidy)
const RARITY_ORDER = [
  'contraband', 'covert', 'classified', 'restricted', 'mil-spec', 'industrial', 'consumer', 'base grade'
];

// Helper do pobierania koloru i skróconej nazwy
const getRarityInfo = (rarityName: string) => {
  const normalized = rarityName.toLowerCase();
  let color = RARITY_COLORS['base grade'];
  let shortName = rarityName;

  for (const key of Object.keys(RARITY_COLORS)) {
    if (normalized.includes(key)) {
      color = RARITY_COLORS[key];
      // Mapowanie na krótkie nazwy z obrazka
      if (key === 'contraband') shortName = 'GOLD';
      else if (key === 'covert') shortName = 'RED';
      else if (key === 'classified') shortName = 'PINK';
      else if (key === 'restricted') shortName = 'PURPLE';
      else if (key === 'mil-spec') shortName = 'BLUE';
      else shortName = key.toUpperCase();
      break;
    }
  }
  return { color, shortName };
};

export const QualityStructureChart = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [qualityScore, setQualityScore] = useState<{ label: string, color: string }>({ label: 'STANDARD', color: 'text-gray-400' });

  useEffect(() => {
    const fetchQualityData = async () => {
      if (!user) return;
      try {
        // Używamy tej samej funkcji SQL co wcześniej
        const { data: rawData, error } = await supabase.rpc('get_portfolio_quality_structure', {
          p_user_id: user.id
        });

        if (error) throw error;

        if (rawData && rawData.length > 0) {
          // 1. Obliczamy całkowitą liczbę przedmiotów
          const totalItems = rawData.reduce((sum: number, item: any) => sum + Number(item.item_count), 0);

          // 2. Przetwarzamy dane: dodajemy procenty, kolory i sortujemy
          const processedData = rawData.map((item: any) => {
            const count = Number(item.item_count);
            const percentage = totalItems > 0 ? (count / totalItems) * 100 : 0;
            const { color, shortName } = getRarityInfo(item.quality_name);

            return {
              originalName: item.quality_name.toLowerCase(),
              name: shortName, // Krótka nazwa (np. RED)
              count: count,
              value: percentage, // Wartość dla wykresu to procent
              color: color,
              percentageLabel: `${percentage.toFixed(0)}%`
            };
          });

          // 3. Sortowanie według ustalonej kolejności piramidy
          processedData.sort((a: any, b: any) => {
            const indexA = RARITY_ORDER.findIndex(r => a.originalName.includes(r));
            const indexB = RARITY_ORDER.findIndex(r => b.originalName.includes(r));
             // Jeśli nie znaleziono, dajemy na koniec
            return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
          });

          setData(processedData);

          // 4. Obliczanie Quality Score
          // Sumujemy procenty "wysokich" tierów (Pink, Red, Gold)
          const highTierShare = processedData
            .filter((d: any) => ['PINK', 'RED', 'GOLD'].includes(d.name))
            .reduce((sum: number, d: any) => sum + d.value, 0);

          if (highTierShare > 25) {
            setQualityScore({ label: 'HIGH TIER', color: 'text-blue-400' });
          } else if (highTierShare > 5) {
            setQualityScore({ label: 'MID TIER', color: 'text-purple-400' });
          } else {
            setQualityScore({ label: 'STANDARD TIER', color: 'text-gray-400' });
          }
        }
      } catch (error) {
        console.error('Error fetching quality structure:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQualityData();
  }, [user]);

  if (loading) {
    return <div className="bg-[#1e232b] rounded-2xl border border-gray-800 shadow-lg h-[400px] flex items-center justify-center"><Loader2 className="animate-spin text-gray-500 w-8 h-8" /></div>;
  }

  if (data.length === 0) {
    return (
      <div className="bg-[#1e232b] p-6 rounded-2xl border border-gray-800 shadow-lg h-[400px] flex flex-col justify-center items-center text-center">
         <Diamond className="w-8 h-8 text-gray-600 mb-3" />
         <p className="text-gray-400 font-bold">No data</p>
         <p className="text-gray-500 text-xs mt-1">Add items to see your quality structure.</p>
      </div>
    );
  }

  // Trik w Recharts: Aby uzyskać piramidę, używamy Stacked Bar Chart
  // Musimy przekształcić dane w jeden obiekt, gdzie kluczami są nazwy rzadkości
  const stackedData = [{
    name: 'Portfolio',
    ...data.reduce((acc, item) => ({ ...acc, [item.name]: item.value }), {})
  }];

  return (
    <div className="bg-[#1e232b] p-6 rounded-2xl border border-gray-800 shadow-lg h-[450px] flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <Diamond className="w-5 h-5 text-blue-400" />
        <h3 className="font-bold text-white">Inventory Quality Structure</h3>
      </div>
      <p className="text-xs text-gray-400 mb-6 leading-relaxed">
        Automatic categorization by rarity. See if your portfolio is built on stable assets or speculative skins.
      </p>
      
      {/* WYKRES PIRAMIDY */}
      <div className="flex-1 w-full relative flex flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            layout="vertical"
            data={stackedData}
            margin={{ top: 20, right: 60, left: 60, bottom: 20 }}
            stackOffset="expand" // To sprawia, że słupki zajmują 100% szerokości
          >
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}% share`,
                `${name} Rarity`
              ]}
              contentStyle={{ backgroundColor: '#171a21', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#e5e7eb', fontWeight: 'bold' }}
              cursor={false}
            />
            {/* Generujemy segmenty piramidy w odwrotnej kolejności (żeby GOLD był na górze stosu) */}
            {[...data].reverse().map((item, index) => (
              <Bar key={item.name} dataKey={item.name} stackId="a" fill={item.color} stroke="#1e232b" strokeWidth={2}>
                {/* Etykieta w środku paska (np. "GOLD") */}
                <LabelList dataKey={item.name} position="center" fill="#fff" fontSize={10} fontWeight="bold" formatter={(val:any) => val > 3 ? item.name : ''} />
                {/* Etykieta z procentem po prawej stronie (np. "1%") */}
                 <LabelList 
                    valueAccessor={(entry: any) => {
                        const val = entry[item.name];
                        // Pokazujemy procent tylko jeśli jest większy niż 1%, żeby nie robić bałaganu
                        return val > 1 ? `${val.toFixed(0)}%` : '';
                    }}
                    position="right" 
                    fill={item.color} 
                    fontSize={11} 
                    fontWeight="bold" 
                    offset={10}
                 />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>

        {/* QUALITY SCORE SECTION (Na dole) */}
        <div className="text-center mt-2">
           <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Quality Score</p>
           <div className={`text-xl font-bold ${qualityScore.color} flex items-center justify-center gap-2 font-display`}>
              {qualityScore.label}
              {qualityScore.label.includes('HIGH') && <Diamond className="w-5 h-5 fill-current" />}
           </div>
        </div>

      </div>
    </div>
  );
};