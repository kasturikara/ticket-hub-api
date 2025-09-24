export interface ITicket {
  id?: string;
  ticket_category_id: string;
  user_id: string;
  ticket_code: string;
  status: TicketStatus;
  created_at?: Date;
  updated_at?: Date;
}

export enum TicketStatus {
  AVAILABLE = "available",
  USED = "used",
  CANCELLED = "cancelled",
}

export interface ICreateTicketRequest {
  ticket_category_id: string;
  user_id: string;
}

export interface IUpdateTicketRequest {
  status?: TicketStatus;
  ticket_code?: string;
}

export interface ITicketQueryParams {
  user_id?: string;
  ticket_category_id?: string;
  event_id?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface ITicketResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface ITicketCategory {
  id?: string;
  event_id?: string;
  name: string;
  price: number;
  stock: number;
  available?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface ICreateTicketCategoryRequest {
  name: string;
  price: number;
  stock: number;
}

export interface IUpdateTicketCategoryRequest {
  name?: string;
  price?: number;
  stock?: number;
  available?: number;
}
