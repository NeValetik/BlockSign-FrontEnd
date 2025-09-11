'use client';

import { createContext, useContext, useMemo } from "react";

interface UserContextProps {
  me: {
    id: string;
    profile: {
      email: string;
      fullName: string;
      avatar: string;
      role: string;
    }
  } | null;
}

const UserContext = createContext<UserContextProps>({ me: null });

export const UserContextProvider: React.FC<{
  me: UserContextProps['me'];
  children: React.ReactNode;
}> = ({ children, me }) => {
  const contextValue = useMemo(() => ({ me }), [me]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};