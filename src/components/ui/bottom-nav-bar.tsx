"use client";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Coffee,
  Receipt,
  ShoppingBag,
  Trophy,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useCart } from "@/features/cart/useCart";
import { useAuth } from "@/features/auth/AuthContext";

const navItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Menu", icon: Coffee, path: "/menu" },
  { label: "Orders", icon: Receipt, path: "/orders" },
  { label: "Cart", icon: ShoppingBag, path: "/cart" },
  { label: "Rewards", icon: Trophy, path: "/#rewards" },
  { label: "Profile", icon: User, path: "#profile" },
];

const MOBILE_LABEL_WIDTH = 68;

type BottomNavBarProps = {
  className?: string;
  defaultIndex?: number;
  stickyBottom?: boolean;
  onOpenProfile?: () => void;
};

function getRouteIndex(pathname: string, hash: string, fallback: number): number {
  if (hash === "#rewards") return 4;
  if (pathname === "/menu") return 1;
  if (pathname === "/orders" || pathname.startsWith("/receipt")) return 2;
  if (pathname === "/cart" || pathname === "/checkout") return 3;
  if (pathname === "/") return 0;
  return fallback;
}

export function BottomNavBar({
  className,
  defaultIndex = 0,
  stickyBottom = false,
  onOpenProfile,
}: BottomNavBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalQuantity } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();

  const [manualOverride, setManualOverride] = useState<{
    key: string;
    index: number;
  } | null>(null);

  const locationKey = `${location.pathname}${location.hash}`;
  const derivedIndex = getRouteIndex(location.pathname, location.hash, defaultIndex);
  const activeIndex =
    manualOverride && manualOverride.key === locationKey
      ? manualOverride.index
      : derivedIndex;

  const handleItemClick = (idx: number, path: string) => {
    setManualOverride({ key: locationKey, index: idx });

    if (path === "#profile") {
      if (isAuthenticated && onOpenProfile) {
        onOpenProfile();
      } else {
        openAuthModal();
      }
      return;
    }

    if (path === "/#rewards") {
      if (location.pathname === "/") {
        const el = document.getElementById("rewards");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }
      navigate("/#rewards");
      return;
    }

    navigate(path);
  };

  return (
    <motion.nav
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      role="navigation"
      aria-label="Bottom Navigation"
      className={cn(
        "bg-card/95 backdrop-blur-md dark:bg-card border border-border dark:border-sidebar-border rounded-full flex items-center p-1.5 shadow-[0_12px_40px_rgba(42,22,13,0.18)] space-x-1 min-w-[310px] max-w-[95vw] h-[54px]",
        stickyBottom && "fixed inset-x-0 bottom-4 mx-auto z-40 w-fit",
        className,
      )}
    >
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = activeIndex === idx;
        const isCart = item.label === "Cart";

        return (
          <motion.button
            key={item.label}
            whileTap={{ scale: 0.96 }}
            className={cn(
              "flex items-center gap-0 px-3 py-2 rounded-full transition-colors duration-200 relative h-10 min-w-[44px] min-h-[40px] max-h-[44px] cursor-pointer",
              isActive
                ? "bg-espresso text-cream shadow-xs gap-1.5"
                : "bg-transparent text-muted-foreground hover:bg-muted hover:text-ink",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-espresso",
            )}
            onClick={() => handleItemClick(idx, item.path)}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            type="button"
          >
            <div className="relative flex items-center justify-center">
              <Icon
                size={20}
                strokeWidth={isActive ? 2.4 : 2}
                aria-hidden
                className={cn(
                  "transition-colors duration-200 shrink-0",
                  isActive ? "text-caramel-soft" : "text-current",
                )}
              />
              {isCart && totalQuantity > 0 && (
                <span
                  className={cn(
                    "absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full text-[9px] font-black flex items-center justify-center shadow-2xs",
                    isActive
                      ? "bg-caramel text-espresso-dark"
                      : "bg-espresso text-cream",
                  )}
                >
                  {totalQuantity}
                </span>
              )}
            </div>

            <motion.div
              initial={false}
              animate={{
                width: isActive ? `${MOBILE_LABEL_WIDTH}px` : "0px",
                opacity: isActive ? 1 : 0,
                marginLeft: isActive ? "6px" : "0px",
              }}
              transition={{
                width: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.19 },
                marginLeft: { duration: 0.19 },
              }}
              className={cn("overflow-hidden flex items-center max-w-[68px]")}
            >
              <span
                className={cn(
                  "font-bold text-xs whitespace-nowrap select-none transition-opacity duration-200 overflow-hidden text-ellipsis leading-[1.9]",
                  isActive ? "text-cream" : "opacity-0",
                )}
                title={item.label}
              >
                {item.label}
              </span>
            </motion.div>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}

export default BottomNavBar;
