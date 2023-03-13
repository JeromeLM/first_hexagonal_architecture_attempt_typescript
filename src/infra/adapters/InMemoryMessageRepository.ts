import { IMessageRepository } from "../../application/ports/MessageRepository";
import { Message } from "../../domain/Message";

export class InMemoryMessageRepository implements IMessageRepository {
  message: Message;
  save(message: Message) {
    this.message = message;
  }
  get(): Message {
    return this.message;
  }
}
