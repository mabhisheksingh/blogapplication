import React, { createContext, useContext, useState } from 'react';

const ErrorContext = createContext();

export function useError() {
  return useContext(ErrorContext);
}

export function ErrorProvider({ children }) {
  const [error, setError] = useState(null);
  const showError = (msg) => setError(msg);
  const clearError = () => setError(null);

  return (
    <ErrorContext.Provider value={{ error, showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}
