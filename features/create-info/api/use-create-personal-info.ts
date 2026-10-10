import { useMutation } from "@tanstack/react-query";
import { createPersonalInfo } from "./create-personal-info";

export function useCreatePersonalInfo() {
  return useMutation({
    mutationFn: createPersonalInfo,
  });
}
