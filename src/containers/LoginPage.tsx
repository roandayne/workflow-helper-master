import GoogleIcon from "@mui/icons-material/Google";
import { Box, Button, Container } from "@mui/material";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";

export const LoginPage = () => {
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const supabase = useSupabaseClient();

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
        redirectTo: "/",
      },
    });
  };

  // useEffect(() => {
  //   const getUser = async() => {
  //     const { data: { user } } = await supabase.auth.getUser()
  //     setLoggedInUser(user)
  //   }

  //   if (loggedInUser) {
  //     getUser()
  //   }

  // // eslint-disable-next-line no-use-before-define
  // }, [loggedInUser])

  return (
    <Box>
      <Container></Container>
      <Container>
        <Button startIcon={<GoogleIcon />} variant="outlined" onClick={login}>
          Sign in with Google
        </Button>
      </Container>
    </Box>
  );
};
