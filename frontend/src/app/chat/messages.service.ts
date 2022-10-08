import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { Message } from './message.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  messages = new BehaviorSubject<Message[]>([]);

  constructor(private httpClient: HttpClient) {}

  async postMessage(message: Message): Promise<void> {
    await firstValueFrom(
      this.httpClient.post<{ messages: Message[] }>(
        `${environment.backendUrl}/messages`, message
      )
    );
    this.getMessages();
    return Promise.resolve();
  }

  async getMessages(): Promise<Observable<Message[]>> {
    const messagesResponse = await firstValueFrom(
      this.httpClient.get<Message[]>(
        `${environment.backendUrl}/messages`
      )
    );

    this.messages.next(messagesResponse);
    return Promise.resolve(this.messages.asObservable());
  }
}
