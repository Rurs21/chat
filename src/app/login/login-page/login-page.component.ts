import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  constructor(private loginService : LoginService, private router: Router) {}

  ngOnInit(): void {}

  onLogin(login: { username: string; password: string }) {
    this.loginService.login(login)
    this.router.navigate(["/chat"])
  }
}
