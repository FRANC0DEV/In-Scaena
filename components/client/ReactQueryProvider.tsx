"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

export function ReactQueryProvider({ children }: PropsWithChildren) {
  //we turn the client into a state so it doesn't recreate itself each time a re-render happens.
  //we also use a function in the useState hook to set the state once (initial state callback)
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
