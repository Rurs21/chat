import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  loginForm : FormGroup = this.fb.group({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });

  @Output()
  login = new EventEmitter<{ username: string; password: string }>();

  constructor(private fb: FormBuilder) {}

  get username() { return this.loginForm.get('username'); }

  get password() { return this.loginForm.get('password'); }

  showUsernameRequiredError(): boolean {
    return this.showError('username', 'required');
  }

  showPasswordRequiredError(): boolean {
    return this.showError('password', 'required');
  }

  ngOnInit(): void {}

  onLogin() {
    if (
      this.loginForm.valid &&
      this.loginForm.value.username &&
      this.loginForm.value.password
    ) {
      this.login.emit({
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private showError(field: 'username' | 'password', error: string): boolean {
    return (
      this.loginForm.controls[field].hasError(error) &&
      (this.loginForm.controls[field].dirty || this.loginForm.controls[field].touched)
    );
  }

}
