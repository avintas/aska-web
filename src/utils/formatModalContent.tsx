import React from "react";

/**
 * Formats text content for modal dialogs to improve readability
 *
 * Features:
 * - Converts double line breaks (\n\n) to paragraph breaks with proper spacing
 * - Converts single line breaks (\n) to line breaks
 * - Preserves spacing and formatting
 * - Handles special characters properly
 * - Ensures consistent typography
 * - Normalizes whitespace
 * - Handles long paragraphs with proper line breaks
 */
export function formatModalContent(
  content: string,
  options?: {
    className?: string;
    preserveLineBreaks?: boolean;
  },
): React.ReactNode {
  if (!content) return null;

  const { className = "", preserveLineBreaks = true } = options || {};

  // Normalize whitespace: replace multiple spaces with single space
  // but preserve intentional line breaks
  const normalizedContent = content
    .replace(/[ \t]+/g, " ") // Multiple spaces/tabs to single space
    .replace(/\r\n/g, "\n") // Normalize line endings
    .replace(/\r/g, "\n")
    .trim();

  // Split by double line breaks to create paragraphs
  const paragraphs = normalizedContent
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (paragraphs.length === 0) return null;

  // If only one paragraph, check if it has single line breaks
  if (paragraphs.length === 1 && preserveLineBreaks) {
    const text = paragraphs[0];
    // Check if text contains single line breaks
    if (text.includes("\n")) {
      const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (lines.length === 0) return null;

      return (
        <div className={className}>
          {lines.map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < lines.length - 1 && <br className="mb-2" />}
            </React.Fragment>
          ))}
        </div>
      );
    }
    // Single paragraph, no line breaks
    return <div className={className}>{text}</div>;
  }

  // Multiple paragraphs
  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => {
        // Check if paragraph has single line breaks
        if (preserveLineBreaks && paragraph.includes("\n")) {
          const lines = paragraph
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

          if (lines.length === 0) return null;

          return (
            <p key={index} className={index > 0 ? "mt-4" : ""}>
              {lines.map((line, lineIndex) => (
                <React.Fragment key={lineIndex}>
                  {line}
                  {lineIndex < lines.length - 1 && <br className="mb-2" />}
                </React.Fragment>
              ))}
            </p>
          );
        }

        return (
          <p key={index} className={index > 0 ? "mt-4" : ""}>
            {paragraph}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Formats content specifically for modal dialogs with consistent styling
 * Returns a React component with proper typography classes
 */
export function FormattedModalContent({
  content,
  className = "",
  preserveLineBreaks = true,
}: {
  content: string;
  className?: string;
  preserveLineBreaks?: boolean;
}): JSX.Element | null {
  const baseClasses =
    "text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  const formatted = formatModalContent(content, {
    className: combinedClasses,
    preserveLineBreaks,
  });

  if (!formatted) return null;

  return <>{formatted}</>;
}
