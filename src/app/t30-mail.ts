export class T30Mail {
  subject: string;
  mailtext: string;
  public constructor(init?: Partial<T30Mail>) {
    Object.assign(this, init);
  }
}
