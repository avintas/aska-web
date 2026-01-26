"use client";

import { PageSlogan } from "./PageSlogan";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  emoji: string;
  initialSlogan?: string | null;
}

export function PageHeader({
  title,
  subtitle,
  emoji,
  initialSlogan,
}: PageHeaderProps): JSX.Element {
  return (
    <div className="text-center mb-16 md:mb-20">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4 md:mb-6">
        {title}
      </h1>

      {/* Subtitle */}
      <div className="max-w-2xl mx-auto mb-4 md:mb-6">
        <p className="text-base md:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-center">
          {subtitle}
        </p>
      </div>

      {/* Emoji */}
      <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
        <span className="text-5xl md:text-6xl lg:text-7xl">{emoji}</span>
      </div>

      {/* Quote (PageSlogan) */}
      <PageSlogan initialSlogan={initialSlogan} />
    </div>
  );
}
