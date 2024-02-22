import { Container } from "@mui/material";
import { useSession } from "@supabase/auth-helpers-react";
import axios from "axios";
import { format } from "date-fns";
import moment from "moment";
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const url = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

const CalendarComponent = () => {
  const session = useSession();
  const [eventsList, setEventsList] = useState<any>([]);

  useEffect(() => {
    const getEvents = async () => {
      const res = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + session?.provider_token, // Access token for Google
        },
        params: { maxResults: 25000, showDeleted: true },
      });

      const formatDate: any = (string: any, timezone: string) => {
        if (!string) return ""; // Handle empty or falsy string
        const ds = new Date(string);
        const date = new Date(
          ds.getUTCFullYear(),
          ds.getUTCMonth(),
          ds.getUTCDate(),
          ds.getUTCHours(),
          ds.getUTCMinutes(),
          ds.getUTCSeconds()
        );

        if (isNaN(new Date(string).getTime())) return ""; // Check if the date is valid

        const formattedDate = format(date, "yyyy, M, d, H, m, s");
        return formattedDate;
      };

      const convertToDate = (dateArray: number[]) => {
        return new Date(
          Date.UTC(
            dateArray[0],
            dateArray[1] - 1,
            dateArray[2],
            dateArray[3],
            dateArray[4],
            dateArray[5]
          )
        );
      };

      const events = res.data.items.map((item: any, index: number) => {
        const startDate = formatDate(
          item.start?.dateTime,
          item.start?.timeZone
        );
        const endDate = formatDate(item.end?.dateTime, item.end?.timeZone);

        const startArray = startDate
          .split(",")
          .map((component: any) => parseInt(component.trim(), 10));
        const endArray = endDate
          .split(",")
          .map((component: any) => parseInt(component.trim(), 10));

        console.log("endDate", res.data);

        return {
          id: index + 1,
          title: item.summary,
          start: convertToDate(startArray),
          end: convertToDate(endArray),
          allDay: false,
        };
      });

      console.log("events", res.data.items);

      setEventsList(events);
    };

    getEvents();
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <Calendar
        localizer={localizer}
        events={eventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </Container>
  );
};

export default CalendarComponent;
