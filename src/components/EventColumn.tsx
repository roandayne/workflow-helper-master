import { Box, Chip, Container, Typography } from "@mui/material";
import React from "react";
import { Event } from "./KanbanBoard";
import TaskCard from "./TaskCard";

interface EventColumnProps {
  status: string;
  bg: string;
  count: number;
  events: Event[];
}

const EventColumn: React.FC<EventColumnProps> = ({
  status,
  bg,
  count,
  events,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: bg,
        // width: "50%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px 8px",
      }}
    >
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>{status}</Typography>
          <Chip label={count} />
        </Box>
      </Container>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {events.map((event: Event, index: number) => {
          return <TaskCard key={index} event={event} />;
        })}
      </Container>
    </Box>
  );
};

export default EventColumn;
