"use client";

import { useRouter } from "next/navigation";

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StoreModal({
  isOpen,
  onClose,
}: StoreModalProps): JSX.Element | null {
  const router = useRouter();

  if (!isOpen) return null;

  const handleHomeClick = (): void => {
    router.push("/");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border-4 border-gray-900 dark:border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b-4 border-gray-900 dark:border-gray-100">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
            Store
          </h2>
          <button
            onClick={onClose}
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
          {/* Coming Soon Message */}
          <div className="text-center py-8">
            <div className="mb-6">
              <svg
                className="mx-auto h-20 w-20 text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-4">
              Coming Soon
            </h3>
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Our storefront is under construction. Check back soon for
              exclusive OnlyHockey merchandise and digital products!
            </p>
          </div>

          {/* Home Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleHomeClick}
              className="px-6 py-3 md:px-8 md:py-3 text-sm md:text-base bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-black rounded-lg shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 active:translate-y-0 border-4 border-gray-900 dark:border-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
