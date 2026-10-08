import { FolderCode } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/shared/ui/empty";
import { SectionWrapper } from "./section-wrapper";
import { Wrapper } from "./wrapper";

type Props = {
  title?: string;
  description?: string;
};

export const EmptyState: React.FC<Props> = (props) => {
  const { title = "Ma'lumotlar topilmadi", description = "Ma'lumotlar qo'shilishi bilan bu yerda paydo bo'ladi" } =
    props;
  return (
    <Wrapper>
      <SectionWrapper>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderCode />
            </EmptyMedia>
            <EmptyTitle>{title}</EmptyTitle>
            <EmptyDescription>{description}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </SectionWrapper>
    </Wrapper>
  );
};
