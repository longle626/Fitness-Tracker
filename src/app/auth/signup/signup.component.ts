import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { UIService } from 'src/app/shared-UI/ui.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  loadingStateSignupSub: Subscription;
  loadingIconSignup = false;

  constructor(private authService: AuthService, private uiService: UIService) {}
  ngOnInit(): void {
    this.loadingStateSignupSub = this.uiService.loadingStateChanged.subscribe(
      (result) => {
        this.loadingIconSignup = result;
      }
    );
  }

  onSubmit(form: NgForm) {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password,
    });
  }

  ngOnDestroy(): void {
    this.loadingStateSignupSub.unsubscribe();
  }
}
