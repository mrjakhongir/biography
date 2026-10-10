import { apiClient } from "@/shared/api/api-client";
import type { InfoFormValues } from "../model/schema";
import type { CreatePersonalInfoResponse } from "../model/types";

export async function createPersonalInfo(values: InfoFormValues): Promise<CreatePersonalInfoResponse> {
  return apiClient<CreatePersonalInfoResponse>("/api/personal-info", {
    method: "POST",
    body: JSON.stringify(values),
  });
}
