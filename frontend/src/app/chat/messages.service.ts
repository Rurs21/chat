import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable, Subscription } from 'rxjs';
import { Message } from './message.model';
import { WebsocketService } from '../websocket-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  messages = new BehaviorSubject<Message[]>([]);

  events$ = this.websocketService.connect()
  eventsSubscription: Subscription | null = null;

  constructor(
    private httpClient: HttpClient,
    private websocketService: WebsocketService
  ) {
    this.eventsSubscription = this.events$.subscribe(
      notif => this.fetchMessages())
  }

  async postMessage(message: Message) {
    await firstValueFrom(
      this.httpClient.post<{ messages: Message[] }>(
        `${environment.backendUrl}/messages`, message
      )
    );
  }

  getMessages(): Observable<Message[]> {
    this.fetchMessages();
    return this.messages.asObservable();
  }

  private async fetchMessages() {
    const messages = await firstValueFrom(
      this.httpClient.get<Message[]>(
        `${environment.backendUrl}/messages`
      )
    );
    this.messages.next(messages);
  }
}
