import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Coffee, Flame, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';

const STORY_IMAGE =
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&auto=format&fit=crop&q=80';

const CRAFT_HIGHLIGHTS = [
  {
    icon: <Coffee className="w-5 h-5 text-caramel" />,
    title: 'Highland Single-Origin Arabica',
    text: 'Sourced directly from smallholder farms in Mondulkiri and Da Lat, roasted in weekly small batches.',
  },
  {
    icon: <Flame className="w-5 h-5 text-caramel" />,
    title: '90-Min Muscovado Pearl Simmer',
    text: 'Simmered fresh every 3 hours in unrefined brown sugar for a warm, chewy center and caramel finish.',
  },
  {
    icon: <HeartHandshake className="w-5 h-5 text-caramel" />,
    title: 'Whole Farm Milk & Organic Oat',
    text: 'Fresh grass-fed dairy and creamy barista oat milk with zero artificial creamers or hydrogenated oils.',
  },
];

export const StorySection: React.FC = () => {
  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="scroll-mt-24 rounded-[2.5rem] bg-cream-deep/60 border border-line p-6 sm:p-10 lg:p-14 transition-colors"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Authentic Photography with Subtle Badge */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-lg border border-line bg-espresso-dark">
            <img
              src={STORY_IMAGE}
              alt="Artisan barista carefully hand-pouring specialty filter coffee over roasted beans"
              loading="lazy"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso-dark/70 via-transparent to-transparent" />

            {/* Floating Quality Badge */}
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-espresso-dark/85 backdrop-blur-md border border-white/15 text-cream flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-caramel-soft block">
                  Ethically Sourced
                </span>
                <p className="font-serif font-bold text-sm text-cream">
                  100% Highland Arabica
                </p>
              </div>
              <span className="w-8 h-8 rounded-xl bg-caramel text-espresso-dark flex items-center justify-center font-black">
                <Sparkles className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Narrative & Craft Pillars */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-soft border border-sage/20 text-xs font-bold text-sage">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Story &amp; Craft</span>
            </div>

            <h2
              id="story-heading"
              className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight leading-[1.1]"
            >
              Rooted in Highland Soil, Brewed with Daily Devotion.
            </h2>

            <p className="text-sm sm:text-base text-ink-soft leading-relaxed max-w-2xl">
              Brew &amp; Boba was founded in Phnom Penh with a singular conviction: your morning coffee and afternoon boba deserve honest craft, clean ingredients, and zero shortcuts.
            </p>
            <p className="text-xs sm:text-sm text-ink-soft leading-relaxed max-w-2xl">
              From hand-selecting micro-lots in the cool plateaus of Mondulkiri to slow-simmering natural tapioca pearls every three hours in dark muscovado cane sugar, every single drink is dialed in to your exact sweetness and preference.
            </p>
          </div>

          {/* Three Craft Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            {CRAFT_HIGHLIGHTS.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-line shadow-2xs space-y-2 flex flex-col justify-between"
              >
                <div className="w-9 h-9 rounded-xl bg-cream-deep border border-line/60 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-ink mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-ink-soft leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Clear Call to Action */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-espresso hover:bg-espresso-dark text-cream font-bold text-sm shadow-sm active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso focus-visible:ring-offset-2"
            >
              <span>Taste The Difference · View Menu</span>
              <ArrowRight className="w-4 h-4 text-caramel-soft" />
            </Link>

            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
              <CheckCircle2 className="w-4 h-4 text-sage" />
              <span>Served fresh daily from 7:00 AM</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

