import CreateDemographicalInfo from "@/features/create-demo/ui/create-demo";
import { PageWrapper } from "@/shared/ui/custom";

export const DemographicsPageContent = () => {
  return (
    <PageWrapper className="pb-22" darken>
      <CreateDemographicalInfo />
    </PageWrapper>
  );
};
