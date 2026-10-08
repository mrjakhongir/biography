"use client";

import type WebAppType from "@twa-dev/sdk";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/shared/ui/spinner";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

type TelegramLoginResult = { status: "authenticated" } | { status: "missing_init_data" } | { status: "failed" };

type Properties = {
  children: React.ReactNode;
};

type TelegramWebApp = typeof WebAppType;

const initializeTelegramMiniApp = (WebApp: TelegramWebApp) => {
  WebApp.ready();
  WebApp.expand();

  if (WebApp.isVersionAtLeast("7.7")) {
    WebApp.disableVerticalSwipes();
  }
};

async function loginWithTelegram(): Promise<TelegramLoginResult> {
  const { default: WebApp } = await import("@twa-dev/sdk");

  initializeTelegramMiniApp(WebApp);

  const initData = WebApp.initData;

  if (!initData) {
    return { status: "missing_init_data" };
  }

  const response = await fetch("/api/auth/telegram", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      initData,
    }),
  });

  if (!response.ok) {
    return { status: "failed" };
  }

  return { status: "authenticated" };
}

async function loginWithDevelopmentUser() {
  const response = await fetch("/api/auth/dev-login", {
    method: "POST",
    credentials: "same-origin",
  });

  return response.ok;
}

function AuthLoader() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Spinner className="text-primary size-8" />
    </main>
  );
}

export function AuthError() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <p className="text-muted-foreground max-w-sm text-center text-sm">
        Авторизация амалга ошмади. Илтимос, мини иловани Telegram меню орқали қайта очинг.
      </p>
    </main>
  );
}

export function TelegramAuthGate({ children }: Properties) {
  const router = useRouter();
  const didRunReference = useRef(false);

  const [status, setStatus] = useState<AuthStatus>("checking");

  useEffect(() => {
    if (didRunReference.current) {
      return;
    }

    didRunReference.current = true;

    let isMounted = true;

    async function authenticate() {
      try {
        if (!isMounted) {
          return;
        }

        const telegramResult = await loginWithTelegram();
        if (telegramResult.status === "authenticated") {
          setStatus("authenticated");
          router.refresh();
          return;
        }

        const isDevelopmentLoginEnabled = process.env.NEXT_PUBLIC_AUTH_MOCK_ENABLED === "true";

        if (telegramResult.status === "missing_init_data" && isDevelopmentLoginEnabled) {
          if (!isMounted) {
            return;
          }

          const isDevelopmentLoggedIn = await loginWithDevelopmentUser();
          if (isDevelopmentLoggedIn) {
            setStatus("authenticated");
            router.refresh();
            return;
          }
        }

        setStatus("unauthenticated");
      } catch {
        if (isMounted) {
          setStatus("unauthenticated");
        }
      }
    }

    void authenticate();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (status === "checking") {
    return <AuthLoader />;
  }

  if (status === "unauthenticated") {
    return <AuthError />;
  }

  return children;
}
