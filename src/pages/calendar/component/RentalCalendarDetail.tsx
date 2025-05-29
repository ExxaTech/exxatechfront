import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { IProperty } from "../../../shared/types/PropertyTypes";
import { CalendarEvent } from "../../../shared/types/RentalEvent";
import { RentalEventService } from "../../../shared/services/api/rental-event/RentalEventService";

interface IRentalCalendarDetailProps {
  property: IProperty | null;
}

const localizer = momentLocalizer(moment);

export const RentalCalendarDetail: React.FC<IRentalCalendarDetailProps> = ({ property }) => {
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!property) {
      setEvents([]);
      return;
    }

    setLoading(true);
    RentalEventService.getByPropertyId(property.id)
      .then(data => {
        if (data instanceof Error) {
          setEvents([]);
          console.error(data.message);
        } else {
          // Mapear IRentalEvent para o formato do react-big-calendar
          const mappedEvents = data.data.map(evt => ({
            id: evt.id,
            title: evt.title,
            start: new Date(evt.start),
            end: new Date(evt.end),
            allDay: false,
            resource: evt
          }));
          setEvents(mappedEvents);
        }
      })
      .finally(() => setLoading(false));
  }, [property]);

  if (!property) {
    return <div style={{ padding: 20 }}>Selecione uma propriedade para ver o calendário.</div>;
  }

  return (
    <div style={{ flexGrow: 1, padding: 16 }}>
      <h2>Calendário - {property.title}</h2>
      {loading && <p>Carregando eventos...</p>}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        defaultView={Views.MONTH}
        popup
        selectable
      />
    </div>
  );
};
