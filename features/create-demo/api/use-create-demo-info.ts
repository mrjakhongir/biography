import { useMutation } from "@tanstack/react-query";
import { createDemoInfo } from "./create-personal-info";

export function useCreateDemoInfo() {
  return useMutation({
    mutationFn: createDemoInfo,
  });
}
