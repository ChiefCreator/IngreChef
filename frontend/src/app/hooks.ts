import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from "react";
import type { AppDispatch, RootState } from './store';
import { debounce } from 'lodash';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener("change", handleChange);

    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
};

export function useDisableScroll(disabled: boolean = true) {
  useEffect(() => {
    if (!disabled) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [disabled]);
}

interface UseInfiniteScrollParams {
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => void;
  threshold?: number;
  delay?: number;
  autoLoadIfNotScrollable?: boolean;
}

export function useInfiniteScroll({ hasMore, isLoading, loadMore, threshold = 300, delay = 300, autoLoadIfNotScrollable = true }: UseInfiniteScrollParams) {
  const handleScroll = useCallback(
    debounce(() => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.body.offsetHeight;

      const distanceFromBottom = fullHeight - (scrollTop + viewportHeight);

      if (distanceFromBottom < threshold && hasMore && !isLoading) {
        loadMore();
      }
    }, delay),
    [hasMore, isLoading, loadMore]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    if (autoLoadIfNotScrollable && hasMore && !isLoading) {
      const scrollCheck = () => {
        const fullHeight = document.body.scrollHeight;
        const viewportHeight = window.innerHeight;

        if (fullHeight <= viewportHeight) {
          loadMore();
        }
      };

      const timeout = setTimeout(scrollCheck, 100);
      return () => clearTimeout(timeout);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);
}
