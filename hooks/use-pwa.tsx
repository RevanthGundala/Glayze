import { useState, useEffect } from "react";

export const usePWA = () => {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const checkPWA = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsPWA(isStandaloneMode);
    };

    // Initial check
    checkPWA();

    // Listen for changes in display mode
    window
      .matchMedia("(display-mode: standalone)")
      .addEventListener("change", checkPWA);

    // Cleanup listener on unmount
    return () => {
      window
        .matchMedia("(display-mode: standalone)")
        .removeEventListener("change", checkPWA);
    };
  }, []);

  return isPWA;
};
