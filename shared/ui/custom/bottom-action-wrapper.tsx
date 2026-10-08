import { cn } from "@/shared/lib/utils";
import { Wrapper } from "./wrapper";

type Properties = {
  children: React.ReactNode;
  className?: string;
};

export const BottomActionWrapper: React.FC<Properties> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "fixed right-4 bottom-4 left-4 z-30  rounded-full border border-secondary bg-white/30 backdrop-blur-xs shadow-lg p-0.5",
      )}
    >
      <Wrapper className={cn(className, "p-0")}>{children}</Wrapper>
    </div>
  );
};
