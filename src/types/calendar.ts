export interface CalendarItem {
  id: number,
  meal: string,
  start_date: string,
  end_date: string,
  duration: number,
}

export interface CalendarResponse {
  calendar: CalendarItem[],
}