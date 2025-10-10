import { useContext } from 'react';
import { AppContext, AppContextType } from '../context/appContextCore';

export const useApp = (): AppContextType => {
  const context = useContext(AppContext as React.Context<AppContextType | undefined>);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};