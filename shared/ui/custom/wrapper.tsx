import { cn } from "../../lib/utils";

type Properties = {
  children: React.ReactNode;
  className?: string;
};

export const Wrapper: React.FC<Properties> = ({ children, className }) => {
  return <div className={cn("mx-auto w-full max-w-xl px-5", className)}>{children}</div>;
};
