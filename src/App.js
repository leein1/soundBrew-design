// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { setGlobalNavigate } from "./utils/response/globalNavigate";
import { GlobalStateProvider } from "./state/State";
import { AuthProvider, useAuth } from "./context/authContext"; 
import LoadingSpinner from "./components/LoadingSpinner";
 
// 글로벌 css
import "./assets/css/darkmode.css";
import "./assets/css/layout.css";
import "./assets/css/common.css";

function AppWithNavigationSetter() {
  const navigate = useNavigate();
  const { initializing } = useAuth();

  useEffect(() => {
    setGlobalNavigate(navigate);
  }, [navigate]);

  if (initializing) {
    return <LoadingSpinner />;
  }

  return <AppRouter />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <GlobalStateProvider>
          <AppWithNavigationSetter />
        </GlobalStateProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
