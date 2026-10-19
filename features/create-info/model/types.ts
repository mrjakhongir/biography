export type Relative = {
  relation: string;
  fullname: string;
  birthYear: string;
  region: string;
  workplace: string;
  address: string;
};

export type CreatePersonalInfoRequest = {
  fullname: string;
  birthdate: string;
  birthplace: string;
  nationality: string;
  has_joined_party: boolean;
  education: string;
  graduated_organisation: string | null;
  faculty: string;
  group: string;
  relatives: Relative[];
  student_phone: string;
  father_phone: string;
  mother_phone: string;
};

export type CreatePersonalInfoResponse = {
  id: string;
};

export type Relatives = {
  relation: string;
  fullname: string;
  birthYear: string;
  region: string;
  workplace: string;
  address: string;
};

export type UserInfo = {
  id: string;
  userId: string;
  fullname: string;
  birthdate: string;
  birthplace: string;
  nationality: string;
  hasJoinedParty: string;
  graduatedOrganisation: string;
  graduatedOrganisationPeriod: string;
  faculty: string;
  group: string;
  speciality: string;
  languages: string;
  startYear: string;
  relatives: Relatives[];
  studentPhone: string;
  fatherPhone: string;
  motherPhone: string;
};
