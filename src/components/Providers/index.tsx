"use client"

import { FC, ReactNode } from "react";
import { createReactQueryClient } from "../../../reactQueryClient";
import { QueryClientProvider } from "@tanstack/react-query";

const Providers: FC<{ children: ReactNode }> = ({ children}) => {
  const queryClient = createReactQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default Providers;