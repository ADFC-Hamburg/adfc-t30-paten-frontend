export class SozialeEinrichtung {
  id: number;
  lat: number;
  lon: number;
  mapLat: number;
  mapLon: number;
  name: string;
  address_supplement: string; // z.B. Filiale: Harburg
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
