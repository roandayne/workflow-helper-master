import GoogleIcon from "@mui/icons-material/Google";
import { Box, Button, Container } from "@mui/material";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export const LoginPage = () => {
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
