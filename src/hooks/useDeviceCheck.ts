import { useEffect, useState } from "react";

export const useDeviceCheck = () => {
  const [isAllowed, setIsAllowed] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setIsAllowed(false);
      } else {
        setIsAllowed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isAllowed;
};
