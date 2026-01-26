"use client";

import { useState, useEffect } from "react";
import { ContentCarousel } from "@/components/ContentCarousel";
import { mapSetsToCarouselCards } from "@/utils/mapSetsToCarouselCards";
import type { CarouselCard } from "@/config/carousel-cards";
import type { TriviaGameSession } from "@/shared/types/trivia-game";
import { createGameSession, answerQuestion } from "@/utils/triviaGameSession";
import type { HubCell } from "@/components/HubGrid";
import { PageNavigationButtons } from "@/components/PageNavigationButtons";
import { PageHeader } from "@/components/PageHeader";

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

export default function TriviaArenaPage(): JSX.Element {
  const [carouselCards, setCarouselCards] = useState<CarouselCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameSession, setGameSession] = useState<TriviaGameSession | null>(
    null,
  );

  useEffect(() => {
    async function fetchTriviaSets() {
      try {
        // Fetch both trivia types
        const [mcResponse, tfResponse] = await Promise.all([
          fetch("/api/collections/trivia-multiple-choice"),
          fetch("/api/collections/trivia-true-false"),
        ]);

        const [mcResult, tfResult] = await Promise.all([
          mcResponse.json(),
          tfResponse.json(),
        ]);

        // Combine both result sets
        const allSets = [
          ...(mcResult.success && mcResult.data ? mcResult.data : []),
          ...(tfResult.success && tfResult.data ? tfResult.data : []),
        ];

        const result = {
          success: allSets.length > 0,
          data: allSets,
        };

        if (result.success && result.data && result.data.length > 0) {
          const sets = result.data as SourceContentSet[];

          // Progressive rendering: Process first 2 cards immediately
          const INITIAL_CARDS_COUNT = 2;
          const initialSets = sets.slice(0, INITIAL_CARDS_COUNT);
          const remainingSets = sets.slice(INITIAL_CARDS_COUNT);

          // Process all sets to create hub card (needs all cards for navigation)
          const allCollectionCards = mapSetsToCarouselCards(sets);

          // Process initial collection cards immediately
          const initialCollectionCards = mapSetsToCarouselCards(initialSets);

          // Create Card 0 (Hub) - tiles represent collections, clicking navigates to that card
          // Fill sequentially, keeping center tile (index 7) unoccupied
          const CENTER_TILE_INDEX = 7;

          // Initialize array with 15 null cells
          const hubCells: (HubCell | null)[] = Array.from(
            { length: 15 },
            () => null,
          );

          // Fill tiles sequentially, skipping center tile
          // Use allCollectionCards for hub navigation (even if not all rendered yet)
          let gameIndex = 0; // Track which game we're placing
          for (let i = 0; i < 15; i++) {
            // Skip center tile (index 7)
            if (i === CENTER_TILE_INDEX) {
              // Center tile uses trivia-arena center-tile.webp
              hubCells[i] = {
                id: `hub-inactive-${i}`,
                name: "",
                emoji: "",
                inactiveImage: "/trivia-arena/center-tile.webp",
              };
              continue;
            }

            // Place trivia game if available
            if (gameIndex < allCollectionCards.length) {
              const card = allCollectionCards[gameIndex];
              const cardIndex = gameIndex + 1; // Card index will be index + 1 (since Card 0 is index 0)

              // Get collection title for display
              const displayTitle = card.title || `Collection ${cardIndex}`;

              // Truncate title for tile display (show first 30 chars max)
              const truncatedTitle =
                displayTitle.length > 30
                  ? `${displayTitle.substring(0, 30)}...`
                  : displayTitle;

              hubCells[i] = {
                id: `hub-${card.id}`,
                name: truncatedTitle.toUpperCase(),
                emoji: "🎯",
                description: displayTitle, // Full title for tooltip/accessibility
                badge: "PLAY",
                badgeColor: "bg-green-500",
                targetCardIndex: cardIndex, // Store target card index for navigation
                inactiveImage: `/hcip-${(i % 40) + 1}.png`,
              };
              gameIndex++;
            } else {
              // Fill remaining positions with inactive cells using trivia-arena fallback
              hubCells[i] = {
                id: `hub-inactive-${i}`,
                name: "",
                emoji: "",
                inactiveImage: "/trivia-arena/center-tile.webp",
              };
            }
          }

          const hubCard: CarouselCard = {
            id: 0,
            title: "Trivia Collections",
            cells: hubCells as HubCell[],
          };

          // Render hub card + initial collection cards immediately
          const initialCards = [hubCard, ...initialCollectionCards];
          setCarouselCards(initialCards);
          setLoading(false);

          // Process remaining collection cards in background
          if (remainingSets.length > 0) {
            // Use setTimeout to defer processing until after initial render
            setTimeout(() => {
              const remainingCards = mapSetsToCarouselCards(remainingSets);
              // Append cards progressively (after hub card)
              setCarouselCards((prev) => {
                // prev[0] is hub card, append remaining after it
                return [prev[0], ...prev.slice(1), ...remainingCards];
              });
            }, 0);
          }
        } else {
          // If no sets found, create empty card with inactive cells
          // Use center-tile.webp as fallback for all trivia tiles
          const emptyCard: CarouselCard = {
            id: 2,
            title: "Trivia Arena",
            cells: Array.from({ length: 15 }, (_, i) => ({
              id: `inactive-${i}`,
              name: "",
              emoji: "",
              inactiveImage: "/trivia-arena/center-tile.webp",
            })),
          };
          setCarouselCards([emptyCard]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching trivia sets:", error);
        // On error, create empty card with center-tile.webp fallback
        const emptyCard: CarouselCard = {
          id: 2,
          title: "Trivia Arena",
          cells: Array.from({ length: 15 }, (_, i) => ({
            id: `inactive-${i}`,
            name: "",
            emoji: "",
            inactiveImage: "/trivia-arena/center-tile.webp",
          })),
        };
        setCarouselCards([emptyCard]);
        setLoading(false);
      }
    }

    fetchTriviaSets();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-16 pb-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Circular Navigation Menu */}
        <div className="mb-6 md:mb-8">
          <PageNavigationButtons
            homeLabel="Home"
            homeHref="/"
            infoTitle="Info"
            infoContent="Test your hockey knowledge! Each card represents a trivia collection. Swipe through different themes and tap any tile to play. Challenge yourself with multiple choice and true/false questions about hockey history, players, teams, and the game we love."
            extrasTitle="Extras"
            extrasContent="Settings and other options coming soon..."
          />
        </div>

        {/* Header Section */}
        <PageHeader
          title="Trivia Arena"
          subtitle="Test your hockey knowledge! Each card represents a trivia collection. Swipe through different themes and tap any tile to play. Challenge yourself with multiple choice and true/false questions about hockey history, players, teams, and the game we love."
          emoji="🎯"
        />

        {/* Trivia Collections Carousel */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Loading trivia games...
            </p>
          </div>
        ) : (
          <ContentCarousel
            cards={carouselCards}
            isTriviaMode={true}
            gameSession={gameSession}
            onStartGame={(questionCount, cardId) => {
              const newSession = createGameSession(questionCount, cardId);
              setGameSession(newSession);
            }}
            onAnswerQuestion={(tileId, answer, questionData) => {
              if (!gameSession)
                return {
                  isCorrect: false,
                  pointsGained: 0,
                  correctAnswer: "",
                  explanation: null,
                };

              const result = answerQuestion(
                gameSession,
                tileId,
                answer,
                questionData,
              );

              // Update session state (answerQuestion mutates gameSession, so create new object for React)
              setGameSession({
                ...gameSession,
                answeredTiles: new Set(gameSession.answeredTiles),
                totalAnswered: gameSession.totalAnswered,
                correct: gameSession.correct,
                score: gameSession.score,
              });

              // Check if game is complete
              if (gameSession.totalAnswered >= gameSession.questionCount) {
                // Game complete - will be handled by ContentCarousel
              }

              return result;
            }}
            onUpdateTileState={(
              tileId,
              isAnswered,
              isCorrect,
              pointsGained,
            ) => {
              // Update the tile in carouselCards
              setCarouselCards((prevCards) =>
                prevCards.map((card) => ({
                  ...card,
                  cells: card.cells.map((cell) =>
                    cell?.id === tileId
                      ? {
                          ...cell,
                          isAnswered,
                          isCorrect,
                          pointsGained,
                        }
                      : cell,
                  ),
                })),
              );
            }}
            onResetGame={() => {
              // Reset game session
              setGameSession(null);
              // Reset all tile states - clear trivia game fields
              setCarouselCards((prevCards) =>
                prevCards.map((card) => ({
                  ...card,
                  cells: card.cells.map((cell) =>
                    cell
                      ? {
                          ...cell,
                          isAnswered: false,
                          isCorrect: undefined,
                          pointsGained: undefined,
                        }
                      : cell,
                  ),
                })),
              );
            }}
          />
        )}

        {/* Call to Action */}
        <div className="text-center mt-8">
          <div className="inline-block px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-light italic">
              Swipe to explore collections · Tap any tile to play
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
