import React, { createContext, useContext, ReactNode } from 'react';
import { useChamaId } from '../hooks/useChamaId';

interface ChamaContextType {
  chamaId: string | undefined;
  chamaData: any | null;
  isLoading: boolean;
  error: string | null;
}

const ChamaContext = createContext<ChamaContextType | undefined>(undefined);

export const ChamaProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const chamaState = useChamaId();

  return (
    <ChamaContext.Provider value={chamaState}>{children}</ChamaContext.Provider>
  );
};

export const useChamaContext = (): ChamaContextType => {
  const context = useContext(ChamaContext);
  if (context === undefined) {
    throw new Error('useChamaContext must be used within a ChamaProvider');
  }
  return context;
};
