// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { setGlobalNavigate } from "./utils/response/globalNavigate";
import { GlobalStateProvider } from "./state/State";
import { AuthProvider } from "./context/authContext"; 
import { LoadingProvider, useLoading } from "./context/loadingContext";
import { registerLoadingHandler } from "./api/standardAxios"; 
import GlobalLoader from "./components/Loader/GlobalLoader";
import AuthGlobalLoader from "./components/Loader/AuthGlobalLoader";

// 글로벌 css
import "./assets/css/darkmode.css";
import "./assets/css/layout.css";
import "./assets/css/common.css";
import "./assets/css/player.css";

function AppWithNavigationSetter() {
  const { setIsLoading } = useLoading();

  useEffect(() => {
    registerLoadingHandler(setIsLoading);
  }, [setIsLoading]);

  const navigate = useNavigate();

  useEffect(() => {
    setGlobalNavigate(navigate);
  }, [navigate]);

  return <AppRouter />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <LoadingProvider>
          <GlobalStateProvider>
            <AuthGlobalLoader/>
            <GlobalLoader />
            <AppWithNavigationSetter />
          </GlobalStateProvider>
        </LoadingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
