import path from "node:path";
import ExcelJS from "exceljs";
import type { DemoInfoFormValues } from "../model/schema";

export async function generateDemoExcel(values: DemoInfoFormValues): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();

  const templatePath = path.join(process.cwd(), "public", "templates", "demo-template.xlsx");

  await workbook.xlsx.readFile(templatePath);

  const worksheet = workbook.getWorksheet("Umumiy");

  if (!worksheet) {
    throw new Error("Excel shablonida 'Ma'lumotlar' varag‘i topilmadi.");
  }

  // Example cell mappings — adjust these to your actual template.
  worksheet.getCell("B2").value = values.fullname;
  worksheet.getCell("C2").value = values.jshir;
  worksheet.getCell("D2").value = values.group;
  worksheet.getCell("E2").value = values.gender;
  worksheet.getCell("F2").value = values.nationality;
  worksheet.getCell("G2").value = values.birthdate;
  worksheet.getCell("H2").value = values.passportNumber;
  worksheet.getCell("I2").value = values.faculty;
  worksheet.getCell("J2").value = values.eduType;
  worksheet.getCell("K2").value = values.eduMode;
  worksheet.getCell("L2").value = values.specialityCode;
  worksheet.getCell("M2").value = values.speciality;
  worksheet.getCell("N2").value = values.phone;
  worksheet.getCell("O2").value = values.address;
  worksheet.getCell("P2").value = values.region;
  worksheet.getCell("Q2").value = values.neighbourhood;
  worksheet.getCell("R2").value = `${values.parents.father.fullname}\n${values.parents.mother.fullname}`;
  worksheet.getCell("S2").value = `${values.parents.father.workplace}\n${values.parents.mother.workplace}`;
  worksheet.getCell("T2").value = `${values.parents.father.phone}\n${values.parents.mother.phone}`;
  worksheet.getCell("U2").value = `${values.parents.father.address}\n${values.parents.mother.address}`;
  worksheet.getCell("V2").value = values.employerTin;
  worksheet.getCell("W2").value = values.studentWorkplace;
  worksheet.getCell("X2").value = values.position;
  worksheet.getCell("Y2").value = values.legalEntity;
  worksheet.getCell("Z2").value = values.employedByLegalEntity;
  worksheet.getCell("AA2").value = values.individualEntrepreneur;
  worksheet.getCell("AB2").value = values.farmHousehold;
  worksheet.getCell("AC2").value = values.employmentThroughLoan;
  worksheet.getCell("AD2").value = values.childcareUnderTwo;
  worksheet.getCell("AE2").value = values.selfEmployed;
  worksheet.getCell("AF2").value = values.disabilityGroupOneOrTwo;
  worksheet.getCell("AG2").value = values.nextEducationLevelCandidates;
  worksheet.getCell("AH2").value = values.academicLeave;
  worksheet.getCell("AI2").value = values.expelledFromStudies;
  worksheet.getCell("AJ2").value = values.heldBackInCourse;
  worksheet.getCell("AK2").value = values.graduateWithOutstandingDebts;
  worksheet.getCell("AL2").value = values.foreignLanguageProficiency;
  worksheet.getCell("AM2").value = values.comment;

  const arrayBuffer = await workbook.xlsx.writeBuffer();

  return Buffer.from(arrayBuffer);
}
