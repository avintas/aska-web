"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PageNavigationButtonsProps {
  homeLabel?: string;
  homeHref?: string;
  infoTitle?: string;
  infoContent?: string;
  extrasTitle?: string;
  extrasContent?: string;
}

export function PageNavigationButtons({
  homeLabel = "Home",
  homeHref = "/",
  infoTitle = "Info",
  infoContent = "Information about this page.",
  extrasTitle = "Extras",
  extrasContent = "Additional options coming soon...",
}: PageNavigationButtonsProps): JSX.Element {
  const router = useRouter();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showExtraModal, setShowExtraModal] = useState(false);

  return (
    <>
      {/* Round Navigation Buttons - Game Boy Style */}
      <div className="flex justify-center gap-4 md:gap-6">
        <button
          onClick={() => router.push(homeHref)}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-gray-900 dark:border-gray-100 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors flex items-center justify-center font-bold text-gray-900 dark:text-white text-sm md:text-base shadow-lg hover:shadow-xl active:shadow-md"
          aria-label={homeLabel}
        >
          {homeLabel}
        </button>
        <button
          onClick={() => setShowInfoModal(true)}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-gray-900 dark:border-gray-100 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors flex items-center justify-center font-bold text-gray-900 dark:text-white text-sm md:text-base shadow-lg hover:shadow-xl active:shadow-md"
          aria-label="Info"
        >
          Info
        </button>
        <button
          onClick={() => setShowExtraModal(true)}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-gray-900 dark:border-gray-100 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors flex items-center justify-center font-bold text-gray-900 dark:text-white text-sm md:text-base shadow-lg hover:shadow-xl active:shadow-md"
          aria-label="Extras"
        >
          Extras
        </button>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div
          className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200"
          onClick={() => setShowInfoModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border-4 border-gray-900 dark:border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b-4 border-gray-900 dark:border-gray-100">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
                {infoTitle}
              </h2>
              <button
                onClick={() => setShowInfoModal(false)}
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
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {infoContent}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Extra Modal */}
      {showExtraModal && (
        <div
          className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200"
          onClick={() => setShowExtraModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border-4 border-gray-900 dark:border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b-4 border-gray-900 dark:border-gray-100">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
                {extrasTitle}
              </h2>
              <button
                onClick={() => setShowExtraModal(false)}
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
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {extrasContent}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
