export interface IUserDTO {
  id: string;
  telegram_id: string;
  first_name: string;
  username?: string;
}

export interface IUser {
  id?: string;
  telegramId: string;
  chatId?: string;
  firstName: string;
  username?: string;
}
