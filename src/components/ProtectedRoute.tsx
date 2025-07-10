
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import authService from "@/services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // First check if the token exists
        const authenticated = authService.isAuthenticated();
        
        if (!authenticated) {
          setIsAuthenticated(false);
          setIsLoading(false);
          toast({
            title: "Authentication Required",
            description: "Please log in to access this page",
            variant: "destructive",
          });
          return;
        }
        
        // If the token exists, try to fetch the user profile to validate token
        await authService.getProfile();
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        // If profile fetch fails, token is likely invalid
        console.error("Authentication error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        setIsAuthenticated(false);
        setIsLoading(false);
        toast({
          title: "Session Expired",
          description: "Please log in again to continue",
          variant: "destructive",
        });
      }
    };
    
    verifyAuth();
  }, [toast]);
  
  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    // Redirect to login and save the intended destination
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
