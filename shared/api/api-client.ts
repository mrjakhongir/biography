export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export async function apiClient<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);

  if (init?.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(input, {
    ...init,
    credentials: "same-origin",
    headers,
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorPayload = payload as { error?: string };

    throw new ApiError(errorPayload.error ?? "Request failed.", response.status, payload);
  }

  return payload as T;
}
