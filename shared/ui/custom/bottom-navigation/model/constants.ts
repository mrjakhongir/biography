import { List, ListCheck, UserRound } from "lucide-react";
import { routes } from "@/shared/routes/routes";

export const manuItems = [
  {
    label: "Tests",
    path: routes.testsList,
    icon: List,
  },
  {
    label: "My tests",
    path: routes.home,
    icon: ListCheck,
  },
  {
    label: "Author test",
    path: routes.profile,
    icon: UserRound,
  },
];
