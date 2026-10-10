import Image from "next/image";
import type { IUser } from "@/entities/user/model/types";

type Properties = {
  user: IUser;
};

export const UserInfo: React.FC<Properties> = ({ user }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col gap-0">
        <span>{user.firstName}</span>

        {user?.username && (
          <a href={`https://t.me/${user.username}`} target="_blank" className="text-sky-500 text-xs" rel="noopener">
            @{user.username}
          </a>
        )}
      </div>
    </div>
  );
};
