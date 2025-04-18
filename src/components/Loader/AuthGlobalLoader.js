// src/components/AuthGlobalLoader.jsx
import React from "react";
import { useAuth } from "context/authContext";
import AuthLoadingSpinner from "components/spinner/AuthLoadingSpinner";

const AuthGlobalLoader = () => {
    const { initializing } = useAuth();   
    return initializing ? <AuthLoadingSpinner /> : null;
};

export default AuthGlobalLoader;
