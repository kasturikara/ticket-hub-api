export interface IEvent {
  id?: string;
  admin_id: string; // Changed from organizerId to match DB schema
  title: string;
  description: string;
  event_date: Date; // Changed from eventDate to match DB schema
  location: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ICreateEventRequest {
  title: string;
  description: string;
  event_date: string; // ISO format date
  location: string;
}

export interface IUpdateEventRequest {
  title?: string;
  description?: string;
  event_date?: string; // ISO format date
  location?: string;
}

export interface IEventQueryParams {
  location?: string;
  startDate?: string;
  endDate?: string;
  admin_id?: string; // Changed from organizerId
  limit?: number;
  offset?: number;
}

export interface IEventResponse {
  success: boolean;
  message: string;
  data?: any;
}
