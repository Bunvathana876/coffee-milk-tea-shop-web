import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  Award,
  LogOut,
  Coffee,
  Sparkles,
  Trophy,
  Heart,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Store,
  Flame,
  ExternalLink,
  Smartphone,
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { LoyaltyCard } from '../components/auth/LoyaltyCard';

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  // Coffee preferences (stored locally for seamless personalization)
  const [sweetness, setSweetness] = useState<string>(() => {
    return localStorage.getItem('brew_pref_sweetness') || '50% Half Sweet';
  });
  const [iceLevel, setIceLevel] = useState<string>(() => {
    return localStorage.getItem('brew_pref_ice') || 'Regular Ice';
  });
  const [milkPref, setMilkPref] = useState<string>(() => {
    return localStorage.getItem('brew_pref_milk') || 'Barista Oat Milk';
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = () => {
    localStorage.setItem('brew_pref_sweetness', sweetness);
    localStorage.setItem('brew_pref_ice', iceLevel);
    localStorage.setItem('brew_pref_milk', milkPref);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2400);
  };

  const totalStamps = user?.loyalty_stamps || 0;
  const currentStamps = totalStamps % 10;
  const freeDrinksEarned = Math.floor(totalStamps / 10);
  const tierName =
    totalStamps >= 30 ? 'Gold Connoisseur' : totalStamps >= 10 ? 'Silver Brewer' : 'Bronze Member';

  if (!isAuthenticated || !user) {
    return (
      <div className="space-y-12 sm:space-y-16 pb-20 sm:pb-28 max-w-4xl mx-auto">
        {/* Guest Hero Section */}
        <section className="relative rounded-[2.5rem] bg-gradient-to-br from-espresso-dark via-[#26150D] to-espresso-dark text-cream p-8 sm:p-14 overflow-hidden shadow-2xl border border-espresso ring-1 ring-white/10 text-center">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-caramel/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-caramel/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-caramel/20 border border-caramel/40 text-caramel mx-auto flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-caramel/20 border border-caramel/30 text-caramel-soft font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Member Experience
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-cream">
                Your Café Profile
              </h1>
              <p className="text-cream/80 text-sm sm:text-base leading-relaxed">
                Join <strong className="text-caramel-soft">The Brew Club™</strong> to track your digital
                loyalty stamps, unlock complimentary drinks, customize taste preferences, and check out with 1-tap ease.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-caramel hover:bg-caramel-soft text-espresso-dark font-black text-sm tracking-wide shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Sign In or Join Club</span>
              </button>
              <Link
                to="/menu"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-cream border border-white/15 font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2"
              >
                <Coffee className="w-4 h-4 text-caramel-soft" />
                <span>Explore Menu First</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Grid for Guests */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="font-serif font-black text-2xl text-ink">Member Privileges</h2>
            <p className="text-xs sm:text-sm text-ink-soft">
              Every handcrafted cup brings you closer to exclusive rewards
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-6 rounded-3xl bg-cream-card border border-line space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-caramel flex items-center justify-center font-black">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-black text-lg text-ink">Free Drink Stamp Pass</h3>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                Earn 1 digital stamp for every signature drink. Get a free beverage of your choice after every 10 stamps.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-cream-card border border-line space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-black">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-black text-lg text-ink">Personalized Taste</h3>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                Save your favorite sugar percentage, ice level, and oat milk preferences for automated 1-click orders.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-cream-card border border-line space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-black text-lg text-ink">Express Pick-Up</h3>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                Order ahead from your device to skip the counter queue and pick up fresh handcrafted cups immediately.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-10 sm:space-y-12 pb-24 sm:pb-32 max-w-5xl mx-auto">
      {/* 1. Header Profile Banner */}
      <section className="relative rounded-[2.5rem] bg-gradient-to-br from-espresso-dark via-[#26150D] to-espresso-dark text-cream p-7 sm:p-10 overflow-hidden shadow-2xl border border-espresso ring-1 ring-white/10">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-caramel/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-caramel/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
          {/* User Info Avatar & Title */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-caramel text-espresso-dark flex items-center justify-center font-serif font-black text-2xl sm:text-3xl shadow-xl shrink-0 ring-4 ring-white/10">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1 sm:space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-black text-cream tracking-tight">
                  {user.full_name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-caramel/20 text-caramel-soft border border-caramel/30 text-xs font-black uppercase tracking-wider">
                  {tierName}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-cream/75 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-caramel" />
                  {user.phone}
                </span>
                {user.email && (
                  <span className="hidden sm:flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-caramel" />
                    {user.email}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/rewards"
              className="px-4 sm:px-5 py-2.5 rounded-full bg-caramel hover:bg-caramel-soft text-espresso-dark font-black text-xs sm:text-sm tracking-wide shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              <span>Rewards & Perks</span>
            </Link>
            <button
              type="button"
              onClick={logout}
              className="px-3.5 py-2.5 rounded-full bg-white/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-white/15 hover:border-rose-400/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Bar */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-cream-card border border-line shadow-xs">
          <div className="text-xs font-bold text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-caramel" />
            Current Stamps
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-ink">
            {currentStamps}
            <span className="text-sm font-semibold text-ink-muted"> / 10</span>
          </div>
          <div className="text-[11px] text-ink-soft mt-1">
            {10 - currentStamps} more to next free drink
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-cream-card border border-line shadow-xs">
          <div className="text-xs font-bold text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
            <Coffee className="w-3.5 h-3.5 text-caramel" />
            Free Drinks
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-600">
            {freeDrinksEarned}
          </div>
          <div className="text-[11px] text-ink-soft mt-1">Available to claim now</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-cream-card border border-line shadow-xs">
          <div className="text-xs font-bold text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-caramel" />
            Lifetime Stamps
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-ink">{totalStamps}</div>
          <div className="text-[11px] text-ink-soft mt-1">Member since 2026</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-cream-card border border-line shadow-xs">
          <div className="text-xs font-bold text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-caramel" />
            Club Tier
          </div>
          <div className="mt-2 text-base sm:text-lg font-black text-ink truncate">{tierName}</div>
          <div className="text-[11px] text-caramel font-semibold mt-1">Tier Perks Active</div>
        </div>
      </section>

      {/* 3. Loyalty Stamp Pass & Account Details */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Digital Stamp Pass */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-black text-xl sm:text-2xl text-ink flex items-center gap-2">
              <Trophy className="w-5 h-5 text-caramel" />
              Digital Stamp Pass
            </h2>
            <Link
              to="/rewards"
              className="text-xs font-bold text-caramel hover:text-caramel-soft flex items-center gap-1"
            >
              <span>Explore Perks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-cream-card p-6 sm:p-7 rounded-3xl border border-line shadow-xs">
            <LoyaltyCard stamps={totalStamps} />
          </div>

          {/* Quick Hub Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Link
              to="/rewards"
              className="p-4 rounded-2xl bg-cream-card border border-line hover:border-caramel/40 transition-all flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-espresso/5 text-espresso flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-caramel" />
                </div>
                <div>
                  <div className="font-black text-sm text-ink group-hover:text-caramel transition-colors">
                    Rewards &amp; Perks
                  </div>
                  <div className="text-[11px] text-ink-muted">Redeem free drinks &amp; upgrades</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-muted group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/menu"
              className="p-4 rounded-2xl bg-cream-card border border-line hover:border-caramel/40 transition-all flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-espresso/5 text-espresso flex items-center justify-center">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-black text-sm text-ink group-hover:text-caramel transition-colors">
                    Order Ahead
                  </div>
                  <div className="text-[11px] text-ink-muted">Skip the line at BKK1</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-muted group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Column: Preferences & Account Settings */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="font-serif font-black text-xl sm:text-2xl text-ink flex items-center gap-2">
            <Sliders className="w-5 h-5 text-caramel" />
            Taste Preferences
          </h2>

          <div className="bg-cream-card p-6 rounded-3xl border border-line space-y-5 shadow-xs">
            <p className="text-xs text-ink-soft">
              Set your go-to cup preferences so our baristas can tailor your order ahead with one click.
            </p>

            {/* Sweetness */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink flex items-center justify-between">
                <span>Default Sweetness</span>
                <span className="text-caramel text-[11px]">{sweetness}</span>
              </label>
              <select
                value={sweetness}
                onChange={(e) => setSweetness(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-line text-xs font-bold text-ink focus:border-caramel outline-none cursor-pointer"
              >
                <option value="100% Full Sweet">100% Full Sweet</option>
                <option value="70% Less Sweet">70% Less Sweet</option>
                <option value="50% Half Sweet">50% Half Sweet (Recommended)</option>
                <option value="30% Micro Sweet">30% Micro Sweet</option>
                <option value="0% Sugar-Free">0% Sugar-Free (Pure Tea &amp; Coffee)</option>
              </select>
            </div>

            {/* Ice Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink flex items-center justify-between">
                <span>Default Ice Level</span>
                <span className="text-caramel text-[11px]">{iceLevel}</span>
              </label>
              <select
                value={iceLevel}
                onChange={(e) => setIceLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-line text-xs font-bold text-ink focus:border-caramel outline-none cursor-pointer"
              >
                <option value="Regular Ice">Regular Ice (Chilled)</option>
                <option value="Less Ice">Less Ice (More Volume)</option>
                <option value="No Ice">No Ice</option>
                <option value="Warm / Hot">Warm / Hot Drink</option>
              </select>
            </div>

            {/* Milk Preference */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink flex items-center justify-between">
                <span>Milk Preference</span>
                <span className="text-caramel text-[11px]">{milkPref}</span>
              </label>
              <select
                value={milkPref}
                onChange={(e) => setMilkPref(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-line text-xs font-bold text-ink focus:border-caramel outline-none cursor-pointer"
              >
                <option value="Barista Oat Milk">Barista Oat Milk (Creamy &amp; Nutty)</option>
                <option value="Fresh Whole Milk">Fresh Whole Milk (Classic)</option>
                <option value="Organic Almond Milk">Organic Almond Milk (Light)</option>
                <option value="Lactose-Free Milk">Lactose-Free Milk</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleSavePreferences}
              className="w-full py-2.5 rounded-xl bg-espresso hover:bg-espresso-dark text-cream font-black text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 text-caramel-soft" />
                  <span>Save Preferences</span>
                </>
              )}
            </button>
          </div>

          {/* Account Details Box */}
          <div className="bg-cream-card p-6 rounded-3xl border border-line space-y-4 shadow-xs">
            <div className="text-xs font-black uppercase tracking-wider text-ink-muted">
              Account Information
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-line">
                <span className="text-ink-soft">Full Name</span>
                <span className="font-black text-ink">{user.full_name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-line">
                <span className="text-ink-soft">Phone</span>
                <span className="font-black text-ink">{user.phone}</span>
              </div>
              {user.email && (
                <div className="flex items-center justify-between py-2 border-b border-line">
                  <span className="text-ink-soft">Email</span>
                  <span className="font-black text-ink">{user.email}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2">
                <span className="text-ink-soft">Default Store</span>
                <span className="font-black text-caramel flex items-center gap-1">
                  <Store className="w-3.5 h-3.5" />
                  BKK1 Flagship
                </span>
              </div>
            </div>
          </div>

          {/* Connected Apps & Operations Box */}
          <div className="bg-cream-card p-6 rounded-3xl border border-line space-y-4 shadow-xs">
            <div className="text-xs font-black uppercase tracking-wider text-ink-muted">
              Connected Platform Apps
            </div>

            <div className="space-y-3">
              <a
                href="#mobile-app"
                className="flex items-center justify-between p-3 rounded-2xl bg-white border border-line hover:border-caramel/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-caramel flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-ink group-hover:text-caramel transition-colors">
                      Mobile App (Flutter)
                    </div>
                    <div className="text-[11px] text-ink-muted">Synced with {user.phone}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Synced
                </span>
              </a>

              <a
                href="http://localhost:5174"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-white border border-line hover:border-caramel/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-espresso/5 text-espresso flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-caramel" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-ink group-hover:text-caramel transition-colors flex items-center gap-1">
                      <span>Admin Operations Portal</span>
                      <ExternalLink className="w-3 h-3 text-ink-muted" />
                    </div>
                    <div className="text-[11px] text-ink-muted">Kitchen display, catalog &amp; orders</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-caramel">:5174</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
