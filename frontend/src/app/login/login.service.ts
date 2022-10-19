import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  static USERNAME_KEY = 'username';
  static TOKEN_KEY = 'token';

  private username = new BehaviorSubject<string | null>(null);
  private token : String | null = null;

  constructor(private httpClient: HttpClient) {
    this.username.next(localStorage.getItem(LoginService.USERNAME_KEY));
  }

  async login(login: { username: string; password: string }) {
    const loginResponse = await firstValueFrom(
      this.httpClient.post<{ token: string }>(
        `${environment.backendUrl}/auth/login`,
        {
          username: login.username,
          password: login.password,
        }
      )
    );

    localStorage.setItem(LoginService.USERNAME_KEY, login.username);
    localStorage.setItem(LoginService.TOKEN_KEY, loginResponse.token);
    this.username.next(login.username);
    this.token = loginResponse.token;
  }

  async logout() {
    await firstValueFrom(
      this.httpClient.post(
        `${environment.backendUrl}/auth/logout`,
        null
      )
    );

    localStorage.removeItem(LoginService.USERNAME_KEY)
    localStorage.removeItem(LoginService.TOKEN_KEY)
    this.username.next(null);
    this.token = null;
  }

  getUsername(): Observable<string | null> {
    return this.username.asObservable();
  }

  getToken(): String | null {
    return this.token;
  }
}
