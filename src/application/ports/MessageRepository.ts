import { Message } from "../../domain/Message";

export interface IMessageRepository {
  save(message: Message);
  get(): Message;
}
