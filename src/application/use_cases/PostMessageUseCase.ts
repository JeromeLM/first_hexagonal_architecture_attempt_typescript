import { IMessageRepository } from "../ports/MessageRepository";
import { IDateProvider } from "../ports/DateProvider";
import { Message } from "../../domain/Message";

export class PostMessageCommand {
  id: string;
  text: string;
  author: string;
}

export class PostMessageUseCase {
  messageRepository: IMessageRepository;
  dateProvider: IDateProvider;

  constructor(messageRepository, dateProvider) {
    this.messageRepository = messageRepository;
    this.dateProvider = dateProvider;
  }

  handle(postMessageCommand: PostMessageCommand) {
    const message = new Message(
      postMessageCommand.id,
      postMessageCommand.text,
      postMessageCommand.author,
      this.dateProvider.getNow()
    );
    this.messageRepository.save(message);
  }
}
