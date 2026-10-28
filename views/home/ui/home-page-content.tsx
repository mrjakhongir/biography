import { ChevronRight, UserRound, UsersRound } from "lucide-react";
import Link from "next/link";
import { PageWrapper, Wrapper } from "@/shared/ui/custom";
import Header from "@/shared/ui/custom/header";

const menuItems = [
  {
    title: "Biografiya (Объективка)",
    path: "/biography",
    icon: UserRound,
  },
  {
    title: "Demografiya",
    path: "/demography",
    icon: UsersRound,
  },
];

export const HomePageContent = () => {
  return (
    <PageWrapper className="pb-22" darken>
      <Header title="Test GO" />

      <Wrapper>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex items-center gap-2">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={28} strokeWidth={1.8} />
                  </div>

                  <h3 className="font-semibold">{item.title}</h3>
                </div>

                <ChevronRight
                  size={20}
                  className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                />
              </Link>
            );
          })}
        </div>
      </Wrapper>
    </PageWrapper>
  );
};
