import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from './login-form.component';
import { TestHelper } from '../../test/TestHelper';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let testHelper: TestHelper<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginFormComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    testHelper = new TestHelper(fixture);
    fixture.detectChanges();
  });

  it('should emit username and password', () => {
    let username: string;
    let password: string;

    // On s'abonne à l'EventEmitter pour recevoir les valeurs émises.
    component.login.subscribe((event) => {
      username = event.username;
      password = event.password;
    });

    const usernameInput = testHelper.getInput("username-input");
    testHelper.writeInInput(usernameInput, 'username');

    const passwordInput = testHelper.getInput("password-input");
    testHelper.writeInInput(passwordInput, 'pwd');

    const button = testHelper.getButton("login-button");
    button.click();

    expect(username!).toBe('username');
    expect(password!).toBe('pwd');
    expect(component.loginForm.valid).toBe(true);
  });

  it('should not emit if username is not present', () => {
    let username: string;
    let password: string;

    // On s'abonne à l'EventEmitter pour recevoir les valeurs émises.
    component.login.subscribe((event) => {
      username = event.username;
      password = event.password;
    });

    const passwordInput = testHelper.getInput("password-input");
    testHelper.writeInInput(passwordInput, 'pwd');

    const button = testHelper.getButton("login-button");
    button.click();

    expect(username!).toBeUndefined()
    expect(password!).toBeUndefined()
    expect(component.loginForm.valid).toBe(false);
  });

  it('should not emit if password is not present', () => {
    let username: string;
    let password: string;

    // On s'abonne à l'EventEmitter pour recevoir les valeurs émises.
    component.login.subscribe((event) => {
      username = event.username;
      password = event.password;
    });

    const usernameInput = testHelper.getInput("username-input");
    testHelper.writeInInput(usernameInput, 'username');

    const button = testHelper.getButton("login-button");
    button.click();

    expect(username!).toBeUndefined()
    expect(password!).toBeUndefined()
    expect(component.loginForm.valid).toBe(false);
  });

  it('should not emit if both username and password is not present', () => {
    let username: string;
    let password: string;

    // On s'abonne à l'EventEmitter pour recevoir les valeurs émises.
    component.login.subscribe((event) => {
      username = event.username;
      password = event.password;
    });

    const button = testHelper.getButton("login-button");
    button.click();

    expect(username!).toBeUndefined()
    expect(password!).toBeUndefined()
    expect(component.loginForm.valid).toBe(false);
  });

})
