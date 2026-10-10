import { NextResponse } from "next/server";
import { z } from "zod";
import { createInfoFormSchema } from "@/features/create-info/model/schema";
import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import { getSessionPayload } from "@/shared/lib/telegram/get-current-user";
import { sendPersonalInfoMessage } from "@/shared/lib/telegram/send-personal-info-message";

const createPersonalInfoSchema = createInfoFormSchema.extend({
  hasJoinedParty: z.enum(["true", "false"]),
});

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

  const { data, error } = await supabaseAdmin
    .from("personal_info")
    .insert({
      user_id: session.userId,
      fullname: values.fullname.trim(),
      birthdate: values.birthdate,
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
    await sendPersonalInfoMessage(session.userId, values);
  } catch (error) {
    console.error("Telegram notification failed:", error);
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
