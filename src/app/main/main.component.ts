import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

import { UserService } from '../services/user.service';
import { ForderungService } from '../services/forderung.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public displayedPatenColumns: string[] = ['name', 'street', 'house_no', 'status', 'aktion'];
  public forderungList = [];
  constructor(
    private userService: UserService,
    private forderungService: ForderungService,
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser().pipe(take(1)).subscribe(user => {
      this.forderungService.list(user.id).subscribe(data => {
        this.forderungList = data;
      });
    });
  }
}
