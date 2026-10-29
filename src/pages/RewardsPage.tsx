import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Coffee,
  Trophy,
  Gift,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';

interface RewardPerk {
  id: string;
  title: string;
  costStamps: number;
  description: string;
  category: string;
  badge?: string;
  isUnlocked: boolean;
}

export const RewardsPage: React.FC = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const totalStamps = user?.loyalty_stamps || 0;
  const currentStamps = totalStamps % 10;
  const freeDrinksEarned = Math.floor(totalStamps / 10);
  const stampsNeeded = 10 - currentStamps;

  // Determine user tier
  const tierName =
    totalStamps >= 30 ? 'Gold Connoisseur' : totalStamps >= 10 ? 'Silver Brewer' : 'Bronze Roaster';
  const tierColor =
    totalStamps >= 30
      ? 'from-amber-400 via-yellow-500 to-amber-600'
      : totalStamps >= 10
        ? 'from-slate-300 via-stone-300 to-slate-400'
        : 'from-amber-600 via-stone-700 to-espresso-dark';

  const REWARD_PERKS: RewardPerk[] = [
    {
      id: 'free-drink',
      title: 'Free Handcrafted Drink',
      costStamps: 10,
      description: 'Any signature coffee, milk tea, or matcha in any size with full customizations included.',
      category: 'Signature',
      badge: 'Most Popular',
      isUnlocked: currentStamps === 10 || totalStamps >= 10,
    },
    {
      id: 'bakery-discount',
      title: '50% Off Fresh Bakery',
      costStamps: 5,
      description: 'Valid for hand-laminated butter croissants, matcha scones, or Basque burnt cheesecake.',
      category: 'Pastry',
      isUnlocked: currentStamps >= 5,
    },
    {
      id: 'oat-milk',
      title: 'Complimentary Plant Milk Upgrade',
      costStamps: 3,
      description: 'Upgrade your latte or milk tea to premium Barista Oat Milk or Organic Almond Milk on us.',
      category: 'Add-on',
      badge: 'Quick Unlock',
      isUnlocked: currentStamps >= 3,
    },
    {
      id: 'birthday-treat',
      title: 'Annual Birthday Beverage',
      costStamps: 0,
      description: 'Enjoy a celebratory complimentary drink of your choice during your birthday week.',
      category: 'Member Exclusive',
      badge: 'VIP Benefit',
      isUnlocked: isAuthenticated,
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 sm:pb-28 max-w-5xl mx-auto">
      {/* 1. Header & Member Digital Pass Card */}
      <section className="relative rounded-[2.5rem] bg-gradient-to-br from-espresso-dark via-[#26150D] to-espresso-dark text-cream p-7 sm:p-12 overflow-hidden shadow-2xl border border-espresso ring-1 ring-white/10">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-caramel/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-caramel/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 sm:gap-12">
          {/* Left Column: Headline & Status */}
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-caramel/20 border border-caramel/30 text-caramel-soft font-bold text-xs uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-caramel" />
              <span>The Brew Club™ Rewards</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight leading-[1.1]">
              Every 10th cup is <span className="text-caramel-soft italic font-normal">on us.</span>
            </h1>

            <p className="text-xs sm:text-sm text-cream/80 leading-relaxed">
              Earn a digital stamp with every handcrafted drink ordered online or in-store at our BKK1 flagship bar. Unlock free drinks, priority tastings, and bakery treats.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-caramel hover:bg-caramel-soft text-espresso-dark font-black text-xs sm:text-sm shadow-xl transition-all active:scale-95"
              >
                <Coffee className="w-4 h-4" />
                <span>Order Ahead &amp; Earn</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold text-cream transition-all cursor-pointer active:scale-95"
                >
                  <span>Sign In to Save Stamps</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Digital Stamp Pass Widget */}
          <div className="w-full lg:max-w-md bg-espresso-dark/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-white/15 shadow-xl space-y-5">
            {/* Pass Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-cream/60 uppercase tracking-widest block">
                  Digital Stamp Pass
                </span>
                <span className="font-serif font-black text-lg text-cream">
                  {isAuthenticated && user ? user.full_name : 'Guest Collector'}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white bg-gradient-to-r ${tierColor} shadow-xs`}>
                {tierName}
              </span>
            </div>

            {/* 10-Stamp Visual Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-cream/70">
                <span>Progress: {currentStamps} / 10 Stamps</span>
                <span className="text-caramel-soft font-bold">
                  {stampsNeeded === 0
                    ? '🎉 Free Drink Ready!'
                    : `${stampsNeeded} more to next free drink`}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2 sm:gap-2.5 pt-1">
                {Array.from({ length: 10 }).map((_, idx) => {
                  const isStamped = idx < currentStamps;
                  const isReward = idx === 9;

                  return (
                    <div
                      key={idx}
                      className={`h-11 sm:h-12 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 relative ${
                        isStamped
                          ? 'bg-caramel border-caramel text-espresso-dark font-black shadow-md scale-105'
                          : isReward
                            ? 'border-dashed border-caramel/70 bg-caramel/15 text-caramel-soft animate-pulse'
                            : 'border-white/10 bg-white/5 text-white/30'
                      }`}
                      title={isReward ? '10th Drink: Free Reward!' : `Stamp ${idx + 1}`}
                    >
                      {isStamped ? (
                        <Coffee className="w-4 h-4 text-espresso-dark stroke-[2.5]" />
                      ) : isReward ? (
                        <Trophy className="w-4 h-4 text-caramel-soft" />
                      ) : (
                        <span className="text-xs font-bold">{idx + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Summary / Free drinks count */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-cream/80">
                <Gift className="w-3.5 h-3.5 text-caramel-soft" />
                <span>Free drinks unlocked: <strong className="text-cream">{freeDrinksEarned}</strong></span>
              </div>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Auto-stamped</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Unlockable Perks & Rewards Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-caramel">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Redeem &amp; Enjoy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-ink tracking-tight mt-0.5">
              Available Brew Club Rewards
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft mt-1">
              Redeem in your cart during checkout or scan at the cashier.
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-line hover:border-caramel/50 text-xs sm:text-sm font-bold text-ink hover:text-espresso shadow-2xs transition-all shrink-0 active:scale-95"
          >
            <span>Browse Menu</span>
            <ChevronRight className="w-4 h-4 text-caramel" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {REWARD_PERKS.map((perk) => (
            <article
              key={perk.id}
              className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md relative overflow-hidden ${
                perk.isUnlocked
                  ? 'bg-white border-caramel/40 ring-1 ring-caramel/20'
                  : 'bg-white/70 border-line opacity-85'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cream-deep border border-line text-ink-soft">
                    {perk.category}
                  </span>
                  {perk.badge && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-caramel/15 text-caramel border border-caramel/25">
                      {perk.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-lg text-ink leading-snug">
                    {perk.title}
                  </h3>
                  <p className="text-xs text-ink-soft leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-line/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-ink-soft uppercase font-bold block">Cost</span>
                  <span className="font-serif font-black text-sm text-espresso">
                    {perk.costStamps === 0 ? 'Member Perk' : `${perk.costStamps} Stamps`}
                  </span>
                </div>

                {perk.isUnlocked ? (
                  <Link
                    to="/menu"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-caramel hover:bg-caramel-soft text-espresso-dark font-black text-xs shadow-xs transition-colors"
                  >
                    <span>Use Reward</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="text-[11px] font-semibold text-ink-soft/70 bg-cream-deep px-3 py-1 rounded-full border border-line">
                    Need {perk.costStamps - currentStamps} more
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. How It Works: 3 Clean Steps */}
      <section className="bg-white rounded-3xl p-7 sm:p-10 border border-line shadow-2xs space-y-8">
        <div className="text-center max-w-lg mx-auto space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-caramel">
            Simple &amp; Transparent
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-ink tracking-tight">
            How The Brew Club Works
          </h2>
          <p className="text-xs sm:text-sm text-ink-soft">
            No complex point formulas. 1 cup = 1 stamp. Reach 10 stamps = 1 free beverage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-cream border border-line/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-espresso text-caramel flex items-center justify-center font-bold text-sm shadow-xs">
              01
            </div>
            <h3 className="font-serif font-bold text-base text-ink">Order Handcrafted Drinks</h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Order online for pickup or scan your phone at our counter. Every drink you purchase automatically earns you one digital stamp.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cream border border-line/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-espresso text-caramel flex items-center justify-center font-bold text-sm shadow-xs">
              02
            </div>
            <h3 className="font-serif font-bold text-base text-ink">Collect Digital Stamps</h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Your stamps sync instantly to your phone. Check your live balance anytime right here on this page without needing paper cards.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cream border border-line/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-espresso text-caramel flex items-center justify-center font-bold text-sm shadow-xs">
              03
            </div>
            <h3 className="font-serif font-bold text-base text-ink">Enjoy Your Free Beverage</h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Once you hit 10 stamps, apply your reward to any signature pour-over, boba, or ceremonial matcha on your next checkout.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Member Tiers & Privileges Card */}
      <section className="bg-gradient-to-r from-espresso to-espresso-dark text-cream rounded-3xl p-7 sm:p-10 border border-espresso shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-caramel-soft uppercase tracking-wider">
              Exclusive Privileges
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-black">
              Unlock Higher Tiers As You Sip
            </h3>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs text-cream/90 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Lifetime Accumulated Stamps</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-xs font-bold text-amber-500 uppercase">Bronze Roaster (0–9)</span>
            <p className="text-xs text-cream/70">
              1 digital stamp per drink, birthday reward beverage, and instant order pickup.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase">Silver Brewer (10–29)</span>
            <p className="text-xs text-cream/70">
              All Bronze perks + 1 free bakery treat, free syrup upgrades, and seasonal tasting previews.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/10 border border-caramel/40 space-y-2 relative overflow-hidden">
            <span className="text-xs font-bold text-amber-400 uppercase">Gold Connoisseur (30+)</span>
            <p className="text-xs text-cream/70">
              All Silver perks + monthly secret coffee tastings, double stamps every Tuesday, and VIP priority.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RewardsPage;
