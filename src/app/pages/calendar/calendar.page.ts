import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import { EventModalPage } from '../event-modal/event-modal.page';
import { CalendarComponent, NgCalendarModule } from 'ionic2-calendar';
import { CalendarMode, Step } from 'ionic2-calendar';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSegmentButton, IonItem, IonButton, IonLabel, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { add, addOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { CalendarEvent } from 'src/app/models/calendar-event.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: true,
  imports: [NgCalendarModule, IonIcon, IonFabButton, IonFab, IonLabel, IonButton, IonItem, IonSegmentButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CalendarPage implements OnInit {
  @ViewChild(CalendarComponent) calendarComponent!: CalendarComponent;
  eventSource: any[] = [];
  calendar = {
    mode: 'month' as CalendarMode,
    currentDate: new Date()
  };
  selectedDate: Date = new Date();

  viewTitle = '';

  constructor(private modalCtrl: ModalController, private alertCtrl: AlertController) {
    addIcons({ addOutline, add });
  }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      this.eventSource = JSON.parse(storedEvents);
    }
  }

  next() {
    const nextDate = dayjs(this.calendar.currentDate).add(1, this.calendar.mode as any);
    this.calendar.currentDate = nextDate.toDate();
  }

  back() {
    const prevDate = dayjs(this.calendar.currentDate).subtract(1, this.calendar.mode as any);
    this.calendar.currentDate = prevDate.toDate();
  }

  async addEvent() {
    const modal = await this.modalCtrl.create({
      component: EventModalPage,
      componentProps: { selectedDate: this.selectedDate, isEdit: false }
    });
    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.event) {
        this.eventSource.push(result.data.event);
        localStorage.setItem('events', JSON.stringify(this.eventSource));
        this.calendarComponent.loadEvents();
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.event) {
      this.eventSource.push(data.event);
      this.eventSource = [...this.eventSource]; // refresh calendar
    }
  }

  async onEventSelected(event: CalendarEvent) {
    const alert = await this.alertCtrl.create({
      header: event.title,
      message: `
        <strong>Start:</strong> ${new Date(event.startTime).toLocaleString()}<br>
        <strong>End:</strong> ${new Date(event.endTime).toLocaleString()}<br>
        <strong>All Day:</strong> ${event.allDay ? 'Yes' : 'No'}
      `,
      buttons: [
        {
          text: 'Edit',
          handler: () => this.openEditEventModal(event)
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.deleteEvent(event)
        },
        { text: 'Close', role: 'cancel' }
      ]
    });
    await alert.present();
  }

  onTimeSelected(event: any) {
    this.selectedDate = event.selectedTime;
  }

  async openEditEventModal(event: CalendarEvent) {
    const modal = await this.modalCtrl.create({
      component: EventModalPage,
      componentProps: { isEdit: true, event }
    });
    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.event) {
        const index = this.eventSource.findIndex(e => e.startTime === event.startTime && e.title === event.title);
        if (index > -1) {
          this.eventSource[index] = result.data.event;
          localStorage.setItem('events', JSON.stringify(this.eventSource));
          this.calendarComponent.loadEvents();
        }
      }
    });
    await modal.present();
  }

  deleteEvent(event: CalendarEvent) {
    this.eventSource = this.eventSource.filter(e => e !== event);
    localStorage.setItem('events', JSON.stringify(this.eventSource));
    this.calendarComponent.loadEvents();
  }

  onViewTitleChanged(title: string) {
    this.viewTitle = title;
  }
}
