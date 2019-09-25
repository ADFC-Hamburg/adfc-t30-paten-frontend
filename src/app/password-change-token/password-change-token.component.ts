import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { ErrorHandleService } from '../error-handle.service';
import { T30PatenService } from '../t30-paten.service';

@Component({
  selector: 'app-password-change-token',
  templateUrl: './password-change-token.component.html',
  styleUrls: ['./password-change-token.component.css']
})
export class PasswordChangeTokenComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: T30PatenService,
  ) { }

  private sub: any;
  private token = '';
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.token = params['token'];
    });
  }
  onSubmit() {
    this.service.submitPasswordChangeToken(this.token).subscribe(data => {
      this.router.navigate(['/login']);
    });
  }
  onCancel() {
    this.router.navigate(['/']);
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
