import Image from "next/image";
import type { IUser } from "@/entities/user/model/types";

type Properties = {
  user: IUser;
};

export const UserInfo: React.FC<Properties> = ({ user }) => {
  return (
    <div className="flex items-center gap-3">
      {user?.photoUrl ? (
        <Image
          src={user?.photoUrl || ""}
          alt={user?.firstName}
          width={40}
          height={40}
          className="rounded-full border"
        />
      ) : (
        <div className="bg-secondary text-muted-foreground flex h-10 w-10 items-center justify-center rounded-full font-semibold">
          {user.firstName[0]}
        </div>
      )}

      <div className="flex flex-col gap-0">
        <span>
          {user.firstName} {user?.lastName}
        </span>

        {user?.username && (
          <a href={`https://t.me/${user.username}`} target="_blank" className="text-sky-500 text-xs" rel="noopener">
            @{user.username}
          </a>
        )}
      </div>
    </div>
  );
};
