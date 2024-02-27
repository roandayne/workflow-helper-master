import { Container } from "@mui/material";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { STATUSES } from "../utils/constants";
import EventColumn from "./EventColumn";

export interface Event {
  id: number;
  title: string;
  start: string;
  end: string;
  status: string;
  description: string;
  type: string;
}

const KanbanBoard = () => {
  const [events, setEvents] = useState<Event[] | []>([]);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const getEvents = async () => {
      const { data, error } = await supabase.from("tasks").select();

      if (data && data?.length > 0) {
        setEvents(data);
      }

      if (error) {
        console.log("Error while getting events: ", error);
      }
    };

    getEvents();
    // eslint-disable-next-line
  }, [events]);

  return (
    <Container
      sx={{
        width: "100%",
        display: "flex",
        overflowX: "scroll",
        gap: "20px",
      }}
    >
      {STATUSES.filter((item) => item.show).map(
        (item: { status: string; bg: string }, index: number) => {
          const { status, bg } = item;
          const eventItems = events.filter((event) => {
            return (
              event.status === status &&
              event.type !== "outOfOffice" &&
              event.type !== null
            );
          });
          const count = eventItems.length;

          return (
            <>
              {eventItems.length > 0 && (
                <EventColumn
                  key={index}
                  status={status}
                  bg={bg}
                  events={eventItems}
                  count={count}
                />
              )}
            </>
          );
        }
      )}
    </Container>
  );
};

export default KanbanBoard;
