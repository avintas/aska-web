"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { AuthModal } from "./AuthModal";
import { createClient } from "@/utils/supabase/client";

interface UserProfile {
  username: string;
  display_name: string | null;
}

interface UserStats {
  total_points: number;
}

export function Navbar(): JSX.Element {
  const pathname = usePathname();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const supabase = createClient();

  // Define functions BEFORE they're used (fixes hoisting issue)
  const fetchUserData = async (userId: string): Promise<void> => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("username, display_name")
        .eq("user_id", userId)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch stats
      const { data: statsData } = await supabase
        .from("user_stats")
        .select("total_points")
        .eq("user_id", userId)
        .eq("app_id", "hockey")
        .single();

      if (statsData) {
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch user data with loading state
  const fetchUserDataWithLoading = async (userId: string): Promise<void> => {
    setProfileLoading(true);
    try {
      await fetchUserData(userId);
    } finally {
      setProfileLoading(false);
    }
  };

  // Defer user data fetching until after initial render
  const deferUserDataFetch = (userId: string): void => {
    // Use requestIdleCallback if available, otherwise setTimeout
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      requestIdleCallback(
        () => {
          fetchUserDataWithLoading(userId);
        },
        { timeout: 2000 },
      );
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        fetchUserDataWithLoading(userId);
      }, 100);
    }
  };

  const checkAuth = async (): Promise<void> => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        // Defer user data loading - non-critical for initial render
        deferUserDataFetch(session.user.id);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check auth state on mount (critical - needed for UI)
    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Defer user data loading - non-critical for initial render
        deferUserDataFetch(session.user.id);
      } else {
        setProfile(null);
        setStats(null);
        setProfileLoading(false);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setStats(null);
    setProfileLoading(false);
  };

  return (
    <>
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

              {loading || (user && profileLoading) ? (
                // Loading state - show while checking auth or loading profile
                <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
                  Loading...
                </span>
              ) : user && profile ? (
                // Logged in state
                <>
                  {/* User Name */}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                    {profile.display_name || profile.username}
                  </span>

                  {/* User Score */}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                    {stats?.total_points || 0} P
                  </span>

                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:inline"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                // Not logged in state
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-sm font-medium text-blue-600 dark:text-orange-500 hover:underline transition-colors"
                >
                  Sign In
                </button>
              )}

              {/* Theme Switcher */}
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
