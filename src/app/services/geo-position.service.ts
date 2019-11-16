import { Injectable } from '@angular/core';
import { HAMBURG_LAT, HAMBURG_LON, START_ZOOM } from '../const';

@Injectable({
  providedIn: 'root'
})
export class GeoPositionService {

  private _position: [number, number] = [HAMBURG_LON, HAMBURG_LAT];

  private _zoom: number = START_ZOOM;

  public get position(): [number, number] {
    return this._position;
  }

  public set position(position: [number, number]) {
    this._position = position;
  }

  public get lon(): number {
    return this._position[0];
  }

  public set lon(lon: number) {
    this._position[0] = lon;
  }

  public get lat(): number {
    return this._position[1];
  }

  public set lat(lat: number) {
    this._position[1] = lat;
  }

  public get zoom(): number {
    return this._zoom;
  }

  public set zoom(zoom: number) {
    this._zoom = zoom;
  }
}
