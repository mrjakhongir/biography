export type Relative = {
  relation: string;
  fullname: string;
  birthYear: string;
  region: string;
  workplace: string;
  address: string;
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
