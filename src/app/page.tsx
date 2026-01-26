"use client";

import { useState } from "react";
import { LandingCarousel } from "@/components/LandingCarousel";
import { PageNavigationButtons } from "@/components/PageNavigationButtons";
import { StoreModal } from "@/components/StoreModal";
import { PageHeader } from "@/components/PageHeader";

export default function Home(): JSX.Element {
  const [showStoreModal, setShowStoreModal] = useState(false);

  // Newsletter form state
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setMessage(null);

    // Basic client-side validation
    if (!email.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your email address",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: data.message || "Thanks for subscribing!",
        });
        setEmail(""); // Clear the form
      } else {
        setMessage({
          type: "error",
          text: data.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-8 pb-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Circular Navigation Menu */}
        <div className="mb-6 md:mb-8">
          <PageNavigationButtons
            homeLabel="Home"
            homeHref="/"
            infoTitle="Info"
            infoContent={`OnlyHockey is a content experience company dedicated to the game's rich history. We transform legendary moments into bite-sized, shareable digital "cultural currency" for the modern fan.

The interface uses a Home Grid system. Colored tiles are active entry points to specific content zones, while gray tiles serve as structural placeholders. You can navigate the grid by swiping left or right or by using the dot indicators below the cards.

The Carousel: Certain cards feature internal sliders for swiping through historical sequences and shareable facts.

Join our newsletter via the signup at the bottom of the grid for curated hockey history. No account is required to explore—simply click and play.`}
            extrasTitle="Extras"
            extrasContent="Settings and other options coming soon..."
          />
        </div>

        {/* Header Section */}
        <PageHeader
          title="There Is Only Hockey!"
          subtitle="We launched OnlyHockey as a tribute to the great Game of Hockey. Here, you can immerse yourself in the curiosities of hockey culture and interesting facts from the sport's past and present. Challenge yourself and your friends to engaging hockey trivia and get a motivational boost from legendary coaches and iconic players. We hope you will discover what makes our hockey community so special. 🏠✨"
          emoji="🏒"
        />

        {/* Hub Selector - Grid Section */}
        <div className="mb-8 md:mb-10">
          <LandingCarousel
            className="w-full"
            onShopClick={() => setShowStoreModal(true)}
          />
        </div>

        {/* Call to Action - Game Boy Style Card */}
        <div className="flex justify-center mt-10">
          <div className="w-[19.5rem] sm:w-[22.5rem] md:w-[42.5rem] bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-4 border-gray-900 dark:border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 md:p-6 border-b-4 border-gray-900 dark:border-gray-100 text-center">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
                Ready to Play?
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Tap any game above to start playing — no sign-up needed!
              </p>
            </div>

            {/* Newsletter Sign-Up */}
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-center gap-1.5 mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Want hockey trivia updates?
                </p>
                {/* Live Indicator Badge */}
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wide animate-pulse">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live
                </span>
              </div>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col gap-3"
              >
                <div className="flex flex-col sm:flex-row gap-1.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 text-sm rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 text-sm rounded-lg bg-gray-800 dark:bg-orange-500 text-white font-bold hover:bg-gray-900 dark:hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </button>
                </div>

                {/* Success/Error Messages */}
                {message && (
                  <div
                    className={`text-sm text-center px-3 py-2 rounded-lg ${
                      message.type === "success"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                        : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                    }`}
                  >
                    {message.text}
                  </div>
                )}
              </form>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
                No spam, just hockey. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Store Modal */}
      <StoreModal
        isOpen={showStoreModal}
        onClose={() => setShowStoreModal(false)}
      />
    </div>
  );
}
