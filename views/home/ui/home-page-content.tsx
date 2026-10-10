import { CreatePersonalInfo } from "@/features";
import { PageWrapper } from "@/shared/ui/custom";

export const HomePageContent = () => {
  return (
    <PageWrapper className="pb-22" darken>
      <CreatePersonalInfo />
    </PageWrapper>
  );
};
