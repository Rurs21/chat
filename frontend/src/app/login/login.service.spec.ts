import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let httpTestingController: HttpTestingController;

  const loginData = {
    username: 'username',
    password: 'pwd',
  };
  const jwtToken = 'jwt_token';

  afterEach(() => {
    localStorage.clear();
  });

  describe('on login', () => {
    beforeEach(() => {
      localStorage.clear();
      TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
      httpTestingController = TestBed.inject(HttpTestingController);
      service = TestBed.inject(LoginService);
    });

    it('should call POST with login data to auth/login', async () => {
      const loginPromise = service.login(loginData);

      const req = httpTestingController.expectOne(
        'http://127.0.0.1:8080/auth/login'
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginData);
      req.flush({ token: jwtToken });

      // wait for the login to complete
      await loginPromise;
    });

    it('should save the token in service and local storage', async () => {
      const loginPromise = service.login(loginData);

      const req = httpTestingController.expectOne(
        'http://127.0.0.1:8080/auth/login'
      );
      req.flush({ token: jwtToken });

      // wait for the login to complete
      await loginPromise;

      expect(service.getToken()).toBe('jwt_token');
      expect(localStorage.getItem(LoginService.TOKEN_KEY)).toBe('jwt_token');
    });

    it('should save and emit the username', async () => {
      // TODO
      let username: string | null;

      service.getUsername().subscribe((event) => {
        username = event
      });

      const loginPromise = service.login(loginData);

      const req = httpTestingController.expectOne(
        'http://127.0.0.1:8080/auth/login'
      );
      req.flush({ token: jwtToken });

      await loginPromise;

      expect(username!).toBe('username');
    });
  });

  describe('on logout', () => {
    beforeEach(() => {
      localStorage.setItem('username', loginData.username);
      localStorage.setItem('token', jwtToken);

      TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
      httpTestingController = TestBed.inject(HttpTestingController);
      service = TestBed.inject(LoginService);
    });

    it('should call POST with login data to auth/logout', async () => {
      const logoutPromise = service.logout()

      const req = httpTestingController.expectOne(
        'http://127.0.0.1:8080/auth/logout'
      );
      expect(req.request.method).toBe('POST');
      req.flush({ token: jwtToken });

      // wait for the login to complete
      await logoutPromise;
    });

    it('should remove the token from the service and local storage', async () => {
      const logoutPromise = service.logout()

      const req = httpTestingController.expectOne(
        'http://127.0.0.1:8080/auth/logout'
      );
      req.flush({ token: jwtToken });

      await logoutPromise;

      expect(service.getToken()).toBeNull();
      expect(localStorage.getItem(LoginService.TOKEN_KEY)).toBeNull();
    });
  });
});
