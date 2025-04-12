import { useEffect } from "react";

export function useCSSLoader(styles) {
  useEffect(() => {
    // CSS 동적 추가
    const links = styles.map((href) => {
      if (document.querySelector(`link[href="${href}"]`)) return null; // 중복 방지
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.setAttribute("data-dynamic", "true"); // 동적으로 추가된 CSS 표시
      document.head.appendChild(link);
      return link;
    }).filter(Boolean); // null 제거

    return () => {
      // 언마운트 시 제거
      links.forEach((link) => link && document.head.removeChild(link));
    };
  }, [styles]); // styles 변경 감지하여 반응
}
