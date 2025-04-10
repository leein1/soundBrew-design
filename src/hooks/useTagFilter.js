// src/hooks/useTagFilter.js
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosGet } from "../api/standardAxios";

const TAG_TYPES = ["instrument","mood","genre"];

export default function useTagFilter() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. section visibility state
  const [sectionVisibility, setSectionVisibility] = useState(
    () => TAG_TYPES.reduce((acc, t) => ({ ...acc, [t]: "open" }), {})
  );

  // 2. active tags
  const [activeTags, setActiveTags] = useState(
    () => TAG_TYPES.reduce((acc, t) => ({ ...acc, [t]: new Set() }), {})
  );

  // 3. fetched tag data
  const [tagData, setTagData] = useState({ dto: { instrument: [], mood: [], genre: [] } });

  // fetch & sync on URL change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qp = params.toString() ? `?${params.toString()}` : "";

    async function load() {
      try {
        const data = await axiosGet({ endpoint: `/api/sounds/tags/mapped${qp}` });
        setTagData(data);

        // rebuild activeTags from URL
        const newActive = TAG_TYPES.reduce((acc, type) => {
          const v = params.get(`more[${type}]`);
          acc[type] = new Set(v ? v.split(",").filter(Boolean) : []);
          return acc;
        }, {});
        setActiveTags(newActive);
      } catch (err) {
        console.error("Failed to load tags:", err);
      }
    }
    load();
  }, [location.search]);

  // toggle open/closing/closed
  const toggleSection = useCallback((type, animationDone = false) => {
    setSectionVisibility(prev => {
      const curr = prev[type];
      if (animationDone && curr === "closing") {
        return { ...prev, [type]: "closed" };
      }
      if (curr === "open") {
        return { ...prev, [type]: "closing" };
      }
      if (curr === "closed") {
        return { ...prev, [type]: "open" };
      }
      return prev;
    });
  }, []);

  // click a tag: update state + URL
  const clickTag = useCallback((type, value) => {
    // optimistic UI
    setActiveTags(prev => {
      const next = { ...prev, [type]: new Set(prev[type]) };
      next[type].has(value) ? next[type].delete(value) : next[type].add(value);
      return next;
    });

    // URL params
    const params = new URLSearchParams(location.search);
    const key = `more[${type}]`;
    const existing = params.get(key)?.split(",").filter(Boolean) || [];
    const updated = new Set(existing);
    updated.has(value) ? updated.delete(value) : updated.add(value);

    if (updated.size) params.set(key, Array.from(updated).join(","));
    else              params.delete(key);

    params.delete("page");
    navigate(`${location.pathname}?${params.toString()}`);
  }, [location, navigate]);

  return {
    tagData,
    sectionVisibility,
    activeTags,
    toggleSection,
    clickTag,
  };
}
