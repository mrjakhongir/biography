import type { IUser, IUserDTO } from "../model/types";

export const mapUser = (user: IUserDTO): IUser => {
  return {
    id: user.id,
    telegramId: user.telegram_id,
    firstName: user.first_name,
    username: user.username,
  };
};
