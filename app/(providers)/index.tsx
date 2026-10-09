import { NuqsAdapter } from "nuqs/adapters/next/app";
import type React from "react";
import { Suspense } from "react";
import { LoaderCenter } from "@/shared/ui/custom";
import { Toaster } from "@/shared/ui/sonner";
import QueryProvider from "./query-provider";
import { TelegramAuthGate } from "./telegram-auth-provider";

type Properties = {
  children: React.ReactNode;
};

const Provideres: React.FC<Properties> = ({ children }) => {
  return (
    <QueryProvider>
      {/* <TelegramAuthGate> */}
      <Suspense fallback={<LoaderCenter className="text-primary size-8" />}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </Suspense>

      <Toaster position="top-center" duration={2000} />
      {/* </TelegramAuthGate> */}
    </QueryProvider>
  );
};

export default Provideres;
