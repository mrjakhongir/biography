import { cn } from "@/shared/lib/utils";

type Properties = {
  children: React.ReactNode;
  className?: string;
};

export const SectionWrapper: React.FC<Properties> = ({ children, className }) => {
  return (
    <section className={cn("border-muted rounded-3xl border bg-white py-4 shadow-lg", className)}>{children}</section>
  );
};
