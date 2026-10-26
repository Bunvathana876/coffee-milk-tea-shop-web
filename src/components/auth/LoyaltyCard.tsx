import React from 'react';
import { Award, Gift, Sparkles, Check } from 'lucide-react';

interface LoyaltyCardProps {
  stamps: number;
}

export const LoyaltyCard: React.FC<LoyaltyCardProps> = ({ stamps }) => {
  const currentCycleStamps = stamps % 10;
  const freeDrinksEarned = Math.floor(stamps / 10);
  const drinksNeeded = 10 - currentCycleStamps;

  return (
    <div className="bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-amber-800/40 relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-black text-sm text-white tracking-tight flex items-center gap-1.5">
              Café Punch Card <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            </h4>
            <p className="text-[11px] text-amber-200/80 font-medium">Buy 9 drinks, get 10th FREE!</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-950 font-black text-xs shadow-xs">
          {currentCycleStamps} / 10
        </span>
      </div>

      {/* 10 Stamp Circles Grid (2 rows of 5) */}
      <div className="grid grid-cols-5 gap-2.5 sm:gap-3 my-4 relative z-10">
        {Array.from({ length: 10 }).map((_, index) => {
          const stampNumber = index + 1;
          const isCompleted = index < currentCycleStamps;
          const isFreeDrinkSlot = index === 9;

          return (
            <div
              key={index}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-200 border ${
                isCompleted
                  ? isFreeDrinkSlot
                    ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-md scale-105'
                    : 'bg-amber-500/25 text-amber-300 border-amber-400/50'
                  : isFreeDrinkSlot
                  ? 'bg-white/5 border-amber-400/40 text-amber-300/60'
                  : 'bg-white/5 border-white/10 text-stone-400'
              }`}
            >
              {isCompleted ? (
                isFreeDrinkSlot ? (
                  <Gift className="w-5 h-5 animate-bounce" />
                ) : (
                  <Check className="w-4 h-4 stroke-[3]" />
                )
              ) : isFreeDrinkSlot ? (
                <Gift className="w-4 h-4" />
              ) : (
                <span className="text-xs font-black">{stampNumber}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Reward Status Banner */}
      <div className="mt-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold flex items-center gap-2 relative z-10">
        {freeDrinksEarned > 0 ? (
          <>
            <Gift className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="text-amber-200">
              🎉 You have <strong className="text-white font-black">{freeDrinksEarned} FREE</strong> drink reward(s) ready to redeem!
            </span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="text-stone-300">
              Only <strong className="text-amber-300 font-bold">{drinksNeeded} more</strong> drink{drinksNeeded === 1 ? '' : 's'} until your free café drink!
            </span>
          </>
        )}
      </div>
    </div>
  );
};

