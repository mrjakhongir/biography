import crypto from "node:crypto";

export function validateInitData(initData: string, botToken: string) {
  const parameters = new URLSearchParams(initData);

  const hash = parameters.get("hash");

  if (!hash) {
    return false;
  }

  parameters.delete("hash");

  const dataCheckString = [...parameters]
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();

  const calculatedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  return calculatedHash === hash;
}
