import type { InfoFormValues } from "@/features/create-info/model/schema";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function formatPersonalInfoMessage(values: InfoFormValues): string {
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
