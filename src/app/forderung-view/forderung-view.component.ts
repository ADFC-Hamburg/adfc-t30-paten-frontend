import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ForderungService } from '../services/forderung.service';

@Component({
  selector: 'app-forderung-view',
  templateUrl: './forderung-view.component.html',
  styleUrls: ['./forderung-view.component.css']
})

export class ForderungViewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private forderungService: ForderungService,
  ) { }

  forderung = {
    mail_subject: '',
    mail_body: '',
    sent_on: '2019-10-01 11:12:12',
    demanded_street_section: {
      institution: {
        id: -1
      }
    }
  };

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.forderungService.getSendMail(param.id).subscribe(forderung => {
        this.forderung = forderung[0];
      });
    });
  }
}
