"use client";

import { useState, useEffect } from "react";

interface PageSloganProps {
  /**
   * Optional initial slogan from server-side fetch
   * If provided, skips client-side API call
   */
  initialSlogan?: string | null;
}

/**
 * PageSlogan Component
 * Displays a random slogan from the shareables API
 * Accepts initialSlogan prop from server-side fetch to avoid client-side API calls
 * Falls back to client-side fetch if initialSlogan not provided
 */
export function PageSlogan({
  initialSlogan,
}: PageSloganProps = {}): JSX.Element {
  const [sloganMessage, setSloganMessage] = useState<string | null>(
    initialSlogan || null,
  );

  useEffect(() => {
    // If we already have a slogan from server, don't fetch again
    if (initialSlogan) {
      return;
    }

    async function fetchSlogan() {
      try {
        const response = await fetch("/api/collections/shareables");
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          // Pick a random slogan from the results
          const randomIndex = Math.floor(Math.random() * result.data.length);
          const randomSlogan = result.data[randomIndex];
          if (randomSlogan && randomSlogan.slogan) {
            setSloganMessage(randomSlogan.slogan);
          }
        }
      } catch (error) {
        console.error("Error fetching slogan:", error);
        // Fallback to default message on error
        setSloganMessage("The love for the game is all you need.");
      }
    }

    fetchSlogan();
  }, [initialSlogan]);

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-base md:text-base text-orange-600 dark:text-orange-400 leading-relaxed text-center font-medium italic">
        {sloganMessage || "The love for the game is all you need."}
      </p>
    </div>
  );
}
