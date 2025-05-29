// Tipos de status de pagamento

export enum PaymentStatus {
  PAID = 'paid',
  PARTIAL = 'partial',
  PENDING = 'pending',
}

// Métodos de pagamento aceitos
export enum PaymentMethod {
  PIX = 'pix',
  CREDIT_CARD = 'cartão',
  CASH = 'dinheiro',
  BANK_TRANSFER = 'transferência',
}

// Tipos de evento apenas aplicáveis a eventos do salão
export enum EventType {
  BIRTHDAY = 'Aniversário',
  WEDDING = 'Casamento',
  CORPORATE = 'Evento Corporativo',
  RELIGIOUS = 'Celebração Religiosa',
  OTHER = 'Outro',
}

// Origem da reserva
export type RentalPlatform = 'Airbnb' | 'Booking' | 'Salão de Festas' | 'Manual';

// Propriedade relacionada ao evento/reserva
export interface CalendarProperty {
  id: string;
  name: string;
  type: 'apartment' | 'house' | 'eventHall'; // adaptável a outros tipos
  color?: string; // pode ser usada no calendário
}

export interface RentalEventWithTotalCount {
  data: IRentalEvent[];
  totalCount: number;
}

// Modelo principal de reserva/aluguel para uso no calendário
export interface IRentalEvent {
  id: number;
  title: string; // Exibido no calendário
  property: CalendarProperty; // Relação direta com o imóvel/salão

  platform: RentalPlatform;

  guestName: string;
  guestPhone?: string;
  guestEmail?: string;

  start: string; // "2025-06-10T14:00:00"
  end: string;   // "2025-06-12T11:00:00"

  eventType?: EventType; // Usado apenas se for do tipo Salão de Festas
  totalGuests?: number;
  totalNights?: number;

  amountPaid: number;
  amountDue: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;

  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: IRentalEvent;
}