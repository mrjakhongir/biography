import { CreatePersonalInfo } from "@/features";
import { PageWrapper } from "@/shared/ui/custom";

export const BiographyPageContent = () => {
  return (
    <PageWrapper className="pb-22" darken>
      <CreatePersonalInfo />
    </PageWrapper>
  );
};
