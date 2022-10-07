import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoginService } from '../../login/login.service';
import { Subscription } from 'rxjs';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-new-message-form',
  templateUrl: './new-message-form.component.html',
  styleUrls: ['./new-message-form.component.css']
})
export class NewMessageFormComponent implements OnInit {
  username$ = this.loginService.getUsername();

  messageForm = this.fb.group({
    msg: '',
  });

  currentUsername: string | null = null;
  usernameSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private messagesService: MessagesService
  ) {
    this.usernameSubscription = this.username$.subscribe((u) => {
      this.currentUsername = u;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
  }

  onSendMessage() {
    if (
      this.currentUsername &&
      this.messageForm.valid &&
      this.messageForm.value.msg
    ) {
      this.messagesService.postMessage({
        id: null,
        text: this.messageForm.value.msg,
        username: this.currentUsername,
        timestamp: Date.now(),
      });
    }
    this.messageForm.reset();
  }

}
