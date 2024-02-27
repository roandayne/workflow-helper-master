import { Container } from "@mui/material";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getEvents } from "../utils/events";

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const supabase = useSupabaseClient();
  const [eventsList, setEventsList] = useState<any>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await getEvents(supabase);

      setEventsList(events);
    };

    fetchEvents();
    // eslint-disable-next-line
  }, [eventsList]);

  return (
    <Container>
      <Calendar
        localizer={localizer}
        defaultView="day"
        events={eventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </Container>
  );
};

export default CalendarComponent;
