import {
  PostMessageCommand,
  PostMessageUseCase,
} from "../application/use_cases/PostMessageUseCase";
import { InMemoryMessageRepository } from "../infra/adapters/InMemoryMessageRepository";
import { StubDateProvider } from "../infra/adapters/StubDateProvider";
import { Message } from "../domain/Message";
import {
  MessageTextEmpty,
  MessageTextTooLong,
} from "../domain/MessageTextExceptions";

describe("Posting a message", () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe("Rule: a message must have a max length of 280 characters", () => {
    test("User can post a message on his timeline", () => {
      fixture.givenNowIs(new Date("2022-06-04T19:00:00.000Z"));
      fixture.whenUserPostsAMessage({
        id: "message-id",
        text: "Hello everyone",
        author: "Bob",
      });
      fixture.thenPostedMessageShouldBe(
        new Message(
          "message-id",
          "Hello everyone",
          "Bob",
          new Date("2022-06-04T19:00:00.000Z")
        )
      );
    });

    test("User cannot post a message on his timeline with more then 280 characters", () => {
      const textWithMoreThan280Characters =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mauris lacus, fringilla eu est vitae, varius " +
        "viverra nisl. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. " +
        "Vivamus suscipit feugiat sollicitudin. Aliquam erat volutpat amet.";
      fixture.givenNowIs(new Date("2022-06-04T19:00:00.000Z"));
      fixture.whenUserPostsAMessage({
        id: "message-id",
        text: textWithMoreThan280Characters,
        author: "Bob",
      });
      fixture.thenPostingShouldBeRefusedWithError(MessageTextTooLong);
    });
  });
  describe("Rule: a message cannot be empty", () => {
    test("User cannot post an empty message on his timeline", () => {
      fixture.givenNowIs(new Date("2022-06-04T19:00:00.000Z"));
      fixture.whenUserPostsAMessage({
        id: "message-id",
        text: "",
        author: "Bob",
      });
      fixture.thenPostingShouldBeRefusedWithError(MessageTextEmpty);
    });
    test("User cannot post a message on his timeline with only space characters", () => {
      fixture.givenNowIs(new Date("2022-06-04T19:00:00.000Z"));
      fixture.whenUserPostsAMessage({
        id: "message-id",
        text: "   ",
        author: "Bob",
      });
      fixture.thenPostingShouldBeRefusedWithError(MessageTextEmpty);
    });
  });
});

const createFixture = () => {
  let thrownError: Error;
  const dateProvider = new StubDateProvider();
  const messageRepository = new InMemoryMessageRepository();
  const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
  );
  return {
    givenNowIs(_now: Date) {
      dateProvider.setNow(_now);
    },
    whenUserPostsAMessage(postMessageCommand: PostMessageCommand) {
      try {
        postMessageUseCase.handle(postMessageCommand);
      } catch (error) {
        thrownError = error;
      }
    },
    thenPostedMessageShouldBe(expectedMessage: Message) {
      const message = messageRepository.get();
      expect(message).toEqual(expectedMessage);
    },
    thenPostingShouldBeRefusedWithError(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
