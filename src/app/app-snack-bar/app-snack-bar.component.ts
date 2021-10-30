import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-app-snack-bar',
  templateUrl: './app-snack-bar.component.html',
  styleUrls: ['./app-snack-bar.component.css']
})
export class AppSnackBarComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBar: MatSnackBar
  ) { }

  dismiss() {
    this.snackBar.dismiss();
  }
}
