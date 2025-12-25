"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Navbar(): JSX.Element {
  const pathname = usePathname();
  const userName = "YardBreaker";
  const userScore = "4560 P";

  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-orange-500 transition-colors"
          >
            OnlyHockey
          </Link>

          {/* Right Side: Home, User Info and Theme Switcher */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Home Link */}
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hidden sm:inline ${
                pathname === "/"
                  ? "text-blue-600 dark:text-orange-500"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Home
            </Link>

            {/* User Name */}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
              {userName}
            </span>

            {/* User Score */}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
              {userScore}
            </span>

            {/* Theme Switcher */}
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
