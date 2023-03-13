import { IDateProvider } from "../../application/ports/DateProvider";

export class StubDateProvider implements IDateProvider {
  now: Date;
  setNow(value: Date) {
    this.now = value;
  }
  getNow(): Date {
    return this.now;
  }
}
