"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/config/query-client";

type Properties = {
  children: React.ReactNode;
};

const QueryProvider: React.FC<Properties> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryProvider;
