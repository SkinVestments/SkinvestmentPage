import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Settings as SettingsIcon, Shield, LogOut, 
  Moon, Sun, DollarSign, BarChart2, ChevronRight, ArrowLeft,
  CreditCard, Link as LinkIcon, Bell, ShoppingCart, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ManageSubscriptionModal } from '@/components/dashboard/ManageSubscriptionModal';
import { ChangePasswordModal } from '@/components/dashboard/ChangePasswordModal';
import { userHasEmailPassword } from '@/utils/authProviders';
import { BillingCycle, PlanId } from '@/constants/subscriptionPlans';
import { useSubscriptionPlan } from '@/hooks/useSubscriptionPlan';
import { useOwnProfile } from '@/hooks/useOwnProfile';
import { getProfileDisplayName, getSteamProfileLabel } from '@/utils/profile';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'account' | 'app' | 'privacy'>('account');
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('manageSubscription') !== '1') return;
    setActiveTab('account');
    setIsSubscriptionModalOpen(true);
    const next = new URLSearchParams(searchParams);
    next.delete('manageSubscription');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const {
    planId: currentPlanId,
    billingCycle: currentBillingCycle,
    plan: currentPlan,
    updateSubscription,
  } = useSubscriptionPlan();
  
  const {
    profile,
    loading: profileLoading,
    saving: profileSaving,
    error: profileError,
    saveProfile,
    setError: setProfileError,
  } = useOwnProfile(user?.id);

  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [nickname, setNickname] = useState('');
  const [steamProfileUrl, setSteamProfileUrl] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    setNickname(getProfileDisplayName(profile, user?.email));
    setSteamProfileUrl(profile?.steam_profile_url?.trim() ?? '');
  }, [profile, user?.email]);

  const handleSaveProfile = async () => {
    setProfileSuccess(false);
    const trimmedNick = nickname.trim();
    if (!trimmedNick) {
      setProfileError('Display name cannot be empty.');
      return;
    }

    const trimmedSteam = steamProfileUrl.trim();
    if (trimmedSteam) {
      try {
        new URL(trimmedSteam);
      } catch {
        setProfileError('Enter a valid Steam profile URL (https://…).');
        return;
      }
    }

    try {
      await saveProfile({
        nickname: trimmedNick,
        steam_profile_url: trimmedSteam || null,
      });
      setProfileSuccess(true);
      window.setTimeout(() => setProfileSuccess(false), 3000);
    } catch {
      /* error set in hook */
    }
  };

  const displayInitial = (nickname.trim() || getProfileDisplayName(profile, user?.email))
    .charAt(0)
    .toUpperCase();
  const steamStatus = getSteamProfileLabel(profile?.steam_profile_url);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const subscriptionLabel = currentPlan
    ? currentPlan.id === 'free'
      ? 'Starter · Free'
      : `${currentPlan.name} · ${currentBillingCycle}`
    : 'Starter · Free';

  const handleSelectPlan = (planId: PlanId, billingCycle: BillingCycle) => {
    updateSubscription(planId, billingCycle);
  };

  return (
    <div className="text-steam-text animate-fade-in pb-12 max-w-5xl mx-auto px-4 md:px-0 mt-8">
      
      {/* === HEADER STRONY === */}
      <div className="flex items-center gap-5 mb-10">
        <button 
          onClick={() => navigate('/panel')} 
          className="p-3 bg-steam-card hover:bg-steam-hover text-steam-secondary hover:text-steam-text rounded-2xl border border-steam-border transition-all shadow-lg group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-steam-text mb-1">Settings</h1>
          <p className="text-steam-secondary">Manage your account, connections, and preferences.</p>
        </div>
      </div>

      {/* === ZAKŁADKI (TABS) === */}
      <div className="flex border-b border-steam-border mb-8 gap-8 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('account')}
          className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'account' 
              ? 'border-steam-accent text-steam-accent' 
              : 'border-transparent text-steam-tertiary hover:text-steam-secondary hover:border-steam-border'
          }`}
        >
          <User className="w-4 h-4" /> Account
        </button>
        <button 
          onClick={() => setActiveTab('app')}
          className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'app' 
              ? 'border-steam-accent text-steam-accent' 
              : 'border-transparent text-steam-tertiary hover:text-steam-secondary hover:border-steam-border'
          }`}
        >
          <SettingsIcon className="w-4 h-4" /> App
        </button>
        <button 
          onClick={() => setActiveTab('privacy')}
          className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'privacy' 
              ? 'border-steam-accent text-steam-accent' 
              : 'border-transparent text-steam-tertiary hover:text-steam-secondary hover:border-steam-border'
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
              <h2 className="text-[11px] font-bold text-steam-tertiary uppercase tracking-widest mb-3 pl-1">Profile</h2>
              <div className="bg-steam-card border border-steam-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8 shadow-xl">
                {/* Avatar */}
                <div className="relative shrink-0">
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt=""
                      className="w-24 h-24 rounded-full object-cover border-[4px] border-steam-bg shadow-inner"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-4xl shadow-inner border-[4px] border-steam-bg">
                      {profileLoading ? '…' : displayInitial}
                    </div>
                  )}
                </div>

                {/* Formularz */}
                <div className="flex-1 w-full space-y-4">
                  {profileError && (
                    <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{profileError}</span>
                    </div>
                  )}
                  {profileSuccess && (
                    <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-xs text-green-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Profile saved.</span>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-steam-tertiary uppercase tracking-widest mb-1.5 block">Display Name</label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      disabled={profileLoading}
                      maxLength={64}
                      className="w-full bg-steam-bg border border-steam-border text-steam-text font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-steam-accent transition-colors disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-steam-tertiary uppercase tracking-widest mb-1.5 block">
                      Steam Profile URL
                    </label>
                    <input
                      type="url"
                      value={steamProfileUrl}
                      onChange={(e) => setSteamProfileUrl(e.target.value)}
                      disabled={profileLoading}
                      placeholder="https://steamcommunity.com/id/…"
                      className="w-full bg-steam-bg border border-steam-border text-steam-text font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-steam-accent transition-colors disabled:opacity-60"
                    />
                    <p className="text-[10px] text-steam-tertiary mt-1.5">
                      Leave empty to unlink. Saved via your Supabase profile.
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-steam-tertiary uppercase tracking-widest mb-1.5 block">Email Address</label>
                    <div className="bg-steam-bg border border-steam-border text-steam-secondary font-medium rounded-xl px-4 py-3 opacity-70 cursor-not-allowed">
                      {user?.email}
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={profileLoading || profileSaving}
                      className="px-6 py-3 bg-steam-accent text-white font-bold rounded-xl shadow-lg theme-shadow-accent transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 hover:brightness-110 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 active:brightness-95"
                    >
                      {profileSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                        </>
                      ) : (
                        'Save profile'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Połączenia i Subskrypcja */}
            <section>
              <h2 className="text-[11px] font-bold text-steam-tertiary uppercase tracking-widest mb-3 pl-1">Connections & Billing</h2>
              <div className="bg-steam-card border border-steam-border rounded-2xl shadow-xl overflow-hidden divide-y divide-steam-border/50">
                
                {/* Manage Subscription */}
                <button
                  type="button"
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="w-full flex items-center justify-between p-5 hover:bg-steam-hover cursor-pointer transition-colors group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 text-red-400 rounded-xl group-hover:scale-110 transition-transform">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-steam-text text-base">Manage Subscription</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-steam-secondary capitalize">{subscriptionLabel}</span>
                    <ChevronRight className="w-5 h-5 text-steam-tertiary group-hover:text-steam-secondary" />
                  </div>
                </button>

                {/* Steam Account — status from profile; edit URL in Profile section above */}
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                      <LinkIcon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-steam-text text-base">Steam Account</span>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      profile?.steam_profile_url ? 'text-steam-accent' : 'text-steam-tertiary'
                    }`}
                  >
                    {profileLoading ? '…' : steamStatus}
                  </span>
                </div>

                {/* Change Password */}
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full flex items-center justify-between p-5 hover:bg-steam-hover cursor-pointer transition-colors group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-steam-text text-base block">Change Password</span>
                      {!userHasEmailPassword(user) && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary">
                          Google sign-in
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-steam-tertiary group-hover:text-steam-secondary" />
                </button>

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
              <h2 className="text-[11px] font-bold text-steam-tertiary uppercase tracking-widest mb-3 pl-1">Preferences</h2>
              <div className="bg-steam-card border border-steam-border rounded-2xl shadow-xl overflow-hidden divide-y divide-steam-border/50">
                
                {/* Notifications — not implemented yet */}
                <div
                  className="flex items-center justify-between p-5 opacity-60 cursor-not-allowed"
                  title="Coming soon"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-steam-text text-base block">Notifications</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary">
                        Coming soon
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-12 h-6 rounded-full bg-steam-elevated border border-steam-border relative"
                    aria-hidden
                  >
                    <span className="absolute top-[2px] left-[2px] w-5 h-5 rounded-full bg-steam-card border border-steam-border" />
                  </div>
                </div>

                {/* Currency — not implemented yet */}
                <div
                  className="flex items-center justify-between p-5 opacity-60 cursor-not-allowed"
                  title="Coming soon"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 text-green-400 rounded-xl">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-steam-text text-base block">Currency</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary">
                        Coming soon
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-steam-tertiary tabular-nums">USD</span>
                </div>

                {/* Price source — not implemented yet */}
                <div
                  className="flex items-center justify-between p-5 opacity-60 cursor-not-allowed"
                  title="Coming soon"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-steam-text text-base block">Price Source</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-steam-tertiary">
                        Coming soon
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-steam-tertiary">Steam</span>
                </div>
                
                {/* Appearance */}
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4 text-steam-secondary">
                    <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl">
                      {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </div>
                    <span className="font-bold text-steam-text text-base">Appearance</span>
                  </div>
                  <ThemeToggle variant="segmented" />
                </div>

              </div>
            </section>
          </div>
        )}

        {/* ================= PRIVACY TAB ================= */}
        {activeTab === 'privacy' && (
          <div className="space-y-8 animate-fade-in">
             <section>
              <h2 className="text-[11px] font-bold text-steam-tertiary uppercase tracking-widest mb-3 pl-1">Data & Analytics</h2>
              
              <div className="bg-steam-card border border-steam-border rounded-2xl p-8 relative overflow-hidden shadow-xl">
                {/* Tło - dekoracja */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none -mr-4">
                  <BarChart2 className="w-64 h-64" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="pr-8">
                      <h4 className="font-bold text-steam-text text-xl mb-2">
                        Diagnostics & Firebase
                      </h4>
                      <p className="text-sm text-steam-secondary leading-relaxed max-w-lg">
                        Help us improve Skinvestments by automatically sending anonymous crash reports and usage statistics. <br/><br/>
                        <strong className="text-steam-text">We never send personal inventory data.</strong> Opting out will disable analytics on this device.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1 shrink-0">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={analyticsEnabled} 
                        onChange={() => setAnalyticsEnabled(!analyticsEnabled)} 
                      />
                      <div className="w-14 h-7 bg-steam-elevated peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-steam-card after:border-steam-border after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-steam-accent shadow-inner"></div>
                    </label>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-steam-border/50">
                    <button 
                      onClick={() => navigate('/privacy')} 
                      className="inline-flex items-center gap-2 text-sm text-steam-accent hover:text-steam-accent font-bold transition-all group"
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

      <ManageSubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentPlanId={currentPlanId}
        currentBillingCycle={currentBillingCycle}
        userId={user?.id}
        onSelectPlan={handleSelectPlan}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        user={user}
      />
    </div>
  );
};

export default Settings;