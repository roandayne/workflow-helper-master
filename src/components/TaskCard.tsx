import { Button, Box, CardActions, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { format } from "date-fns";
import React, { useState } from "react";
import { STATUSES } from "../utils/constants";
import { Event } from "./KanbanBoard";

interface TaskCardProps {
  event: Event;
}

export interface Status {
  status: string;
  bg: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ event }) => {
  const supabase = useSupabaseClient();
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const { title, start, end, status, description } = event;
  const filteredStatus = STATUSES.filter((item: Status) => {
    return item.status !== status;
  });

  const handleChangeStatus = async (status: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: status })
      .eq("id", event.id);

    if (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <Card sx={{ width: "200px" }}>
      <CardContent sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h5">{title}</Typography>
        <Typography>{description}</Typography>
        <Typography>
          {format(start, "H:mm")} - {format(end, "H:mm")}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          width: "100%",
        }}
      >
        <Button onClick={() => setShowButtons(!showButtons)}>
          {!showButtons ? "Update Status" : "Close"}
        </Button>
        {showButtons && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              flexDirection: "column",
              padding: "10px",
              marginLeft: 0,
            }}
          >
            {filteredStatus.map((item: Status, index: number) => {
              return (
                <Button
                  key={index}
                  size="small"
                  variant="outlined"
                  sx={{
                    color: item.bg,
                    border: `1px solid ${item.bg}`,
                  }}
                  onClick={() => handleChangeStatus(item.status)}
                >
                  {item.status}
                </Button>
              );
            })}
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default TaskCard;
