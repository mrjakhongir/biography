"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { Wrapper } from "./wrapper";

type Props = {
  title: string;
  hasBackButton?: boolean;
  link?: string;
};

const Header: React.FC<Props> = ({ title, hasBackButton = false, link }) => {
  const router = useRouter();

  const handleClick = () => {
    if (link) return router.push(link);
    router.back();
  };

  return (
    <header className="overflow-hidden rounded-b-xl bg-white shadow-sm sticky top-0 z-20">
      <Wrapper className="flex items-center justify-between py-3">
        {hasBackButton && (
          <button type="button" onClick={handleClick}>
            {/* <ChevronLeft /> */}
          </button>
        )}
        <h1 className="flex-1 text-center text-lg tracking-wide font-semibold">{title}</h1>
      </Wrapper>
    </header>
  );
};

export default Header;
