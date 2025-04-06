// src/state/state.js
import React, { createContext, useReducer, useContext } from "react";

const GlobalStateContext = createContext();

const initialState = {
  currentView: '/tracks',
  isLoggedIn: false,
  instrumentTags: [],
  moodTags: [],
  genreTags: [],
  isFirstTagLoad: true,
  isRole: ['visitor'],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_LOGIN_STATUS':
      return { ...state, isLoggedIn: action.payload };
    case 'SET_INSTRUMENT_TAGS':
      return { ...state, instrumentTags: action.payload };
    case 'SET_MOOD_TAGS':
      return { ...state, moodTags: action.payload };
    case 'SET_GENRE_TAGS':
      return { ...state, genreTags: action.payload };
    case 'SET_TAG_LOAD_STATUS':
      return { ...state, isFirstTagLoad: action.payload };
    case 'SET_IS_ROLE':
      return { ...state, isRole: action.payload };
    default:
      return state;
  }
};

export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
