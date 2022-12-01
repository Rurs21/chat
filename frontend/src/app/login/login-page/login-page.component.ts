import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  loginError : null | String = null;
  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {}

  async onLogin(login: { username: string; password: string }) {
    try {
      await this.loginService.login(login);
      this.router.navigate(['/chat']);
    } catch (e) {
      if (e instanceof HttpErrorResponse && e.status == 403) {
        this.loginError = "Mot de passe invalide";
      } else {
        this.loginError = "Problème de connexion";
      }
    }
  }
}
