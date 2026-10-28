import { apiClient } from "@/shared/api/api-client";
import type { DemoInfoFormValues } from "../model/schema";
import type { CreatePersonalInfoResponse } from "../model/types";

export async function createDemoInfo(values: DemoInfoFormValues): Promise<CreatePersonalInfoResponse> {
  return apiClient<CreatePersonalInfoResponse>("/api/demo-info", {
    method: "POST",
    body: JSON.stringify(values),
  });
}
