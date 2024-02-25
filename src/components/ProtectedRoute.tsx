import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import React from "react";
import { LoginPage } from "../containers/LoginPage";
import { logout } from "../utils/auth";

const ProtectedRoute: React.FC<any> = ({ children }) => {
  const { isLoading, session, error } = useSessionContext();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    await logout(supabase);
  };

  if (isLoading) {
    return <></>;
  }

  if (error) {
    console.log(`Error: ${error}`);
  }

  if (!session) {
    return <LoginPage />;
  }

  if (!session?.provider_token) {
    handleLogout();
  }

  return children;
};

export default ProtectedRoute;
