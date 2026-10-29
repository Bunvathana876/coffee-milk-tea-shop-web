'use client';

import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Coffee,
  ShoppingBag,
  Trophy,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/features/cart/useCart';
import GooeyNav, { type GooeyNavItem } from './GooeyNav';

export interface BottomNavBarProps {
  className?: string;
  defaultIndex?: number;
  stickyBottom?: boolean;
  onOpenProfile?: () => void;
}

function getRouteIndex(pathname: string, fallback: number): number {
  if (pathname === '/profile') return 4;
  if (pathname === '/rewards') return 3;
  if (pathname === '/cart' || pathname === '/checkout' || pathname.startsWith('/receipt')) return 2;
  if (pathname === '/menu') return 1;
  if (pathname === '/') return 0;
  return fallback;
}

export function BottomNavBar({
  className,
  defaultIndex = 0,
  stickyBottom = true,
}: BottomNavBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalQuantity } = useCart();

  const activeIndex = getRouteIndex(location.pathname, defaultIndex);

  const items: GooeyNavItem[] = [
    {
      label: 'Home',
      href: '/',
      icon: <Home size={19} strokeWidth={2.2} />,
    },
    {
      label: 'Menu',
      href: '/menu',
      icon: <Coffee size={19} strokeWidth={2.2} />,
    },
    {
      label: 'Cart',
      href: '/cart',
      icon: (
        <span className="relative inline-flex items-center justify-center">
          <ShoppingBag size={19} strokeWidth={2.2} />
          {totalQuantity > 0 && (
            <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-caramel text-espresso-dark text-[9px] font-black flex items-center justify-center shadow-xs">
              {totalQuantity}
            </span>
          )}
        </span>
      ),
    },
    {
      label: 'Rewards',
      href: '/rewards',
      icon: <Trophy size={19} strokeWidth={2.2} />,
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: <User size={19} strokeWidth={2.2} />,
    },
  ];

  const handleChange = (_index: number, item: GooeyNavItem) => {
    if (item.href) {
      navigate(item.href);
    }
  };

  return (
    <div
      role="navigation"
      aria-label="Bottom Navigation"
      className={cn(
        'transition-all duration-300',
        stickyBottom && 'fixed inset-x-0 bottom-4 sm:bottom-6 mx-auto z-40 w-fit flex justify-center max-w-[96vw]',
        className
      )}
    >
      <GooeyNav
        items={items}
        activeIndex={activeIndex}
        onChange={handleChange}
        theme="dark"
        color="#D97724"
        activeTextColor="#FFFFFF"
        colors={['#D97724', '#F59E0B', '#B45309', '#F97316']}
        size="lg"
        frame={true}
        particleCount={16}
        spread={56}
        animationTime={580}
        timeVariance={280}
        gooeyness={0.56}
        wobble={0.5}
        hoverEffect={true}
      />
    </div>
  );
}

export default BottomNavBar;
