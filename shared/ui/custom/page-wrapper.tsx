import { cn } from "@/shared/lib/utils";

type Properties = {
  children: React.ReactNode;
  className?: string;
  darken?: boolean;
};

export const PageWrapper: React.FC<Properties> = ({ children, className, darken = false }) => {
  return (
    <div className={cn("flex min-h-screen flex-col items-stretch gap-5 bg-secondary relative", className)}>
      {children}
      {darken && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-24 bg-linear-to-t from-secondary-foreground/25 to-transparent" />
      )}
    </div>
  );
};
