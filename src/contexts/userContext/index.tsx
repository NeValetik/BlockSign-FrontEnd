'use client';

import { createContext, useContext, useMemo } from "react";

export interface UserContextProps {
  me: {
    role: string;
    email: string;
    id: string;
    createdAt: Date;
    fullName: string;
    username: string;
    status: string;
    updatedAt: Date;
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