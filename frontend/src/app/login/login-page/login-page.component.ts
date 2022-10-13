import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  constructor(private router: Router, private loginService : LoginService) {}

  ngOnInit(): void {}

  onLogin(login: { username: string; password: string }) {
    this.loginService.login(login).then(() =>
      this.router.navigate(['/chat'])
    );
  }
}
