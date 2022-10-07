import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  messages = new BehaviorSubject<Message[]>([]);

  constructor() {}

  postMessage(message: Message): void {
    // get copy of the messages
    let newMessages = this.messages.value.slice()
    // add new message to the array
    newMessages.push(message)
    // emit the new messages array
    this.messages.next(newMessages)
  }

  getMessages(): Observable<Message[]> {
    return this.messages.asObservable();
  }
}
