export interface CalendarEvent {
  title: string;
  desc?: string;
  startTime: Date;
  endTime: Date;
  allDay: boolean;
}
