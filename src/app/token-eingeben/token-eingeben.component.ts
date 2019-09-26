import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ErrorHandleService } from '../services/error-handle.service';
import { T30PatenService } from '../services/t30-paten.service';

@Component({
  selector: 'app-token-eingeben',
  templateUrl: './token-eingeben.component.html',
  styleUrls: ['./token-eingeben.component.css']
})
export class TokenEingebenComponent implements OnInit, OnDestroy {

  tokenForm = this.fb.group({
    token: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });
  filledIn = false;
  private sub: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private service: T30PatenService,
    private errorHandleService: ErrorHandleService,
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const token = params['token'];
      const email = params['email'];
      this.tokenForm.get('email').setValue(email);
      if (token !== '-') {
        this.tokenForm.get('token').setValue(token);
        this.filledIn = true;
      }
    });
    console.log('x');
  }

  onSubmit() {
    const token = this.tokenForm.get('token').value;
    const email = this.tokenForm.get('email').value;
    this.service.submitToken(email, token).subscribe(results => {
      this.router.navigate(['/login']);
    }, error => {
      console.log(error);
      if (error.error.message.includes('No pending verification found for given user')) {
        this.errorHandleService.handleError(
          'Der eingebene Token ist ungültig, weil er abgelaufen, bereits benutzt wurde oder falsch eingeben wurde.'
        );
      } else {
        throw error;
      }
    }
    );
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
