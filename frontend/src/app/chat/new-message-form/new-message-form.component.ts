import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-new-message-form',
  templateUrl: './new-message-form.component.html',
  styleUrls: ['./new-message-form.component.css']
})
export class NewMessageFormComponent implements OnInit {
  messageForm = this.fb.group({
    msg: '',
  });

  @Output()
  sendMessage = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onSendMessage() {
    if (this.messageForm.valid && this.messageForm.value.msg) {
      this.sendMessage.emit(this.messageForm.value.msg);
      this.messageForm.reset();
    }
  }

}
