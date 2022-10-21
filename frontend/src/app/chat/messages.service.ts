import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
      notif => {
        let messages = this.messages.value;
        if (messages.length > 0) {
          let lastId = messages[messages.length-1].id!;
          this.fetchMessages(lastId).then(newMessages =>
             this.messages.next(messages.concat(newMessages)));
        } else {
          this.fetchMessages().then(messages =>
            this.messages.next(messages));
        }
      })
  }

  async postMessage(message: Message) {
    await firstValueFrom(
      this.httpClient.post<{ messages: Message[] }>(
        `${environment.backendUrl}/messages`, message
      )
    );
  }

  getMessages(): Observable<Message[]> {
    this.fetchMessages().then(messages =>
      this.messages.next(messages));
    return this.messages.asObservable();
  }

  private async fetchMessages(fromId?: string) : Promise<Message[]> {
    let params = new HttpParams();
    if (fromId !== undefined)
      params = params.set('fromId', fromId);
    return await firstValueFrom(
      this.httpClient.get<Message[]>(
        `${environment.backendUrl}/messages`,
        {params: params}
      )
    );
  }
}
