import { useState, useEffect } from "react";

export function useCSSLoader(styles) {
  const [cssLoaded, setCssLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const links = styles.map((href) => {
      if (document.querySelector(`link[href="${href}"]`)) {
        loadedCount++;
        return null;
      }
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.setAttribute("data-dynamic", "true");
      link.onload = () => {
        loadedCount++;
        if (loadedCount === styles.length) {
          setCssLoaded(true);
        }
      };
      document.head.appendChild(link);
      return link;
    }).filter(Boolean);

    if (loadedCount === styles.length) {
      setCssLoaded(true);
    }

    return () => {
      links.forEach((link) => {
        if (link) document.head.removeChild(link);
      });
    };
  }, [styles]);

  return cssLoaded;
}
