import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/login/login.service';
import { MessagesService } from '../messages.service';
import { ChatImageData, Message } from '../message.model';
import { MessagesComponent } from '../messages/messages.component';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css'],
})
export class ChatPageComponent implements OnInit, OnDestroy {
  @ViewChild(MessagesComponent)
  private chatContainer: MessagesComponent | undefined;

  username$ = this.loginService.getUsername();
  messages$ = this.messagesService.getMessages();

  currentUsername: string | null = null;
  messages: Message[] = [];

  usernameSubscription: Subscription;
  messagesSubscription: Subscription;

  constructor(
    private messagesService: MessagesService,
    private loginService: LoginService,
    private router: Router
  ) {
    this.usernameSubscription = this.username$.subscribe((u) => {
      this.currentUsername = u;
    });
    this.messagesSubscription = this.messages$.subscribe((m) => {
      this.messages = m;
    });

  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  async onQuit() {
    await this.loginService.logout().then(() =>
      this.router.navigate(['/'])
    );
  }

  onSendMessage(msg: { text: string; imageData: ChatImageData | null }) {
    if (this.currentUsername) {
      this.messagesService.postMessage({
        text: msg.text,
        username: this.currentUsername,
        imageData: msg.imageData
      }).then(r => {
        this.chatContainer?.scrollToBottom();
      });
    }
  }
}
