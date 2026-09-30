import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Settings as SettingsIcon, Shield, LogOut, 
  Moon, Sun, DollarSign, BarChart2, ChevronRight,
  CreditCard, Bell, ShoppingCart, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useDashboardScrollRoot } from '@/context/DashboardScrollContext';
import { useScrollEdge } from '@/hooks/useScrollEdge';
import { ManageSubscriptionModal } from '@/components/dashboard/ManageSubscriptionModal';
import { ChangePasswordModal } from '@/components/dashboard/ChangePasswordModal';
import { SteamAccountsPanel } from '@/components/dashboard/SteamAccountsPanel';
import { userHasEmailPassword } from '@/utils/authProviders';
import { BillingCycle, PlanId } from '@/constants/subscriptionPlans';
import { useSubscriptionPlan } from '@/hooks/useSubscriptionPlan';
import { useOwnProfile } from '@/hooks/useOwnProfile';
import { getProfileDisplayName } from '@/utils/profile';
import { ExportDataPanel } from '@/components/dashboard/ExportDataPanel';
import { PortfolioSharePanel } from '@/components/dashboard/PortfolioSharePanel';
import { CookiePreferencesPanel } from '@/components/consent/CookiePreferencesPanel';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { trackSteamEvent } from '@/utils/steamAccounts';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'account' | 'app' | 'privacy'>('account');
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [steamFlash, setSteamFlash] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (searchParams.get('manageSubscription') !== '1') return;
    setActiveTab('account');
    setIsSubscriptionModalOpen(true);
    const next = new URLSearchParams(searchParams);
    next.delete('manageSubscription');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  // Steam OpenID web callback: ?steam_link=success|error&steam_id=...&message=...
  useEffect(() => {
    const steamLink = searchParams.get('steam_link');
    if (!steamLink) return;

    setActiveTab('account');
    if (steamLink === 'success') {
      const steamId = searchParams.get('steam_id');
      setSteamFlash({
        type: 'success',
        message: steamId
          ? `Steam account linked (SteamID ${steamId}). You can sync inventory from Steam accounts below.`
          : 'Steam account linked. You can sync inventory from Steam accounts below.',
      });
      trackSteamEvent('steam_account_linked', { steam_id: steamId ?? undefined });
    } else {
      const message =
        searchParams.get('message') ||
        'Steam could not be linked. Cancel in the Steam window and try Link Steam again.';
      setSteamFlash({ type: 'error', message });
    }

    const next = new URLSearchParams(searchParams);
    next.delete('steam_link');
    next.delete('steam_id');
    next.delete('message');
    next.delete('tab');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (searchParams.get('tab') === 'account') {
      setActiveTab('account');
    }
  }, [searchParams]);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const {
    planId: currentPlanId,
    billingCycle: currentBillingCycle,
    plan: currentPlan,
    updateSubscription,
    canExportCsv,
    canExportFull,
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

  const validateNickname = (value: string): string | null => {
    if (!value.trim()) return 'Add a display name so others can recognize your shared portfolio.';
    return null;
  };

  const validateSteamUrl = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    try {
      const url = new URL(trimmed);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return 'Steam profile URL must start with https:// (or http://).';
      }
      return null;
    } catch {
      return 'Enter a full Steam profile URL, for example https://steamcommunity.com/id/yourname.';
    }
  };

  const handleSaveProfile = async () => {
    setProfileSuccess(false);
    const nickError = validateNickname(nickname);
    if (nickError) {
      setProfileError(nickError);
      return;
    }
    const steamError = validateSteamUrl(steamProfileUrl);
    if (steamError) {
      setProfileError(steamError);
      return;
    }

    try {
      await saveProfile({
        nickname: nickname.trim(),
        steam_profile_url: steamProfileUrl.trim() || null,
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const subscriptionLabel = currentPlan
    ? currentPlan.id === 'free'
      ? 'Starter · Free'
      : currentBillingCycle
        ? `${currentPlan.name} · ${currentBillingCycle}`
        : currentPlan.name
    : 'Starter · Free';

  const handleSelectPlan = (_planId: PlanId, billingCycle: BillingCycle) => {
    updateSubscription(_planId, billingCycle);
  };

  const scrollRoot = useDashboardScrollRoot();
  const tabSentinelRef = useRef<HTMLDivElement>(null);
  const fallbackScrollRef = useRef<HTMLElement | null>(null);
  const edgeRootRef = scrollRoot ?? fallbackScrollRef;
  const tabsEdged = useScrollEdge(edgeRootRef, tabSentinelRef);

  return (
    <div className="text-steam-text animate-fade-in pb-10 min-w-0 overflow-x-hidden">
      
      {/* === HEADER STRONY === */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-steam-text mb-1">
          Settings
        </h1>
        <p className="text-steam-secondary">
          Manage your account, connections, and preferences.
        </p>
      </div>

      {/* Sentinel for sticky switcher scroll-edge */}
      <div ref={tabSentinelRef} className="h-px w-full pointer-events-none" aria-hidden />

      <div
        className="sticky top-14 md:top-0 z-20 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 mb-8 chrome-material py-2.5"
        data-edge={tabsEdged ? 'on' : 'off'}
      >
        <SegmentedControl<'account' | 'app' | 'privacy'>
          aria-label="Settings sections"
          value={activeTab}
          onChange={setActiveTab}
          className="settings-section-switch !flex w-full [&>button]:flex-1 [&>button]:py-2.5 [&>button]:text-sm"
          options={[
            {
              value: 'account',
              label: (
                <span className="inline-flex items-center justify-center gap-2">
                  <User className="w-4 h-4 shrink-0" aria-hidden />
                  Account
                </span>
              ),
            },
            {
              value: 'app',
              label: (
                <span className="inline-flex items-center justify-center gap-2">
                  <SettingsIcon className="w-4 h-4 shrink-0" aria-hidden />
                  App
                </span>
              ),
            },
            {
              value: 'privacy',
              label: (
                <span className="inline-flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 shrink-0" aria-hidden />
                  Privacy
                </span>
              ),
            },
          ]}
        />
      </div>

      {/* Full main width — same as Panel / Inventory */}
      <div className="w-full min-w-0">
        
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
                      <span>Display name and Steam URL updated on your profile.</span>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-steam-tertiary uppercase tracking-widest mb-1.5 block">Display Name</label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => {
                        setNickname(e.target.value);
                        if (profileError) setProfileError(null);
                      }}
                      onBlur={() => {
                        const msg = validateNickname(nickname);
                        if (msg) setProfileError(msg);
                      }}
                      disabled={profileLoading}
                      maxLength={64}
                      className="w-full bg-steam-bg border border-steam-border text-steam-text font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-steam-accent disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-steam-tertiary uppercase tracking-widest mb-1.5 block">
                      Steam Profile URL
                    </label>
                    <input
                      type="url"
                      value={steamProfileUrl}
                      onChange={(e) => {
                        setSteamProfileUrl(e.target.value);
                        if (profileError) setProfileError(null);
                      }}
                      onBlur={() => {
                        const msg = validateSteamUrl(steamProfileUrl);
                        if (msg) setProfileError(msg);
                      }}
                      disabled={profileLoading}
                      placeholder="https://steamcommunity.com/id/…"
                      className="w-full bg-steam-bg border border-steam-border text-steam-text font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-steam-accent disabled:opacity-60"
                    />
                    <p className="text-[10px] text-steam-tertiary mt-1.5">
                      Optional public Steam Community link. Clear the field and save to remove it.
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
                      className="btn-dashboard-primary disabled:opacity-50"
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

            {/* Steam Accounts — real steam_connections link + inventory import */}
            <section className="mt-8">
              <h2 className="text-[11px] font-bold text-steam-tertiary uppercase tracking-widest mb-3 pl-1">
                Steam Sync
              </h2>
              <div className="bg-steam-card border border-steam-border rounded-2xl shadow-xl p-5">
                <SteamAccountsPanel flash={steamFlash} />
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
              <h2 className="dashboard-label mb-3 pl-1">Preferences</h2>
              <div className="dashboard-card overflow-hidden divide-y divide-steam-border/50">
                {/* Appearance — toggle lives in the sidebar */}
                <div className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-4 text-steam-secondary min-w-0">
                    <div className="p-3 bg-steam-accent/10 text-steam-accent rounded-xl shrink-0">
                      {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-steam-text text-base block">Appearance</span>
                      <span className="text-xs text-steam-tertiary">
                        Change light/dark from Appearance at the bottom of the sidebar.
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-steam-secondary capitalize shrink-0">
                    {theme}
                  </span>
                </div>

                <details className="group">
                  <summary className="flex items-center justify-between gap-3 p-5 cursor-pointer list-none text-steam-secondary hover:bg-steam-hover/50 transition-colors">
                    <span className="text-sm font-bold text-steam-text">Coming soon</span>
                    <span className="dashboard-label group-open:hidden">Show</span>
                    <span className="dashboard-label hidden group-open:inline">Hide</span>
                  </summary>
                  <ul className="px-5 pb-5 space-y-3 text-sm text-steam-secondary">
                    <li className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-steam-tertiary shrink-0" />
                      Notifications
                    </li>
                    <li className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-steam-tertiary shrink-0" />
                      Currency (USD)
                    </li>
                    <li className="flex items-center gap-3">
                      <ShoppingCart className="w-4 h-4 text-steam-tertiary shrink-0" />
                      Price source (Steam)
                    </li>
                  </ul>
                </details>
              </div>
            </section>

            <section>
              <h2 className="dashboard-label mb-3 pl-1">
                Portfolio sharing
              </h2>
              <PortfolioSharePanel />
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

            <section>
              <h2 className="text-[11px] font-bold text-steam-tertiary uppercase tracking-widest mb-3 pl-1">
                Cookies &amp; ads
              </h2>
              <CookiePreferencesPanel />
            </section>

            <section>
              <h2 className="text-[11px] font-bold text-steam-tertiary uppercase tracking-widest mb-3 pl-1">
                Data portability
              </h2>
              <ExportDataPanel
                userId={user?.id}
                canExportCsv={canExportCsv}
                canExportFull={canExportFull}
              />
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