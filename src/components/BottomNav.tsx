"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Battery", icon: "🔋" },
  { href: "/history", label: "History", icon: "📜" },
  { href: "/categories", label: "Actions", icon: "🏷️" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 border-t border-foreground/10 bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)] z-30">
      <div className="mx-auto max-w-md flex">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs ${
                active ? "text-foreground" : "text-foreground/45"
              }`}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
