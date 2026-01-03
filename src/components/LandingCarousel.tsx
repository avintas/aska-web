"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { HubGrid } from "./HubGrid";
import { carouselCards, type CarouselCard } from "@/config/carousel-cards";

interface LandingCarouselProps {
  className?: string;
  onShopClick?: () => void;
}

export function LandingCarousel({
  className = "",
  onShopClick,
}: LandingCarouselProps): JSX.Element {
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
          {carouselCards.map((card) => (
            <CarouselSlide
              key={card.id}
              card={card}
              onShopClick={onShopClick}
            />
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
    </div>
  );
}

interface CarouselSlideProps {
  card: CarouselCard;
  onShopClick?: () => void;
}

function CarouselSlide({ card, onShopClick }: CarouselSlideProps): JSX.Element {
  return (
    <div className="flex-[0_0_100%] min-w-0 px-2 md:px-4">
      <div className="flex flex-col items-center">
        {/* Optional Card Title */}
        {card.title && (
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4.5 md:mb-6">
            {card.title}
          </h2>
        )}

        {/* Grid */}
        <HubGrid cells={card.cells} onShopClick={onShopClick} />
      </div>
    </div>
  );
}
