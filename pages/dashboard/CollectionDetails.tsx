import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import {
  ArrowLeft,
  ChevronRight,
  Loader2,
  Package,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { formatCurrency, getRarityStyle } from '@/utils/display';
import { ItemImage } from '@/components/ui/ItemImage';

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

const CollectionDetails = () => {
  const { id: collectionId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const openItemDetail = (itemId: string) => {
    navigate(`/item/${itemId}`, {
      state: { from: `/collection/${collectionId}`, collectionId },
    });
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
    <div className="text-steam-text animate-fade-in pb-10 min-w-0 overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button 
            onClick={() => navigate('/panel')}
            className="p-2 bg-steam-card rounded-xl border border-steam-border hover:bg-steam-hover transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-steam-secondary" />
          </button>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-steam-text mb-1 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-steam-accent" />
              Collection Vault
            </h1>
            <p className="text-steam-secondary text-sm">Detailed overview of your selected items.</p>
          </div>
        </div>
      </div>

        {/* --- STATYSTYKI GŁÓWNE --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* KAFELEK 1: Wartość całkowita i ROI */}
        <div className="bg-steam-card p-5 rounded-2xl border border-steam-border shadow-lg relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-5">
            <Wallet className="w-20 h-20" />
          </div>
          <p className="text-xs font-bold text-steam-tertiary uppercase tracking-wider mb-2">Current Worth</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-steam-text mb-1 break-all sm:break-normal">{formatCurrency(stats?.current_worth || 0)}</h2>
          <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {stats?.roi_percentage.toFixed(2)}% ROI
          </div>
        </div>

        {/* KAFELEK 2: Włożony kapitał */}
        <div className="bg-steam-card p-5 rounded-2xl border border-steam-border shadow-lg">
          <p className="text-xs font-bold text-steam-tertiary uppercase tracking-wider mb-2">Total Invested</p>
          <h2 className="text-3xl font-bold text-steam-text mb-1">{formatCurrency(stats?.total_invested || 0)}</h2>
          <p className="text-xs text-steam-secondary mt-1">Initial capital used</p>
        </div>

        {/* KAFELEK 3: Ilość przedmiotów */}
        <div className="bg-steam-card p-5 rounded-2xl border border-steam-border shadow-lg">
          <p className="text-xs font-bold text-steam-tertiary uppercase tracking-wider mb-2">Total Items</p>
          <div className="flex items-center gap-3">
             <h2 className="text-3xl font-bold text-steam-text mb-1">{stats?.total_items_count || 0}</h2>
             <Package className="w-6 h-6 text-steam-tertiary" />
          </div>
          <p className="text-xs text-steam-secondary mt-1">Physical items in this vault</p>
        </div>

        {/* KAFELEK 4: Zaktualizowana struktura / Wydajność (bez Playskins) */}
        <div className="bg-steam-card p-5 rounded-2xl border border-steam-border shadow-lg">
           <p className="text-xs font-bold text-steam-tertiary uppercase tracking-wider mb-2">Performance</p>
           <div className="space-y-2 mt-2">
             <div className="flex justify-between items-center text-sm">
                <span className="text-steam-secondary">Investments Value</span>
                <span className="font-mono text-steam-text font-bold">{formatCurrency(stats?.investment_worth || 0)}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-steam-secondary">Total Gain</span>
                <span className={`font-mono font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : ''}{formatCurrency(stats?.total_gain || 0)}
                </span>
             </div>
           </div>
        </div>
      </div>

      {/* --- TABELA PRZEDMIOTÓW W KOLEKCJI --- */}
      <div className="bg-steam-card rounded-2xl border border-steam-border shadow-xl overflow-hidden">
        <div className="p-5 border-b border-steam-border flex justify-between items-center bg-steam-elevated">
          <h3 className="font-bold text-sm uppercase tracking-wider text-steam-secondary">Vault Contents</h3>
        </div>

        {items.length === 0 ? (
          <div className="p-16 text-center text-steam-secondary">
            <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-bold mb-1 text-steam-text">Vault is empty</p>
            <p className="text-sm">Assign items to this collection to see them here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-steam-surface text-steam-tertiary text-xs font-bold uppercase tracking-wider border-b border-steam-border">
                  <th className="p-5 pl-6">Item</th>
                  <th className="p-5">Category</th>
                  <th className="p-5">Quantity</th>
                  <th className="p-5">Unit Price</th>
                  <th className="p-5 text-right pr-6">Total Value</th>
                </tr>
              </thead>
                <tbody className="divide-y divide-steam-border/50 text-sm">
                {items.map((item) => {
                    const rarityStyle = getRarityStyle(item.rarity);
                    const totalVal = item.item_price * item.quantity;

                    return (
                        <tr
                        key={item.item_id}
                        onClick={() => openItemDetail(item.item_id)}
                        className="hover:bg-steam-hover transition-colors cursor-pointer group"
                        >
                        <td className="p-4 pl-6">
                            <div className="flex items-center gap-4">
                            <div className={`
                                relative w-14 h-10 bg-gradient-to-b from-steam-elevated to-steam-bg 
                                rounded-md flex items-center justify-center p-1 
                                border-b-[2px] ${rarityStyle.border} ${rarityStyle.shadow}
                            `}>
                                <ItemImage
                                  src={item.icon_url}
                                  alt={item.name}
                                  className="w-full h-full object-contain"
                                  wrapperClassName="w-full h-full"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-steam-text group-hover:text-steam-text truncate max-w-[200px]">{item.name}</span>
                                <span className={`text-[9px] uppercase font-bold tracking-wider ${rarityStyle.text}`}>{item.rarity || 'Common'}</span>
                            </div>
                            </div>
                        </td>
                        <td className="p-4">
                            <span className="text-steam-secondary capitalize bg-steam-elevated/80 px-2 py-1 rounded text-xs">
                            {item.category}
                            </span>
                        </td>
                        <td className="p-4 font-medium text-steam-secondary">x{item.quantity}</td>
                        <td className="p-4 text-steam-secondary font-mono">{formatCurrency(item.item_price)}</td>
                        <td className="p-4 text-right pr-6 font-bold text-steam-text font-mono">
                            <div className="flex items-center justify-end gap-2">
                            {formatCurrency(totalVal)}
                            <ChevronRight className="w-4 h-4 text-steam-tertiary group-hover:text-steam-accent transition-colors" />
                            </div>
                        </td>
                        </tr>
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