"use client";
import { createContext, useContext, useState } from 'react';

// AnalysisContext oluşturuluyor
const AnalysisContext = createContext();

// Provider bileşeni
export const AnalysisProvider = ({ children }) => {
  const [analysisData, setAnalysisData] = useState(null);

  const updateAnalysisData = (data) => {
    setAnalysisData(data);
  };

  return (
    <AnalysisContext.Provider value={{ analysisData, updateAnalysisData }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
