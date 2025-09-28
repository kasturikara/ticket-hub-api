export interface IEvent {
  id?: string;
  name: string;
  description?: string;
  location: string;
  start_date: Date;
  end_date: Date;
  created_by?: string;
  created_at: Date;
}
