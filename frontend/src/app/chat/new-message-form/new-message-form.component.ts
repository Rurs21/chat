import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FileReaderService } from '../file-reader.service';
import { ChatImageData, MessageRequest } from '../message.model';

@Component({
  selector: 'app-new-message-form',
  templateUrl: './new-message-form.component.html',
  styleUrls: ['./new-message-form.component.css']
})
export class NewMessageFormComponent implements OnInit {
  messageForm = this.fb.group({
    msg: '',
  });
  imageData: ChatImageData | null = null;

  @Output()
  sendMessage = new EventEmitter<{ text: string; imageData: ChatImageData | null }>();

  constructor(private fb: FormBuilder, private fileReaderService: FileReaderService) {}

  ngOnInit(): void {}

  onSendMessage() {
    if (this.messageForm.valid && this.messageForm.value.msg) {
      this.sendMessage.emit({ text: this.messageForm.value.msg, imageData: this.imageData});
      this.messageForm.reset();
    }
  }

  async fileChanged($event: any) {
    let file = $event.target.files[0];
    this.imageData = await this.fileReaderService.readFile(file);
  }
}
