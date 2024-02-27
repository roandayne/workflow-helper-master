import axios from "axios";
import { SupabaseClient } from "@supabase/supabase-js";
import { format } from "date-fns";

export const getSession = async (supabase: SupabaseClient) => {
  const { data, error } = await supabase.auth.getSession();

  if (data.session) {
    return data.session;
  } else {
    console.log("Error when getting a session: ", error);
  }
};

export const getEvents = async (supabase: SupabaseClient) => {
  const session = await getSession(supabase);

  const res = await axios.get(process.env.REACT_APP_CALENDAR_URI as string, {
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
    const startDate = formatDate(item.start?.dateTime, item.start?.timeZone);
    const endDate = formatDate(item.end?.dateTime, item.end?.timeZone);

    const startArray = startDate
      .split(",")
      .map((component: any) => parseInt(component.trim(), 10));
    const endArray = endDate
      .split(",")
      .map((component: any) => parseInt(component.trim(), 10));

    return {
      id: index + 1,
      title: item.summary,
      start: convertToDate(startArray),
      end: convertToDate(endArray),
      allDay: false,
    };
  });

  return events;
};
