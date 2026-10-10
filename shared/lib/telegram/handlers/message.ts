import { NextResponse } from "next/server";
import { z } from "zod";
import { createInfoFormSchema } from "@/features/create-info/model/schema";
import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import { getSessionPayload } from "@/shared/lib/telegram/get-current-user";

const createPersonalInfoSchema = createInfoFormSchema.extend({
  hasJoinedParty: z.enum(["true", "false"]),
});

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatMessage(values: z.infer<typeof createPersonalInfoSchema>): string {
  const relatives = values.relatives
    .map(
      (relative, index) =>
        `<b>Qarindosh ${index + 1}</b>\n` +
        `Qarindoshlik: ${escapeHtml(relative.relation)}\n` +
        `F.I.Sh.: ${escapeHtml(relative.fullname)}\n` +
        `Tug‘ilgan yili: ${escapeHtml(relative.birthYear)}\n` +
        `Hudud: ${escapeHtml(relative.region)}\n` +
        `Ish joyi: ${escapeHtml(relative.workplace)}\n` +
        `Manzil: ${escapeHtml(relative.address)}`,
    )
    .join("\n\n");

  return (
    `<b>Ma’lumotlaringiz muvaffaqiyatli saqlandi.</b>\n\n` +
    `<b>Shaxsiy ma’lumotlar</b>\n` +
    `F.I.Sh.: ${escapeHtml(values.fullname)}\n` +
    `Tug‘ilgan sana: ${escapeHtml(values.birthdate)}\n` +
    `Tug‘ilgan joy: ${escapeHtml(values.birthplace)}\n` +
    `Millati: ${escapeHtml(values.nationality)}\n` +
    `Partiyaga a’zoligi: ${values.hasJoinedParty === "true" ? "Ha" : "Yo‘q"}\n\n` +
    `<b>Ta’lim</b>\n` +
    `Ma’lumoti: ${escapeHtml(values.education)}\n` +
    `Ta’lim muassasasi: ${escapeHtml(values.graduatedOrganisation || "Ko‘rsatilmagan")}\n` +
    `Fakultet: ${escapeHtml(values.faculty)}\n` +
    `Guruh: ${escapeHtml(values.group)}\n\n` +
    `<b>Qarindoshlar</b>\n${relatives || "Ko‘rsatilmagan"}\n\n` +
    `<b>Telefon raqamlari</b>\n` +
    `Talaba: ${escapeHtml(values.studentPhone)}\n` +
    `Ota: ${escapeHtml(values.fatherPhone)}\n` +
    `Ona: ${escapeHtml(values.motherPhone)}\n\n` +
    `📄 To‘liq faylni olish uchun <a href="https://t.me/Firuz_Gaybullayev_Math">Admin</a> ga bog‘laning.`
  );
}

async function sendTelegramMessage(chatId: string | number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured.");
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram message failed: ${await response.text()}`);
  }
}

export async function POST(request: Request) {
  const session = await getSessionPayload();

  if (!session) {
    return NextResponse.json({ error: "Avtorizatsiyadan o'ting." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Xato ma'lumot." }, { status: 400 });
  }

  const parsed = createPersonalInfoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Xato ma'lumot.",
        fields: z.treeifyError(parsed.error),
      },
      { status: 422 },
    );
  }

  const values = parsed.data;
  const [day, month, year] = values.birthdate.split(".");

  const { data, error } = await supabaseAdmin
    .from("personal_info")
    .insert({
      user_id: session.userId,
      fullname: values.fullname.trim(),
      birthdate: `${year}-${month}-${day}`,
      birthplace: values.birthplace.trim(),
      nationality: values.nationality.trim(),
      has_joined_party: values.hasJoinedParty === "true",
      education: values.education,
      graduated_organisation: values.graduatedOrganisation.trim() || null,
      faculty: values.faculty.trim(),
      group: values.group.trim(),
      relatives: values.relatives,
      student_phone: values.studentPhone,
      father_phone: values.fatherPhone,
      mother_phone: values.motherPhone,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create personal info:", error);

    return NextResponse.json({ error: "Ma'lumotlarni saqlashda xatolik yuz berdi." }, { status: 500 });
  }

  try {
    // This must be the user's Telegram chat ID, not an internal database ID.
    await sendTelegramMessage(session.userId, formatMessage(values));
  } catch (error) {
    // Keep the successful database save successful even if Telegram fails.
    console.error("Telegram notification failed:", error);
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
