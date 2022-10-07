import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  static KEY = 'username';

  private username = new BehaviorSubject<string | null>(null);

  constructor(private router: Router) {
    this.username.next(localStorage.getItem(LoginService.KEY));
  }

  login(login: { username: string; password: string }) {
    let username = login.username
    localStorage.setItem(LoginService.KEY, username)
    this.username.next(username)
    // redirect to chat
    this.router.navigate(["/chat"])
  }

  logout() {
    localStorage.removeItem(LoginService.KEY)
    this.username.next(null)
    // redirect to login
    this.router.navigate([""])
  }

  getUsername(): Observable<string | null> {
    return this.username.asObservable();
  }
}
