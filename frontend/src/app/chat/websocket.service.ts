import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private ws: WebSocket | null = null;
  private events: Subject<'notif'> | null = null;

  constructor() {}

  public getNotifications() {
    if (this.ws == null) {
      this.connect();
    }
    this.events = new Subject<'notif'>();
    return this.events.asObservable();
  };

  private connect() {
    this.ws = new WebSocket(`${environment.wsServer}/notifications`);

    this.ws.onopen = () => this.events!.next('notif');
    this.ws.onmessage = () => this.events!.next('notif');
    this.ws.onclose = (e) => {
      // Retry every 2 seconds
      setTimeout(() => {
        this.connect();
      }, 2000);
    }
    this.ws.onerror = (err) => {
      //this.events.error('error');
      this.ws?.close();
    }
  }

  public disconnect() {
    if (this.ws != null) {
      this.ws.onclose = (e) => { this.events!.complete() }
      this.ws.close();
      this.ws = null;
    }
  }
}
