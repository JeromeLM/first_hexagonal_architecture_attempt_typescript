export class Message {
  _id: string;
  _text: string;
  _author: string;
  _published_at: Date;

  constructor(id: string, text: string, author: string, published_at: Date) {
    this._id = id;
    this._text = text;
    this._author = author;
    this._published_at = published_at;
  }
}
