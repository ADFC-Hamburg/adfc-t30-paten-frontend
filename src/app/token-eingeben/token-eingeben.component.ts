import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { T30PatenService } from '../t30-paten.service';

@Component({
  selector: 'app-token-eingeben',
  templateUrl: './token-eingeben.component.html',
  styleUrls: ['./token-eingeben.component.css']
})
export class TokenEingebenComponent implements OnInit, OnDestroy {

  tokenForm = this.fb.group({
    token: ['', Validators.required],
  });
  fehler = false;
  private sub: any;
  constructor(private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private service: T30PatenService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.fehler = (params['fehler'] === 'true');
    });
    console.log('x');
  }

  onSubmit() {
    const token = this.tokenForm.get('token').value;
    this.service.submitToken(token).subscribe(results => {
      this.router.navigate(['', token]);
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
