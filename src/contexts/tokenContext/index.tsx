import { createContext, FC, ReactNode, useContext, useMemo } from "react";

interface TokenContextProps {
  token: string | null;
}

const TokenContext = createContext<TokenContextProps>( { token: null } );

export const TokenContextProvider: FC<{
  token: TokenContextProps['token'];
  children: ReactNode;
}> = ( { children, token } ) => {
  const contextValue = useMemo(
    () => ( { token } ),
    [ token ],
  );
  return (
    <TokenContext.Provider value={ contextValue }>
      {children}
    </TokenContext.Provider>
  )
}

export const useTokenContext = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useTokenContext must be used within a TokenContextProvider');
  };
  return context;
}