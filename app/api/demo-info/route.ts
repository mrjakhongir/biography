import { NextResponse } from "next/server";
import { z } from "zod";
import { createDemoInfoFormSchema } from "@/features/create-demo/model/schema";
import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import { getSessionPayload } from "@/shared/lib/telegram/get-current-user";

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

  const parsed = createDemoInfoFormSchema.safeParse(body);

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
    .from("demo_info")
    .insert({
      user_id: session.userId,

      // Personal info
      fullname: values.fullname,
      birthdate: values.birthdate,
      passport_number: values.passportNumber.toUpperCase(),
      jshir: values.jshir,
      gender: values.gender,
      nationality: values.nationality,
      phone: values.phone,
      address: values.address,
      region: values.region,
      neighbourhood: values.neighbourhood,

      // Education info
      faculty: values.faculty,
      group: values.group,
      edu_type: values.eduType,
      edu_mode: values.eduMode,
      speciality: values.speciality,
      speciality_code: values.specialityCode,

      // Parents info (JSONB)
      parents: values.parents,

      // Extra info
      employer_tin: values.employerTin,
      student_workplace: values.studentWorkplace,
      position: values.position,
      legal_entity: values.legalEntity,
      employed_by_legal_entity: values.employedByLegalEntity,
      individual_entrepreneur: values.individualEntrepreneur,
      farm_household: values.farmHousehold,
      employment_through_loan: values.employmentThroughLoan,
      childcare_under_two: values.childcareUnderTwo,
      self_employed: values.selfEmployed,
      disability_group_one_or_two: values.disabilityGroupOneOrTwo,
      next_education_level_candidates: values.nextEducationLevelCandidates,
      academic_leave: values.academicLeave,
      expelled_from_studies: values.expelledFromStudies,
      held_back_in_course: values.heldBackInCourse,
      graduate_with_outstanding_debts: values.graduateWithOutstandingDebts,
      foreign_language_proficiency: values.foreignLanguageProficiency,
      comment: values.comment,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create demo info:", error);

    return NextResponse.json(
      { error: "Ma'lumotlarni saqlashda xatolik yuz berdi.", message: error.message },
      { status: 500 },
    );
  }

  // Notify staff after the record has been created.
  try {
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("username")
      .eq("id", session.userId)
      .single();

    if (userError) throw userError;

    // await sendPersonalInfoToStaff(values, docBuffer, user?.username);
  } catch (error) {
    console.error("Staff Telegram notification failed:", error);
  }

  // Notify the customer after the record has been created.
  try {
    // await notifyCustomer(session.userId, values);
    console.log("Demo info created:", data.id);
  } catch (error) {
    console.error("Telegram notification failed:", error);
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
