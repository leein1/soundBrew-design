// hooks/useViewSort.js
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useViewSort = (sortStyle) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!sortStyle) return;

    const currentParams = new URLSearchParams(location.search);
    currentParams.set("more[sort]", sortStyle);
    currentParams.delete("page");

    const newQueryString = currentParams.toString();
    const newUrl = `${location.pathname}?${newQueryString}`;

    navigate(newUrl);
  }, [sortStyle]);
};

export default useViewSort;
