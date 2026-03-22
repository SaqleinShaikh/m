import { useEffect, useCallback } from "react"

export function useAutoScroll(
  ref: React.RefObject<HTMLDivElement | null>,
  delay: number = 3500,
  isEnabled: boolean = true
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !isEnabled) return;

    let interval: NodeJS.Timeout;
    
    // Calculates how far to scroll (the width of one child + gap)
    const getScrollAmount = () => {
      if (el.children.length === 0) return 300;
      // Get width and compute total outer width including gap
      const child = el.children[0] as HTMLElement;
      const styles = window.getComputedStyle(child);
      const width = child.offsetWidth;
      // For precise scrolling, just grabbing the offsite width is enough 
      // when using css snap mandatory logic. The browser handles the snap.
      return width + 24; // approx 1.5rem gap
    };

    const startScroll = () => {
      interval = setInterval(() => {
        if (!el) return;
        
        // If reached or extremely close to the right end, snap smoothly back to origin
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        }
      }, delay);
    };

    // Begin looping
    startScroll();

    // Pause on interactions
    const pauseScroll = () => clearInterval(interval);
    
    el.addEventListener('mouseenter', pauseScroll);
    el.addEventListener('mouseleave', startScroll);
    el.addEventListener('touchstart', pauseScroll, { passive: true });
    el.addEventListener('touchend', startScroll, { passive: true });

    return () => {
      clearInterval(interval);
      el.removeEventListener('mouseenter', pauseScroll);
      el.removeEventListener('mouseleave', startScroll);
      el.removeEventListener('touchstart', pauseScroll);
      el.removeEventListener('touchend', startScroll);
    };
  }, [ref, delay, isEnabled]);
}
