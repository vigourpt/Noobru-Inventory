import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isApproved } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !isApproved) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
