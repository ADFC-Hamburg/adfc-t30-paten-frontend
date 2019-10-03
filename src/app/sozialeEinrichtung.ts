export class SozialeEinrichtung {
  id: number;
  position: [number, number];
  name: string;
  street_house_no: string;
  zip: string;
  city: string;
  type: string;
  public constructor(init?: Partial<SozialeEinrichtung>) {
    Object.assign(this, init);
  }
  public static get DEFAULT() {
    return new this();
  }
}