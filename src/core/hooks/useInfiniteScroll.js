// frontend/src/core/hooks/useInfiniteScroll.js (NEW FILE - AS PROMISED)
import { useCallback, useRef } from 'react';

/**
 * A custom hook to detect when an element is scrolled into view, triggering a callback for infinite loading.
 * @param {Function} callback - The function to call when the element is intersecting.
 * @param {boolean} hasMore - A boolean indicating if there is more data to load.
 * @param {boolean} isLoading - A boolean to prevent multiple calls while data is being fetched.
 * @param {string} rootMargin - Margin around the root. Can be used to trigger loading earlier. e.g., "500px".
 * @returns {React.RefCallback<HTMLElement>} A ref callback to attach to the last element in the list.
 */
export const useInfiniteScroll = (callback, hasMore, isLoading, rootMargin = "200px") => {
  const observer = useRef();

  const lastElementRef = useCallback(node => {
    if (isLoading) return; // Don't do anything if we're already loading

    if (observer.current) observer.current.disconnect(); // Disconnect previous observer

    observer.current = new IntersectionObserver(entries => {
      // If the last element is intersecting with the viewport and there's more data to load
      if (entries[0].isIntersecting && hasMore) {
        callback(); // Call the load more function
      }
    }, {
      rootMargin, // Start loading when the last element is 200px from the bottom of the viewport
    });

    if (node) observer.current.observe(node); // Observe the new last element
  }, [isLoading, hasMore, callback, rootMargin]);

  return lastElementRef;
};