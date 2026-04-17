"use client";

import { useSyncExternalStore } from "react";

type UseMediaQueryOptions = {
  defaultValue?: boolean;
};

export function useMediaQuery(
  query: string,
  { defaultValue = false }: UseMediaQueryOptions = {},
): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const mediaQueryList = window.matchMedia(query);
      const legacyMediaQueryList = mediaQueryList as MediaQueryList & {
        addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
        removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      };
      const handleChange = () => {
        onStoreChange();
      };

      if (typeof mediaQueryList.addEventListener === "function") {
        mediaQueryList.addEventListener("change", handleChange);

        return () => {
          mediaQueryList.removeEventListener("change", handleChange);
        };
      }

      legacyMediaQueryList.addListener?.(handleChange);

      return () => {
        legacyMediaQueryList.removeListener?.(handleChange);
      };
    },
    () => {
      if (typeof window === "undefined") {
        return defaultValue;
      }

      return window.matchMedia(query).matches;
    },
    () => defaultValue,
  );
}
