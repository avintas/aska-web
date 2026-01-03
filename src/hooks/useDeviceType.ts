"use client";

import { useEffect, useState } from "react";

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  shouldUseCardStyle: boolean; // Switch-style card design
}

/**
 * Hook to detect device type and orientation
 *
 * Breakpoints:
 * - Mobile: < 768px
 * - Tablet: 768px - 1024px
 * - Desktop: > 1024px
 *
 * Card Style Logic:
 * - Desktop: YES (always)
 * - Tablet: YES (always)
 * - Mobile Landscape: YES
 * - Mobile Portrait: NO (too cramped)
 */
export function useDeviceType(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isPortrait: false,
    isLandscape: false,
    shouldUseCardStyle: false,
  });

  useEffect(() => {
    function updateDeviceInfo(): void {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      const isPortrait = height > width;
      const isLandscape = width > height;

      // Card style logic:
      // - Desktop: always YES
      // - Tablet: always YES
      // - Mobile Landscape: YES
      // - Mobile Portrait: NO
      const shouldUseCardStyle =
        isDesktop || isTablet || (isMobile && isLandscape);

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isPortrait,
        isLandscape,
        shouldUseCardStyle,
      });
    }

    // Initial check
    updateDeviceInfo();

    // Listen for resize and orientation changes
    window.addEventListener("resize", updateDeviceInfo);
    window.addEventListener("orientationchange", updateDeviceInfo);

    return (): void => {
      window.removeEventListener("resize", updateDeviceInfo);
      window.removeEventListener("orientationchange", updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
}
