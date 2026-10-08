"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { allowedPaths } from "../model/allowed-paths";
import { manuItems } from "../model/constants";

export const BottomNavigation = () => {
  const pathname = usePathname();
  const activeIndex = manuItems.findIndex((item) => pathname === item.path || pathname.startsWith(`${item.path}/`));
  return (
    <div
      className={cn(
        "fixed right-4 bottom-4 left-4 z-30  rounded-full border border-secondary bg-white/60 backdrop-blur-xs shadow-lg",
        allowedPaths.includes(pathname) ? "" : "hidden",
      )}
    >
      <ul className="relative flex items-center justify-between rounded-full p-1">
        {/* Sliding Background */}
        <div
          className="bg-primary absolute top-1 bottom-1 left-1 rounded-full transition-transform duration-300 ease-in-out"
          style={{
            width: `calc((100% - 0.5rem) / ${manuItems.length})`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />

        {manuItems.map((item) => (
          <li key={item.label} className="flex-1">
            <Link
              href={item.path}
              className={`relative z-10 flex items-center justify-center rounded-full p-2.5 ${
                pathname === item.path || pathname.startsWith(`${item.path}/`)
                  ? "text-primary-foreground"
                  : "text-slate-800"
              }`}
            >
              <item.icon />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
