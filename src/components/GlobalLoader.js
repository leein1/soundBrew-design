// src/components/GlobalLoader.jsx
import React from "react";
import { useLoading } from "../context/loadingContext";
import LoadingSpinner from "./LoadingSpinner";

const GlobalLoader = () => {
  const { isLoading } = useLoading();
  return isLoading ? <LoadingSpinner /> : null;
};

export default GlobalLoader;
