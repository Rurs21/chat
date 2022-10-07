import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  constructor(private loginService : LoginService) {}

  ngOnInit(): void {}

  onLogin(login: { username: string; password: string }) {
    this.loginService.login(login)
  }
}
