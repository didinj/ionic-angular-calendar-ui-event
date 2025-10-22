import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import dayjs from 'dayjs';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.page.html',
  styleUrls: ['./event-modal.page.scss'],
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class EventModalPage {
  @Input() selectedDate!: Date;

  eventForm!: FormGroup;
  minDate = new Date().toISOString();
  isEdit: boolean = false;
  event: any;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      startTime: [this.selectedDate.toISOString(), Validators.required],
      endTime: [
        dayjs(this.selectedDate).add(1, 'hour').toDate().toISOString(),
        Validators.required,
      ],
      desc: ['']
    });

    if (this.isEdit && this.event) {
      this.eventForm.patchValue({
        title: this.event.title,
        desc: this.event.desc,
        startTime: this.event.startTime,
        endTime: this.event.endTime,
        allDay: this.event.allDay
      });
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  saveEvent() {
    const newEvent = {
      title: this.eventForm.value.title,
      desc: this.eventForm.value.desc,
      startTime: new Date(this.eventForm.value.startTime),
      endTime: new Date(this.eventForm.value.endTime),
      allDay: this.eventForm.value.allDay,
      color: this.eventForm.value.allDay ? '#10dc60' : '#3880ff' // green or blue
    };
  }
}
