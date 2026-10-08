import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type Properties = {
  className?: string;
  size?: number;
};

export const LoaderCenter: React.FC<Properties> = ({ className, size = 30 }) => {
  return <Loader2 className={cn("text-primary mx-auto animate-spin", className)} size={size} />;
};
