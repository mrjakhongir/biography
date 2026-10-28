import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateMalumotnoma } from "@/features/create-info/model/generate-malumotnoma";
import { createInfoFormSchema } from "@/features/create-info/model/schema";
import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import { getSessionPayload } from "@/shared/lib/telegram/get-current-user";
import { notifyCustomer } from "@/shared/lib/telegram/notify-user";
import { sendFormToStaff } from "@/shared/lib/telegram/services/send-personal-info-to-staff";

const createPersonalInfoSchema = createInfoFormSchema.extend({
  hasJoinedParty: z.enum(["true", "false"]),
});

export async function POST(request: Request) {
  const session = await getSessionPayload();

  if (!session) return NextResponse.json({ error: "Avtorizatsiyadan o'ting." }, { status: 401 });

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

  const docBuffer = await generateMalumotnoma(values);

  const storagePath = `personal-info/${randomUUID()}.docx`;

  const { error: uploadError } = await supabaseAdmin.storage.from("files").upload(storagePath, docBuffer, {
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    upsert: false,
  });

  if (uploadError) {
    console.error("Document upload failed:", uploadError);

    return NextResponse.json({ error: "Word faylni saqlashda xatolik yuz berdi." }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("files").getPublicUrl(storagePath);

  const { data, error } = await supabaseAdmin
    .from("personal_info")
    .insert({
      user_id: session.userId,
      fullname: values.fullname.trim(),
      birthdate: values.birthdate,
      birthplace: values.birthplace.trim(),
      nationality: values.nationality.trim(),
      has_joined_party: values.hasJoinedParty === "true",
      graduated_organisation: values.graduatedOrganisation.trim() || null,
      graduated_organisation_period: values.graduatedOrganisationPeriod,
      faculty: values.faculty.trim(),
      group: values.group.trim(),
      speciality: values.speciality.trim(),
      languages: values.languages.trim(),
      start_year: values.startYear,
      relatives: values.relatives,
      student_phone: values.studentPhone,
      father_phone: values.fatherPhone,
      mother_phone: values.motherPhone,
      doc_url: publicUrl,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create personal info:", error);

    // Clean up the uploaded file if the database insert fails.
    const { error: cleanupError } = await supabaseAdmin.storage.from("files").remove([storagePath]);

    if (cleanupError) {
      console.error("Document cleanup failed:", cleanupError);
    }

    return NextResponse.json({ error: "Ma'lumotlarni saqlashda xatolik yuz berdi." }, { status: 500 });
  }

  // Send the file to staff only after the record and document exist.
  try {
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("username")
      .eq("id", session.userId)
      .single();

    if (userError) throw userError;

    await sendFormToStaff({
      values,
      buffer: docBuffer,
      fileType: "docx",
      username: user?.username,
    });
  } catch (error) {
    console.error("Staff Telegram notification failed:", error);
  }

  // Notify the customer only after the record and document exist.
  try {
    await notifyCustomer(session.userId, values);
  } catch (error) {
    console.error("Telegram notification failed:", error);
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
