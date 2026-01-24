"use client";

import { useState, useEffect } from "react";
import { ContentCarousel } from "@/components/ContentCarousel";
import { mapSetsToCarouselCards } from "@/utils/mapSetsToCarouselCards";
import type { CarouselCard } from "@/config/carousel-cards";
import type { TriviaGameSession, TriviaAnswerResult } from "@/shared/types/trivia-game";
import { createGameSession, answerQuestion, isGameComplete } from "@/utils/triviaGameSession";
import type { HubCell } from "@/components/HubGrid";

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
  const [gameSession, setGameSession] = useState<TriviaGameSession | null>(null);

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
          
          // Map sets to carousel cards
          // Each set becomes one card, each set_item becomes one tile
          const collectionCards = mapSetsToCarouselCards(sets);

          // Create Card 0 (Hub) - tiles represent collections, clicking navigates to that card
          // Fill sequentially, keeping center tile (index 7) unoccupied
          const CENTER_TILE_INDEX = 7;
          
          // Initialize array with 15 null cells
          const hubCells: (HubCell | null)[] = Array.from({ length: 15 }, () => null);
          
          // Fill tiles sequentially, skipping center tile
          let gameIndex = 0; // Track which game we're placing
          for (let i = 0; i < 15; i++) {
            // Skip center tile (index 7)
            if (i === CENTER_TILE_INDEX) {
              // Center tile remains inactive
              hubCells[i] = {
                id: `hub-inactive-${i}`,
                name: "",
                emoji: "",
                inactiveImage: `/hcip-${(i % 40) + 1}.png`,
              };
              continue;
            }
            
            // Place trivia game if available
            if (gameIndex < collectionCards.length) {
              const card = collectionCards[gameIndex];
              const cardIndex = gameIndex + 1; // Card index will be index + 1 (since Card 0 is index 0)
              
              // Get collection title for display
              const displayTitle = card.title || `Collection ${cardIndex}`;
              
              // Truncate title for tile display (show first 30 chars max)
              const truncatedTitle = displayTitle.length > 30 
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
              // Fill remaining positions with inactive cells
              hubCells[i] = {
                id: `hub-inactive-${i}`,
                name: "",
                emoji: "",
                inactiveImage: `/hcip-${(i % 40) + 1}.png`,
              };
            }
          }
          
          const hubCard: CarouselCard = {
            id: 0,
            title: "Trivia Collections",
            cells: hubCells as HubCell[],
          };

          // Prepend hub card to collection cards
          const allCards = [hubCard, ...collectionCards];

          setCarouselCards(allCards);
        } else {
          // If no sets found, create empty card with inactive cells
          const emptyCard: CarouselCard = {
            id: 2,
            title: "Trivia Arena",
            cells: Array.from({ length: 15 }, (_, i) => ({
              id: `inactive-${i}`,
              name: "",
              emoji: "",
              inactiveImage: `/hcip-${(i % 40) + 1}.png`,
            })),
          };
          setCarouselCards([emptyCard]);
        }
      } catch (error) {
        console.error("Error fetching trivia sets:", error);
        // On error, create empty card
        const emptyCard: CarouselCard = {
          id: 2,
          title: "Trivia Arena",
          cells: Array.from({ length: 15 }, (_, i) => ({
            id: `inactive-${i}`,
            name: "",
            emoji: "",
            inactiveImage: `/hcip-${(i % 40) + 1}.png`,
          })),
        };
        setCarouselCards([emptyCard]);
      } finally {
        setLoading(false);
      }
    }

    fetchTriviaSets();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-20 pb-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
            <span className="text-5xl md:text-6xl lg:text-7xl">🎯</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              Trivia Arena
            </h1>
          </div>
          <div className="max-w-2xl mx-auto">
            <p className="text-base md:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-center">
              Test your hockey knowledge! Each card represents a trivia collection. 
              Swipe through different themes and tap any tile to play that trivia question.
            </p>
          </div>
        </div>

        {/* Trivia Collections Carousel */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading trivia games...</p>
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
              if (!gameSession) return { isCorrect: false, pointsGained: 0, correctAnswer: "", explanation: null };
              
              const result = answerQuestion(gameSession, tileId, answer, questionData);
              
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
            onUpdateTileState={(tileId, isAnswered, isCorrect, pointsGained) => {
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
                      : cell
                  ),
                }))
              );
            }}
            onCompleteGame={() => {
              // Game completion is handled by ResultsModal
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
                      : cell
                  ),
                }))
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
