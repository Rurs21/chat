import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessagesService } from '../messages.service';
import { Message } from '../message.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {
  messages$ = this.messagesService.getMessages();

  messages: Message[] | null = null;
  messagesSubscription: Subscription;

  constructor(
    private messagesService: MessagesService,
  ) {
    this.messagesSubscription = this.messages$.subscribe(messages => {
      this.messages = messages;
    })
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  /** Afficher la date seulement si la date du message précédent est différente du message courant. */
  showDateHeader(messages: Message[] | null, i: number) {
    if (messages != null) {
      if (i === 0) {
        return true;
      } else {
        const prev = new Date(messages[i - 1].timestamp).setHours(0, 0, 0, 0);
        const curr = new Date(messages[i].timestamp).setHours(0, 0, 0, 0);
        return prev != curr;
      }
    }
    return false;
  }
}
