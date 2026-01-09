"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { FactGrid } from "./FactGrid";
import { HubCell } from "./HubGrid";

interface DidYouKnowCarouselProps {
  cells: (HubCell | null)[][]; // Array of arrays, each inner array has 20 cells (4 rows × 5 columns)
  className?: string;
}

export function DidYouKnowCarousel({
  cells,
  className = "",
}: DidYouKnowCarouselProps): JSX.Element {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
    skipSnaps: false,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

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

  return (
    <div className={`w-full ${className}`}>
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {cells.map((slideCells, slideIndex) => (
            <div
              key={slideIndex}
              className="flex-[0_0_100%] min-w-0 px-2 md:px-4"
            >
              <div className="flex flex-col items-center">
                {/* Use FactGrid component - displays factoid cards in grid layout */}
                <FactGrid cells={slideCells} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {scrollSnaps.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-5 md:mt-7">
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
    </div>
  );
}
