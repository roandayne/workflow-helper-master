import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";

interface Project {
  id: number;
  title: string;
  description: Text;
}

interface Priority {
  title: string;
}

const priorities = [
  { title: "P0" },
  { title: "P1" },
  { title: "P2" },
  { title: "P3" },
];

const Task = () => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [eventName, setEventName] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [eventType, setEventType] = useState<string>("default");
  const [eventDescription, setEventDescription] = useState<string>("");
  const [project, setProject] = useState<string>("");
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [priority, setPriority] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [user, setUser] = useState<number | null>(null);
  const [isGcalEvent, setIsGcalEvent] = useState<boolean>(true);
  const [status, setStatus] = useState<string>("todo");

  useEffect(() => {
    const getProjects = async () => {
      const { data, error } = await supabase.from("projects").select();

      setProjects(data as []);

      if (error) {
        throw error;
      }
    };

    const getUserId = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (data?.user?.id) {
        setUserId(data?.user?.id);
      }

      if (error) {
        throw error;
      }
    };

    getProjects();
    getUserId();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("user_id", userId);

      if (data) {
        setUser(data[0].id);
      } else {
        console.log(error);
      }
    };

    if (userId) {
      getUser();
    }
    // eslint-disable-next-line
  }, [userId]);

  const createCalendarEvent = async () => {
    console.log("Creating calendar event");
    const event = {
      summary: eventName,
      description: eventDescription,
      eventType: eventType,
      start: {
        dateTime: startDate.toISOString(), // Date.toISOString() ->
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // America/Los_Angeles
      },
      end: {
        dateTime: endDate.toISOString(), // Date.toISOString() ->
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // America/Los_Angeles
      },
    };

    try {
      const response = await axios.post(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        event,
        {
          headers: {
            Authorization: "Bearer " + session?.provider_token, // Access token for google
          },
        }
      );

      console.log(response.data);
      setSuccessMessage("Event created, check your Google Calendar!");
    } catch (error) {
      console.log("Error: ", error);
      setErrorMessage("Error creating calendar event");
    }
  };

  const handleEventType = (e: ChangeEvent<HTMLInputElement>) => {
    setEventType(e.target.value);
  };

  const handleStatus = (e: ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  };

  const handleCreateTaskClick = async () => {
    if (isGcalEvent) {
      createCalendarEvent();
    }
    const { error } = await supabase.from("tasks").insert({
      title: eventName,
      description: eventDescription,
      status: status,
      project_id: project ? Number(project) : null,
      start: startDate.format(),
      end: endDate.format(),
      link: link,
      priority: priority,
      user_id: user,
      type: eventType,
    });

    if (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <Container sx={{ margin: "0 0 4rem 0" }}>
      <Card sx={{ padding: "2rem" }}>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <Typography variant="h3" marginBottom={"20px"}>
            Create a Task
          </Typography>
          <TextField
            required
            id="outlined-required"
            label="Task title"
            placeholder="Add title"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
          <RadioGroup
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "34px",
              padding: 0,
            }}
            aria-labelledby="demo-radio-buttons-group-label"
            value={eventType}
            onChange={handleEventType}
            name="radio-buttons-group-event-type"
          >
            <FormControlLabel
              value="default"
              control={<Radio />}
              label="Event"
            />
            <FormControlLabel
              value="outOfOffice"
              control={<Radio />}
              label="Out of Office"
            />
          </RadioGroup>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: "flex", gap: "34px", padding: 0 }}>
              <DateTimePicker
                sx={{ width: "100%" }}
                value={startDate}
                onChange={(date) => setStartDate(date)}
                label="From"
                name="startDateTime"
              />
              <DateTimePicker
                sx={{ width: "100%" }}
                value={endDate}
                onChange={(date) => setEndDate(date)}
                label="To"
                name="endDateTime"
              />
            </Box>
          </LocalizationProvider>

          {eventType !== "outOfOffice" && (
            <>
              <TextField
                id="outlined-select-currency"
                select
                label="Select project"
                placeholder="Select your project"
                value={project?.toString()}
                onChange={(e) => setProject(e.target.value)}
              >
                {projects.map((item: Project, index: number) => (
                  <MenuItem key={index} value={item.id.toString()}>
                    {item.title}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="outlined-multiline-flexible"
                label="Description"
                multiline
                rows={4}
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
              <TextField
                id="outlined-select-currency"
                select
                label="Select priority"
                placeholder="Select priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                {priorities.map((item: Priority, index: number) => (
                  <MenuItem key={index} value={item.title}>
                    {item.title}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="outlined-required"
                label="Link"
                placeholder="Add link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <RadioGroup
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  padding: 0,
                }}
                aria-labelledby="demo-radio-buttons-group-label"
                value={status}
                onChange={handleStatus}
                name="radio-buttons-group-status"
              >
                <FormControlLabel
                  value="todo"
                  control={<Radio />}
                  label="ToDo"
                />
                <FormControlLabel
                  value="doing"
                  control={<Radio />}
                  label="Doing"
                />
                <FormControlLabel
                  value="done"
                  control={<Radio />}
                  label="Done"
                />
                <FormControlLabel
                  value="blocked"
                  control={<Radio />}
                  label="Blocked"
                />
                <FormControlLabel
                  value="backlog"
                  control={<Radio />}
                  label="Backlog"
                />
                <FormControlLabel
                  value="close"
                  control={<Radio />}
                  label="Close"
                />
              </RadioGroup>
            </>
          )}
        </CardContent>
        <CardActions sx={{ display: "flex", flexDirection: "column" }}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Create Google Calender event"
              name="gcal"
              checked={isGcalEvent}
              onChange={() => setIsGcalEvent(!isGcalEvent)}
            />
          </FormGroup>
          <Button variant="outlined" onClick={handleCreateTaskClick}>
            Create Task
          </Button>
        </CardActions>
        {successMessage && <Typography>{successMessage}</Typography>}
        {errorMessage && <Typography>{errorMessage}</Typography>}
      </Card>
    </Container>
  );
};

export default Task;
