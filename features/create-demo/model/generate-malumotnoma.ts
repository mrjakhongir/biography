import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import type { InfoFormValues } from "@/features/create-info/model/schema";

const DEFAULTS = {
  enrollmentDate: "2026 yil 7 sentyabrdan:",
  specialty: "Davolash ishi",
};

type Extra = Partial<typeof DEFAULTS>;

const dash = (value: string | null | undefined) => value?.trim() || "-";

function partyLabel(value: string | boolean | null | undefined) {
  // A string "false" is truthy in JavaScript, so compare explicitly.
  return value === true || value === "true" ? "bor" : "yo‘q";
}

function birthInfo(birthYear: string, region: string) {
  const year = (birthYear || "").trim();
  const formattedYear = /^\d{4}$/.test(year) ? `${year}-yil` : year;

  return [formattedYear, (region || "").trim()].filter(Boolean).join(" ") || "—";
}

function buildData(user: InfoFormValues, extra: Extra = {}) {
  return {
    ...DEFAULTS,
    ...extra,
    fullname: dash(user.fullname),
    faculty: dash(user.faculty),
    group: dash(user.group),
    birthdate: dash(user.birthdate),
    birthplace: dash(user.birthplace),
    nationality: dash(user.nationality),
    party: partyLabel(user.hasJoinedParty),
    speciality: dash(user.speciality),
    languages: dash(user.languages),
    startYear: dash(user.startYear),
    graduatedOrganisation: dash(user.graduatedOrganisation),
    graduatedOrganisationPeriod: dash(user.graduatedOrganisationPeriod),
    relatives: user.relatives.map((relative) => ({
      relation: dash(relative.relation),
      fullname: dash(relative.fullname),
      birthInfo: birthInfo(relative.birthYear, relative.region),
      workplace: dash(relative.workplace),
      address: dash(relative.address),
    })),
    phones: [user.studentPhone, user.fatherPhone, user.motherPhone]
      .filter((phone) => phone?.trim())
      .map((value) => ({ value: value!.trim() })),
  };
}

export async function generateMalumotnoma(user: InfoFormValues, extra: Extra = {}): Promise<Buffer> {
  const templatePath = path.join(process.cwd(), "public", "templates", "malumotnoma.docx");

  const template = await readFile(templatePath);
  const zip = new PizZip(template);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    nullGetter: () => "—",
  });

  doc.render(buildData(user, extra));

  return doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
}
