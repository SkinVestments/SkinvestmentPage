import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { 
  ArrowLeft, Loader2, Wallet, TrendingUp, TrendingDown, Package, ShieldCheck,ChevronRight
} from 'lucide-react';

// --- TYPY DANYCH ---
interface CollectionItem {
  item_id: string;
  name: string;
  quantity: number;
  item_price: number;
  rarity: string | null;
  category: string;
  icon_url: string | null;
  batches: any[]; // Można otypować dokładniej, jeśli potrzebujesz
}

interface CollectionStats {
  total_invested: number;
  current_worth: number;
  investment_worth: number;
  equipment_worth: number;
  total_gain: number;
  roi_percentage: number;
  total_items_count: number;
}

// Funkcja stylizująca kolory Rarity (skopiowana dla spójności)
const getRarityStyle = (rarity: string | null | undefined) => {
  if (!rarity) return { border: 'border-gray-600', text: 'text-gray-400', shadow: '' };
  const r = rarity.toLowerCase();
  if (r.includes('contraband')) return { border: 'border-yellow-500', text: 'text-yellow-500', shadow: 'shadow-yellow-500/20' };
  if (r.includes('covert')) return { border: 'border-red-500', text: 'text-red-500', shadow: 'shadow-red-500/20' };
  if (r.includes('classified')) return { border: 'border-pink-500', text: 'text-pink-500', shadow: 'shadow-pink-500/20' };
  if (r.includes('restricted')) return { border: 'border-purple-500', text: 'text-purple-500', shadow: 'shadow-purple-500/20' };
  if (r.includes('mil-spec')) return { border: 'border-blue-600', text: 'text-blue-500', shadow: 'shadow-blue-500/20' };
  if (r.includes('industrial')) return { border: 'border-sky-400', text: 'text-sky-400', shadow: 'shadow-sky-400/20' };
  if (r.includes('consumer')) return { border: 'border-gray-400', text: 'text-gray-400', shadow: 'shadow-gray-400/20' };
  return { border: 'border-gray-600', text: 'text-gray-400', shadow: '' };
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
};

const CollectionDetails = () => {
  const { id: collectionId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

    const toggleRow = (itemId: string) => {
        setExpandedItemId(expandedItemId === itemId ? null : itemId);
    };

  useEffect(() => {
    const fetchCollectionData = async () => {
      if (!user || !collectionId) return;
      try {
        setLoading(true);

        // Równoległe pobieranie statystyk i przedmiotów dla wydajności
        const [statsResponse, itemsResponse] = await Promise.all([
          supabase.rpc('get_collection_stats', { p_collection_id: collectionId }),
          supabase.rpc('get_collection_items', { p_collection_id: collectionId, p_user_id: user.id })
        ]);

        if (statsResponse.error) throw statsResponse.error;
        if (itemsResponse.error) throw itemsResponse.error;

        setStats(statsResponse.data);
        setItems(itemsResponse.data || []);
        console.log('Collection stats:', statsResponse.data);
        console.log('Collection items:', itemsResponse.data);   
      } catch (error) {
        console.error('Error fetching collection details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionData();
  }, [user, collectionId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-steam-accent" />
      </div>
    );
  }

  const isPositive = stats ? stats.roi_percentage >= 0 : true;

  return (
    <div className="text-white animate-fade-in pb-10">
      
      {/* --- HEADER --- */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/panel')}
            className="p-2 bg-[#1e232b] rounded-xl border border-gray-800 hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-steam-accent" />
              Collection Vault
            </h1>
            <p className="text-gray-400 text-sm">Detailed overview of your selected items.</p>
          </div>
        </div>
      </div>

        {/* --- STATYSTYKI GŁÓWNE --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* KAFELEK 1: Wartość całkowita i ROI */}
        <div className="bg-[#1e232b] p-5 rounded-2xl border border-gray-800 shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-5">
            <Wallet className="w-20 h-20" />
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Current Worth</p>
          <h2 className="text-3xl font-bold text-white mb-1">{formatCurrency(stats?.current_worth || 0)}</h2>
          <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {stats?.roi_percentage.toFixed(2)}% ROI
          </div>
        </div>

        {/* KAFELEK 2: Włożony kapitał */}
        <div className="bg-[#1e232b] p-5 rounded-2xl border border-gray-800 shadow-lg">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Invested</p>
          <h2 className="text-3xl font-bold text-white mb-1">{formatCurrency(stats?.total_invested || 0)}</h2>
          <p className="text-xs text-gray-400 mt-1">Initial capital used</p>
        </div>

        {/* KAFELEK 3: Ilość przedmiotów */}
        <div className="bg-[#1e232b] p-5 rounded-2xl border border-gray-800 shadow-lg">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Items</p>
          <div className="flex items-center gap-3">
             <h2 className="text-3xl font-bold text-white mb-1">{stats?.total_items_count || 0}</h2>
             <Package className="w-6 h-6 text-gray-600" />
          </div>
          <p className="text-xs text-gray-400 mt-1">Physical items in this vault</p>
        </div>

        {/* KAFELEK 4: Zaktualizowana struktura / Wydajność (bez Playskins) */}
        <div className="bg-[#1e232b] p-5 rounded-2xl border border-gray-800 shadow-lg">
           <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Performance</p>
           <div className="space-y-2 mt-2">
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Investments Value</span>
                <span className="font-mono text-white font-bold">{formatCurrency(stats?.investment_worth || 0)}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Total Gain</span>
                <span className={`font-mono font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : ''}{formatCurrency(stats?.total_gain || 0)}
                </span>
             </div>
           </div>
        </div>
      </div>

      {/* --- TABELA PRZEDMIOTÓW W KOLEKCJI --- */}
      <div className="bg-[#1e232b] rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#1b2028]">
          <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300">Vault Contents</h3>
        </div>

        {items.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-bold mb-1 text-white">Vault is empty</p>
            <p className="text-sm">Assign items to this collection to see them here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#171a21] text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-800">
                  <th className="p-5 pl-6">Item</th>
                  <th className="p-5">Category</th>
                  <th className="p-5">Quantity</th>
                  <th className="p-5">Unit Price</th>
                  <th className="p-5 text-right pr-6">Total Value</th>
                </tr>
              </thead>
                <tbody className="divide-y divide-gray-800/50 text-sm">
                {items.map((item) => {
                    const rarityStyle = getRarityStyle(item.rarity);
                    const totalVal = item.item_price * item.quantity;
                    const isExpanded = expandedItemId === item.item_id;

                    return (
                    <React.Fragment key={item.item_id}>
                        {/* WIERSZ GŁÓWNY */}
                        <tr 
                        onClick={() => toggleRow(item.item_id)}
                        className={`hover:bg-[#252b36] transition-colors cursor-pointer group ${isExpanded ? 'bg-[#252b36]' : ''}`}
                        >
                        <td className="p-4 pl-6">
                            <div className="flex items-center gap-4">
                            <div className={`
                                relative w-14 h-10 bg-gradient-to-b from-[#1a1d24] to-[#141619] 
                                rounded-md flex items-center justify-center p-1 
                                border-b-[2px] ${rarityStyle.border} ${rarityStyle.shadow}
                            `}>
                                <img src={item.icon_url || ''} alt="" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-200 group-hover:text-white truncate max-w-[200px]">{item.name}</span>
                                <span className={`text-[9px] uppercase font-bold tracking-wider ${rarityStyle.text}`}>{item.rarity || 'Common'}</span>
                            </div>
                            </div>
                        </td>
                        <td className="p-4">
                            <span className="text-gray-400 capitalize bg-gray-800/50 px-2 py-1 rounded text-xs">
                            {item.category}
                            </span>
                        </td>
                        <td className="p-4 font-medium text-gray-300">x{item.quantity}</td>
                        <td className="p-4 text-gray-400 font-mono">{formatCurrency(item.item_price)}</td>
                        <td className="p-4 text-right pr-6 font-bold text-white font-mono">
                            <div className="flex items-center justify-end gap-2">
                            {formatCurrency(totalVal)}
                            <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </div>
                        </td>
                        </tr>

                        {/* WIERSZ Z BATCHAMI (ROZWINIĘTY) */}
                        {isExpanded && (
                        <tr className="bg-[#14171d] animate-fade-in">
                            <td colSpan={5} className="p-0">
                            <div className="px-6 py-4 border-l-2 border-steam-accent ml-6 my-2 space-y-2">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Purchase Batches</p>
                                
                                {/* Nagłówki sekcji batchy */}
                                <div className="grid grid-cols-4 gap-4 pb-2 border-b border-gray-800 text-[11px] font-bold text-gray-500 uppercase">
                                <span>Date</span>
                                <span>Quantity</span>
                                <span>Buy Price</span>
                                <span className="text-right">Total Cost</span>
                                </div>

                                {/* Mapowanie batchy z poprawionymi kluczami */}
                                {item.batches && item.batches.length > 0 ? (
                                item.batches.map((batch: any, idx: number) => {
                                    // Zabezpieczenie daty: szukamy pola 'date' lub 'acquired_at'
                                    const rawDate = batch.date || batch.acquired_at;
                                    const formattedDate = rawDate 
                                    ? new Date(rawDate).toLocaleDateString() 
                                    : 'Unknown Date';

                                    const bPrice = Number(batch.buy_price) || 0;
                                    const bQty = Number(batch.quantity) || 0;

                                    return (
                                    <div key={idx} className="grid grid-cols-4 gap-4 py-2 text-sm text-gray-300 hover:text-white transition-colors border-b border-gray-800/30 last:border-0">
                                        <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${batch.type === 'DROP' ? 'bg-green-500' : 'bg-steam-accent'}`}></div>
                                        {formattedDate}
                                        </div>
                                        <div className="font-medium text-gray-400">x{bQty}</div>
                                        <div className="font-mono text-gray-400">
                                        {batch.type === 'DROP' ? <span className="text-green-500/80 text-[10px] font-bold">DROP</span> : formatCurrency(bPrice)}
                                        </div>
                                        <div className="font-mono font-bold text-right text-gray-200">
                                        {formatCurrency(bPrice * bQty)}
                                        </div>
                                    </div>
                                    );
                                })
                                ) : (
                                <p className="text-gray-500 italic py-2">No batch history found.</p>
                                )}
                            </div>
                            </td>
                        </tr>
                        )}
                    </React.Fragment>
                    );
                })}
                </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default CollectionDetails;