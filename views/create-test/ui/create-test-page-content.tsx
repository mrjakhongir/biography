import { CreateNewTest } from "@/features/create-test";
import { routes } from "@/shared/routes/routes";
import { PageWrapper } from "@/shared/ui/custom";
import Header from "@/shared/ui/custom/header";

export const CreateTestPageContent = () => {
  return (
    <PageWrapper className="pb-22">
      <Header title="Test yaratish" link={routes.profile} hasBackButton />

      <CreateNewTest />
    </PageWrapper>
  );
};
