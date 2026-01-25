"use client";

import { useState, useEffect } from "react";
import { ContentCarousel } from "@/components/ContentCarousel";
import { mapSetsToCarouselCards } from "@/utils/mapSetsToCarouselCards";
import type { CarouselCard } from "@/config/carousel-cards";
import { PageNavigationButtons } from "@/components/PageNavigationButtons";

interface SourceContentSet {
  id: number;
  set_title: string;
  set_summary: string | null;
  set_items: Array<{
    id: number;
    text?: string;
    quote?: string;
    question?: string;
    fact?: string;
    title?: string;
    [key: string]: unknown;
  }>;
  set_type: string[] | null;
  set_theme: string | null;
  set_category: string | null;
  set_difficulty: string | null;
  set_attribution: string | null;
}

export default function DidYouKnowPage(): JSX.Element {
  const [carouselCards, setCarouselCards] = useState<CarouselCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFactoidSets() {
      try {
        const response = await fetch("/api/collections/factoids");
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          const sets = result.data as SourceContentSet[];

          // Progressive rendering: Process first 2 cards immediately
          const INITIAL_CARDS_COUNT = 2;
          const initialSets = sets.slice(0, INITIAL_CARDS_COUNT);
          const remainingSets = sets.slice(INITIAL_CARDS_COUNT);

          // Process and render initial cards immediately
          const initialCards = mapSetsToCarouselCards(initialSets);
          setCarouselCards(initialCards);
          setLoading(false);

          // Process remaining cards in background
          if (remainingSets.length > 0) {
            // Use setTimeout to defer processing until after initial render
            setTimeout(() => {
              const remainingCards = mapSetsToCarouselCards(remainingSets);
              // Append cards progressively
              setCarouselCards((prev) => [...prev, ...remainingCards]);
            }, 0);
          }
        } else {
          // If no sets found, create empty card with inactive cells
          // Use center-tile.webp as fallback for all factoid tiles
          const emptyCard: CarouselCard = {
            id: 3,
            title: "Did You Know?",
            cells: Array.from({ length: 15 }, (_, i) => ({
              id: `inactive-${i}`,
              name: "",
              emoji: "",
              inactiveImage: "/factoids/center-tile.webp",
            })),
          };
          setCarouselCards([emptyCard]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching factoid sets:", error);
        // On error, create empty card with center-tile.webp fallback
        const emptyCard: CarouselCard = {
          id: 3,
          title: "Did You Know?",
          cells: Array.from({ length: 15 }, (_, i) => ({
            id: `inactive-${i}`,
            name: "",
            emoji: "",
            inactiveImage: "/factoids/center-tile.webp",
          })),
        };
        setCarouselCards([emptyCard]);
        setLoading(false);
      }
    }

    fetchFactoidSets();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-20 pb-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Circular Navigation Menu */}
        <div className="mb-6 md:mb-8">
          <PageNavigationButtons
            homeLabel="Home"
            homeHref="/"
            infoTitle="Info"
            infoContent="Discover fascinating hockey facts! Swipe through different collections and tap any tile to reveal an interesting fact. Learn about the sport's history, legendary players, iconic moments, and the culture that makes hockey special."
            extrasTitle="Extras"
            extrasContent="Settings and other options coming soon..."
          />
        </div>

        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
            <span className="text-5xl md:text-6xl lg:text-7xl">💡</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              Did You Know?
            </h1>
          </div>
          <div className="max-w-2xl mx-auto">
            <p className="text-base md:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-center">
              Discover fascinating hockey facts! Swipe through different
              collections and tap any tile to reveal an interesting fact.
            </p>
          </div>
        </div>

        {/* Factoid Collections Carousel */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Loading factoid collections...
            </p>
          </div>
        ) : (
          <ContentCarousel cards={carouselCards} />
        )}

        {/* Call to Action */}
        <div className="text-center mt-8">
          <div className="inline-block px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-light italic">
              Swipe to explore collections · Tap any tile to reveal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
