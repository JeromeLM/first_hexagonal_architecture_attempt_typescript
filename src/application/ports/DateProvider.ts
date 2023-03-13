export interface IDateProvider {
  setNow(value: Date);
  getNow(): Date;
}
