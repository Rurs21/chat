import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/login/login.service';
import { FileReaderService } from '../file-reader.service';
import { MessagesService } from '../messages.service';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css'],
})
export class ChatPageComponent implements OnInit, OnDestroy {
  messages$ = this.messagesService.getMessages();
  username$ = this.loginService.getUsername();
  notifications$ = this.webSocketService.connect();

  messageForm = this.fb.group({
    msg: '',
  });

  currentUsername: string | null = null;
  usernameSubscription: Subscription;
  notificationSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private webSocketService: WebsocketService,
    private loginService: LoginService,
    private fileReaderService: FileReaderService,
    private router: Router
  ) {
    this.usernameSubscription = this.username$.subscribe((u) => {
      this.currentUsername = u;
    });
    this.notificationSubscription = this.notifications$.subscribe(
      async (n) => await this.messagesService.fetchMessages()
    );
  }

  async ngOnInit() {
    await this.messagesService.fetchMessages();
  }

  ngOnDestroy(): void {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    this.webSocketService.disconnect();
  }

  async onSendMessage(event: { text: string; file: File | null }) {
    if (this.currentUsername) {
      const imageData = event.file
        ? await this.fileReaderService.readFile(event.file)
        : null;
      await this.messagesService.postMessage({
        text: event.text,
        username: this.currentUsername,
        imageData: imageData,
      });
    }
  }

  async onQuit() {
    this.messagesService.clear();
    await this.loginService.logout();
    this.router.navigate(['/']);
  }
}
