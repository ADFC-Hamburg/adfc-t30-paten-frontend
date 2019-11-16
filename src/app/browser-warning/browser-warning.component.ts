import { DeviceDetectorService, BROWSERS } from 'ngx-device-detector';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-browser-warning',
  templateUrl: './browser-warning.component.html',
  styleUrls: ['./browser-warning.component.css']
})
export class BrowserWarningComponent implements OnInit {

  public showIEWarning = false;
  public showBrowserWarning = false;
  constructor(
    private deviceDetectorService: DeviceDetectorService,
  ) {
  }

  ngOnInit() {
    if (this.deviceDetectorService.browser === BROWSERS.IE ) {
      this.showIEWarning = true;
    } else {
      if (!([ BROWSERS.FIREFOX, BROWSERS.CHROME, BROWSERS.MS_EDGE_CHROMIUM].includes(this.deviceDetectorService.browser))) {
        this.showBrowserWarning = true;
      }
    }
  }

}
