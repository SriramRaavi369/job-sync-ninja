import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

const Index = lazy(() => import("./pages/Index"));
const AuthPage = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Resumes = lazy(() => import("./pages/Resumes"));
const MyResumes = lazy(() => import("./pages/MyResumes"));
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder"));
const ResumeGuide = lazy(() => import("./pages/ResumeGuide"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AuthRedirect = () => {
  const { user, loading } = useAuth();

  // Immediately navigate to dashboard if user is logged in and not loading
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Always render AuthPage for the /auth route, it can handle its own loading/redirection
  return <AuthPage />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"></div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthRedirect />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/resumes" element={<Resumes />} />
                <Route path="/my-resumes" element={<MyResumes />} />
                <Route path="/myresumes" element={<MyResumes />} />
                <Route path="/resumes/new" element={<ResumeBuilder />} />
                <Route path="/resume-builder" element={<ResumeBuilder />} />
                <Route path="/resume-guide" element={<ResumeGuide />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
