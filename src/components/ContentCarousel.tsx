"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { CarouselCard } from "@/config/carousel-cards";
import { ContentGrid } from "./ContentGrid";
import { HubCell } from "./HubGrid";
import type { TriviaGameSession, TriviaAnswerResult } from "@/shared/types/trivia-game";
import { QuestionCountModal } from "./trivia/QuestionCountModal";
import { QuestionModal } from "./trivia/QuestionModal";
import { ScoreDisplay } from "./trivia/ScoreDisplay";
import { ResultsModal } from "./trivia/ResultsModal";

interface ContentItem {
  id: string;
  content: string;
  theme?: string;
  attribution?: string | null;
  set_title?: string;
}

interface ContentCarouselProps {
  cards: CarouselCard[];
  className?: string;
  onShare?: (content: string, attribution?: string) => void;
  // Trivia game props
  gameSession?: TriviaGameSession | null;
  onStartGame?: (questionCount: number, cardId: number) => void;
  onAnswerQuestion?: (tileId: string, answer: string, questionData: any) => TriviaAnswerResult;
  onUpdateTileState?: (tileId: string, isAnswered: boolean, isCorrect: boolean, pointsGained: number) => void;
  onCompleteGame?: () => void;
  onResetGame?: () => void;
  isTriviaMode?: boolean; // Whether this carousel is in trivia mode
  onNavigateToCard?: (cardIndex: number) => void; // Callback to navigate to a specific card
}

export function ContentCarousel({
  cards,
  className = "",
  onShare,
  gameSession,
  onStartGame,
  onAnswerQuestion,
  onUpdateTileState,
  onCompleteGame,
  onResetGame,
  isTriviaMode = false,
  onNavigateToCard,
}: ContentCarouselProps): JSX.Element {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
    skipSnaps: false,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  
  // Trivia game modals
  const [isQuestionCountModalOpen, setIsQuestionCountModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [currentQuestionTile, setCurrentQuestionTile] = useState<HubCell | null>(null);
  const [pendingCardId, setPendingCardId] = useState<number | null>(null);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return (): void => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedItem(null);

    // Flip the card back after 500ms
    if (selectedCardId) {
      const cardIdToFlip = selectedCardId;
      setTimeout(() => {
        setFlippedCards((prev) => {
          const next = new Set(prev);
          next.delete(cardIdToFlip);
          return next;
        });
      }, 500);
    }
    setSelectedCardId(null);
  };

  const handleShare = (): void => {
    if (!selectedItem) return;

    const shareText = selectedItem.content;
    const attributionText = selectedItem.attribution
      ? ` - ${selectedItem.attribution}`
      : "";

    if (onShare) {
      onShare(shareText, selectedItem.attribution || undefined);
    } else if (navigator.share) {
      navigator
        .share({
          title: selectedItem.set_title || "OnlyHockey",
          text: `${shareText}${attributionText}`,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard
        .writeText(`${shareText}${attributionText}`)
        .then(() => {
          alert("Copied to clipboard!");
        })
        .catch((err) => {
          console.error("Error copying to clipboard:", err);
        });
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex-[0_0_100%] min-w-0 px-2 md:px-4"
            >
              <div className="flex flex-col items-center">
                {/* Score Display for trivia games */}
                {isTriviaMode && gameSession && gameSession.cardId === card.id && (
                  <ScoreDisplay session={gameSession} />
                )}
                
                <ContentGrid
                  cells={card.cells}
                  flippedCards={flippedCards}
                  onCellClick={(cellId, content, theme, attribution, set_title, questionData) => {
                    // Find the clicked cell
                    const clickedCell = card.cells.find(c => c?.id === cellId);
                    
                    // Check if this is a hub navigation tile (Card 0 - has targetCardIndex)
                    if (isTriviaMode && card.id === 0 && clickedCell && 'targetCardIndex' in clickedCell && typeof (clickedCell as any).targetCardIndex === 'number') {
                      // Hub tile clicked - navigate to target card
                      const targetIndex = (clickedCell as any).targetCardIndex;
                      // Use scrollTo to navigate to the target card
                      scrollTo(targetIndex);
                    }
                    // Check if this is a trivia tile
                    else if (isTriviaMode && clickedCell?.questionData) {
                      // Trivia tile clicked
                      const currentCardSession = gameSession && gameSession.cardId === card.id ? gameSession : null;
                      
                      if (!currentCardSession) {
                        // No session - show question count modal
                        setPendingCardId(card.id);
                        setIsQuestionCountModalOpen(true);
                      } else if (clickedCell.isAnswered) {
                        // Already answered - show review mode
                        setCurrentQuestionTile(clickedCell);
                        setIsQuestionModalOpen(true);
                      } else if (currentCardSession.totalAnswered >= currentCardSession.questionCount) {
                        // Game complete - show results
                        setIsResultsModalOpen(true);
                      } else {
                        // Active game - show question
                        setCurrentQuestionTile(clickedCell);
                        setIsQuestionModalOpen(true);
                      }
                    } else {
                      // Non-trivia content - use existing modal flow
                      setFlippedCards((prev) => {
                        const next = new Set(prev);
                        if (next.has(cellId)) {
                          next.delete(cellId);
                        } else {
                          next.add(cellId);
                        }
                        return next;
                      });

                      setSelectedCardId(cellId);
                      setTimeout(() => {
                        setSelectedItem({
                          id: cellId,
                          content,
                          theme,
                          attribution,
                          set_title,
                        });
                        setIsModalOpen(true);
                      }, 500);
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {scrollSnaps.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4.5 md:mt-6">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              className={`transition-all duration-200 rounded-full ${
                index === selectedIndex
                  ? "w-8 h-2 bg-navy-900 dark:bg-orange-500"
                  : "w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Trivia Question Count Modal */}
      {isTriviaMode && (
        <QuestionCountModal
          isOpen={isQuestionCountModalOpen}
          onSelect={(count) => {
            if (pendingCardId !== null && onStartGame) {
              onStartGame(count, pendingCardId);
            }
            setIsQuestionCountModalOpen(false);
            setPendingCardId(null);
          }}
          onClose={() => {
            setIsQuestionCountModalOpen(false);
            setPendingCardId(null);
          }}
        />
      )}

      {/* Trivia Question Modal */}
      {isTriviaMode && currentQuestionTile?.questionData && (
        <QuestionModal
          isOpen={isQuestionModalOpen}
          questionData={currentQuestionTile.questionData}
          isReviewMode={currentQuestionTile.isAnswered === true}
          isCorrect={currentQuestionTile.isCorrect}
          onAnswer={(answer) => {
            // Don't process answer if in review mode
            if (currentQuestionTile.isAnswered) {
              setIsQuestionModalOpen(false);
              setCurrentQuestionTile(null);
              return;
            }
            if (currentQuestionTile && onAnswerQuestion && onUpdateTileState && gameSession) {
              const result = onAnswerQuestion(
                currentQuestionTile.id,
                answer,
                currentQuestionTile.questionData!
              );
              
              // Update tile state
              onUpdateTileState(
                currentQuestionTile.id,
                true,
                result.isCorrect,
                result.pointsGained
              );
              
              // Flip the tile
              setFlippedCards((prev) => {
                const next = new Set(prev);
                next.add(currentQuestionTile.id);
                return next;
              });
              
              // Check if game is complete (answerQuestion mutates gameSession)
              // After answerQuestion, totalAnswered is incremented, so check updated value
              const newTotalAnswered = gameSession.totalAnswered;
              if (newTotalAnswered >= gameSession.questionCount) {
                setTimeout(() => {
                  setIsResultsModalOpen(true);
                }, 500);
              }
            }
            setIsQuestionModalOpen(false);
            setCurrentQuestionTile(null);
          }}
          onClose={() => {
            setIsQuestionModalOpen(false);
            setCurrentQuestionTile(null);
          }}
        />
      )}

      {/* Trivia Results Modal */}
      {isTriviaMode && gameSession && (
        <ResultsModal
          isOpen={isResultsModalOpen}
          session={gameSession}
          onPlayAgain={() => {
            // Reset flipped cards state
            setFlippedCards(new Set());
            // Reset game session and tile states
            if (onResetGame) {
              onResetGame();
            }
            setIsResultsModalOpen(false);
          }}
          onBackToArena={() => {
            // Reset flipped cards state
            setFlippedCards(new Set());
            // Reset game session and tile states
            if (onResetGame) {
              onResetGame();
            }
            setIsResultsModalOpen(false);
          }}
        />
      )}

      {/* Content Modal Dialog (for non-trivia content) */}
      {isModalOpen && selectedItem && (
        <div
          className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border-4 border-gray-900 dark:border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b-4 border-gray-900 dark:border-gray-100">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
                {selectedItem.set_title || "OnlyHockey"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 md:p-6">
              {/* Content Text */}
              <div className="mb-4">
                <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedItem.content}
                </p>
              </div>

              {/* Theme Badge */}
              {selectedItem.theme && (
                <div className="mb-4">
                  <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs md:text-sm font-semibold px-3 py-1.5 rounded">
                    {selectedItem.theme}
                  </span>
                </div>
              )}

              {/* Attribution */}
              {selectedItem.attribution && (
                <div className="mb-4">
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-semibold italic">
                    — {selectedItem.attribution}
                  </p>
                </div>
              )}

              {/* Share Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleShare}
                  className="px-6 py-3 md:px-8 md:py-3 text-sm md:text-base bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 touch-manipulation"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
