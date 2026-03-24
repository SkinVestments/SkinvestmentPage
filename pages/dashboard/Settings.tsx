import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Settings as SettingsIcon, Shield, LogOut, 
  Moon, DollarSign, BarChart2, ChevronRight, ArrowLeft,
  Camera, CreditCard, Link as LinkIcon, Bell, ShoppingCart
} from 'lucide-react';

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'account' | 'app' | 'privacy'>('account');
  
  // Przykładowe stany ustawień
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const [priceSource, setPriceSource] = useState('steam');
  const [notifications, setNotifications] = useState(true);
  const [nickname, setNickname] = useState(user?.email?.split('@')[0] || 'Trader');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="text-white animate-fade-in pb-12 max-w-5xl mx-auto px-4 md:px-0 mt-8">
      
      {/* === HEADER STRONY === */}
      <div className="flex items-center gap-5 mb-10">
        <button 
          onClick={() => navigate('/panel')} 
          className="p-3 bg-[#1e232b] hover:bg-gray-800 text-gray-400 hover:text-white rounded-2xl border border-gray-800 transition-all shadow-lg group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-1">Settings</h1>
          <p className="text-gray-400">Manage your account, connections, and preferences.</p>
        </div>
      </div>

      {/* === ZAKŁADKI (TABS) === */}
      <div className="flex border-b border-gray-800 mb-8 gap-8 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('account')}
          className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'account' 
              ? 'border-steam-accent text-steam-accent' 
              : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700'
          }`}
        >
          <User className="w-4 h-4" /> Account
        </button>
        <button 
          onClick={() => setActiveTab('app')}
          className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'app' 
              ? 'border-steam-accent text-steam-accent' 
              : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700'
          }`}
        >
          <SettingsIcon className="w-4 h-4" /> App
        </button>
        <button 
          onClick={() => setActiveTab('privacy')}
          className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'privacy' 
              ? 'border-steam-accent text-steam-accent' 
              : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700'
          }`}
        >
          <Shield className="w-4 h-4" /> Privacy
        </button>
      </div>

      {/* === ZAWARTOŚĆ === */}
      <div className="max-w-3xl">
        
        {/* ================= ACCOUNT TAB ================= */}
        {activeTab === 'account' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Profil */}
            <section>
              <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 pl-1">Profile</h2>
              <div className="bg-[#1e232b] border border-gray-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8 shadow-xl">
                {/* Avatar */}
                <div className="relative group cursor-pointer shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-4xl shadow-inner border-[4px] border-[#14171d]">
                    {nickname.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Formularz */}
                <div className="flex-1 w-full space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Display Name</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="text" 
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="flex-1 bg-[#14171d] border border-gray-800 text-white font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-steam-accent transition-colors"
                      />
                      <button className="px-6 py-3 bg-steam-accent hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all">
                        Save
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Email Address</label>
                    <div className="bg-[#14171d] border border-gray-800 text-gray-400 font-medium rounded-xl px-4 py-3 opacity-70 cursor-not-allowed">
                      {user?.email}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Połączenia i Subskrypcja */}
            <section>
              <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 pl-1">Connections & Billing</h2>
              <div className="bg-[#1e232b] border border-gray-800 rounded-2xl shadow-xl overflow-hidden divide-y divide-gray-800/50">
                
                {/* Manage Subscription */}
                <div className="flex items-center justify-between p-5 hover:bg-[#252b36] cursor-pointer transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 text-red-400 rounded-xl group-hover:scale-110 transition-transform">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-white text-base">Manage Subscription</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400">Free</span>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400" />
                  </div>
                </div>

                {/* Steam Account */}
                <div className="flex items-center justify-between p-5 hover:bg-[#252b36] cursor-pointer transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                      <LinkIcon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-white text-base">Steam Account</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-500">Not linked</span>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400" />
                  </div>
                </div>

                {/* Change Password */}
                <div className="flex items-center justify-between p-5 hover:bg-[#252b36] cursor-pointer transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-white text-base">Change Password</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400" />
                </div>

              </div>
            </section>

            {/* Wyloguj */}
            <div className="pt-4">
              <button 
                onClick={handleSignOut}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 py-3.5 px-6 rounded-xl font-bold transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out from Skinvestments
              </button>
            </div>

          </div>
        )}

        {/* ================= APP TAB ================= */}
        {activeTab === 'app' && (
          <div className="space-y-8 animate-fade-in">
            <section>
              <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 pl-1">Preferences</h2>
              <div className="bg-[#1e232b] border border-gray-800 rounded-2xl shadow-xl overflow-hidden divide-y divide-gray-800/50">
                
                {/* Notifications */}
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4 text-gray-300">
                    <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl">
                      <Bell className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-white text-base">Notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications} 
                      onChange={() => setNotifications(!notifications)} 
                    />
                    <div className="w-12 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-steam-accent shadow-inner"></div>
                  </label>
                </div>

                {/* Currency */}
                <div className="flex items-center justify-between p-5 hover:bg-[#252b36] transition-colors group">
                  <div className="flex items-center gap-4 text-gray-300">
                    <div className="p-3 bg-green-500/10 text-green-400 rounded-xl">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-white text-base">Currency</span>
                  </div>
                  <div className="flex items-center gap-2 relative">
                    <select 
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="bg-transparent text-gray-400 text-sm font-bold focus:outline-none cursor-pointer outline-none text-right appearance-none pr-6"
                    >
                      <option value="USD" className="bg-[#1e232b]">USD</option>
                      <option value="EUR" className="bg-[#1e232b]">EUR</option>
                      <option value="PLN" className="bg-[#1e232b]">PLN</option>
                    </select>
                    <ChevronRight className="w-4 h-4 text-gray-600 absolute right-0 pointer-events-none group-hover:text-gray-400" />
                  </div>
                </div>

                {/* Price Source */}
                <div className="flex items-center justify-between p-5 hover:bg-[#252b36] transition-colors group">
                  <div className="flex items-center gap-4 text-gray-300">
                    <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-white text-base">Price Source</span>
                  </div>
                  <div className="flex items-center gap-2 relative">
                    <select 
                      value={priceSource}
                      onChange={(e) => setPriceSource(e.target.value)}
                      className="bg-transparent text-gray-400 text-sm font-bold focus:outline-none cursor-pointer outline-none text-right appearance-none pr-6"
                    >
                      <option value="steam" className="bg-[#1e232b]">Steam</option>
                      <option value="buff" className="bg-[#1e232b]">Buff163</option>
                      <option value="skinport" className="bg-[#1e232b]">Skinport</option>
                    </select>
                    <ChevronRight className="w-4 h-4 text-gray-600 absolute right-0 pointer-events-none group-hover:text-gray-400" />
                  </div>
                </div>
                
                {/* Appearance */}
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4 text-gray-300">
                    <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl">
                      <Moon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-white text-base">Appearance</span>
                  </div>
                  {/* Segmented Control naśladujący ten ze zrzutu ekranu */}
                  <div className="flex bg-[#14171d] rounded-lg p-1 border border-gray-800">
                    <button className="px-4 py-1.5 text-xs font-bold rounded-md bg-transparent text-gray-500 hover:text-white transition-colors cursor-not-allowed">
                      Light
                    </button>
                    <button className="px-4 py-1.5 text-xs font-bold rounded-md bg-[#2a303c] text-white shadow-md border border-gray-700">
                      Dark
                    </button>
                  </div>
                </div>

              </div>
            </section>
          </div>
        )}

        {/* ================= PRIVACY TAB ================= */}
        {activeTab === 'privacy' && (
          <div className="space-y-8 animate-fade-in">
             <section>
              <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 pl-1">Data & Analytics</h2>
              
              <div className="bg-[#1e232b] border border-gray-800 rounded-2xl p-8 relative overflow-hidden shadow-xl">
                {/* Tło - dekoracja */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none -mr-4">
                  <BarChart2 className="w-64 h-64" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="pr-8">
                      <h4 className="font-bold text-white text-xl mb-2">
                        Diagnostics & Firebase
                      </h4>
                      <p className="text-sm text-gray-400 leading-relaxed max-w-lg">
                        Help us improve Skinvestments by automatically sending anonymous crash reports and usage statistics. <br/><br/>
                        <strong className="text-gray-200">We never send personal inventory data.</strong> Opting out will disable analytics on this device.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1 shrink-0">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={analyticsEnabled} 
                        onChange={() => setAnalyticsEnabled(!analyticsEnabled)} 
                      />
                      <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-steam-accent shadow-inner"></div>
                    </label>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-800/50">
                    <button 
                      onClick={() => navigate('/privacy')} 
                      className="inline-flex items-center gap-2 text-sm text-steam-accent hover:text-blue-400 font-bold transition-all group"
                    >
                      Read our full Privacy Policy <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

            </section>
          </div>
        )}

      </div>
    </div>
  );
};

export default Settings;