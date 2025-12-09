import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface LeftSectionContextType {
  isLeftSectionVisible: boolean;
  setIsLeftSectionVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeftSectionContext = createContext<LeftSectionContextType | undefined>(undefined);

interface LeftSectionProviderProps {
  children: ReactNode;
}

export const LeftSectionProvider: React.FC<LeftSectionProviderProps> = ({ children }) => {
  const [isLeftSectionVisible, setIsLeftSectionVisible] = useState(false);

  return (
    <LeftSectionContext.Provider value={{ isLeftSectionVisible, setIsLeftSectionVisible }}>
      {children}
    </LeftSectionContext.Provider>
  );
};

export const useLeftSection = (): LeftSectionContextType => {
  const context = useContext(LeftSectionContext);
  if (!context) {
    throw new Error('useLeftSection must be used within a LeftSectionProvider');
  }
  return context;
};
