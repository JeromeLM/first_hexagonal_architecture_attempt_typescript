import {
  PostMessageCommand,
  PostMessageUseCase,
} from "../application/use_cases/PostMessageUseCase";
import { InMemoryMessageRepository } from "../infra/adapters/InMemoryMessageRepository";
import { StubDateProvider } from "../infra/adapters/StubDateProvider";
import { Message } from "../domain/Message";

const messageRepository = new InMemoryMessageRepository();
const dateProvider = new StubDateProvider();

describe("Posting a message", () => {
  describe("Rule: a message must have a max length of 280 characters", () => {
    test("User can post a message on his timeline", () => {
      givenNowIs(new Date("2022-06-04T19:00:00.000Z"));
      when_user_posts_a_message({
        id: "message-id",
        text: "Hello everyone",
        author: "Bob",
      });
      then_posted_message_should_be(
        new Message(
          "message-id",
          "Hello everyone",
          "Bob",
          new Date("2022-06-04T19:00:00.000Z")
        )
      );
    });
  });
});

function givenNowIs(_now: Date) {
  dateProvider.setNow(_now);
}
function when_user_posts_a_message(postMessageCommand: PostMessageCommand) {
  const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
  );
  postMessageUseCase.handle(postMessageCommand);
}
function then_posted_message_should_be(expectedMessage: Message) {
  const message = messageRepository.get();
  expect(message).toEqual(expectedMessage);
}
