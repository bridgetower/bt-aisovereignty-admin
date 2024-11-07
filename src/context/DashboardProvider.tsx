import React, { createContext, ReactNode, useContext, useState } from 'react';

// Define the shape of the context
interface DashboardContextType {
  isNotificationOpen: boolean;
  toggleNotification: () => void;
}

// Create the context with an initial value of `undefined`
const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

// Provider component
interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
}) => {
  const [isNotificationOpen, setNotificationOpen] = useState(false);

  const toggleNotification = () => {
    setNotificationOpen((prev) => !prev);
  };

  return (
    <DashboardContext.Provider
      value={{ isNotificationOpen, toggleNotification }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook to use the DashboardContext
export const useDashboardContext = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      'useDashboardContext must be used within a DashboardProvider',
    );
  }
  return context;
};
