// src/utils/globalNavigate.js
let navigateFunc = null;

export const setGlobalNavigate = (nav) => {
  navigateFunc = nav;
};

export const getGlobalNavigate = () => navigateFunc;