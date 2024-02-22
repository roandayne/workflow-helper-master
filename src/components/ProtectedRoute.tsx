import { useSessionContext } from "@supabase/auth-helpers-react";
import React from "react";
import { LoginPage } from "../containers/LoginPage";

const ProtectedRoute: React.FC<any> = ({ children }) => {
  const { isLoading, session, error } = useSessionContext();

  if (isLoading) {
    return <></>;
  }

  if (error) {
    console.log(`Error: ${error}`);
  }

  if (!session) {
    return <LoginPage />;
  }

  return children;
};

export default ProtectedRoute;
