const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN is not configured.");
}

type CreateInvoiceLinkParams = {
  title: string;
  description: string;
  payload: string;
  amount: number;
};

type TelegramResponse<T> = {
  ok: boolean;
  result?: T;
  description?: string;
};

export async function createInvoiceLink({ title, description, payload, amount }: CreateInvoiceLinkParams) {
  const response = await fetch(`https://api.telegram.org/bot${token}/createInvoiceLink`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
      payload,
      currency: "XTR",
      prices: [
        {
          label: title,
          amount,
        },
      ],
    }),
  });

  const data = (await response.json()) as TelegramResponse<string>;

  if (!response.ok || !data.ok || !data.result) {
    console.error("Telegram invoice error:", data);

    throw new Error(data.description ?? "Failed to create Telegram invoice");
  }

  return data.result;
}
