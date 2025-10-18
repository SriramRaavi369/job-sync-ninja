
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useDataFetching } from "@/hooks/useDataFetching";
import { Briefcase, LogOut, FileText, User as UserIcon, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component

interface Job {
  id: string;
  title: string;
  company: string;
  location: string | null;
  description: string | null;
  salary_range: string | null;
  job_type: string | null;
  posted_at: string;
}

const Dashboard = () => {
  const { data: jobs, loading: jobsLoading, authLoading } = useDataFetching<Job>('jobs', 'posted_at', { filterByUser: false, limit: 20 });
  const navigate = useNavigate();
  const { toast } = useToast();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">JobSync Ninja</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/resumes")}>
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </Button>
            <Button variant="ghost" onClick={() => navigate("/myresumes")}>
              <FileText className="h-4 w-4 mr-2" />
              My Resumes
            </Button>
            <Button variant="ghost" onClick={() => navigate("/profile")}>
              <UserIcon className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Latest Jobs</h2>
          <p className="text-muted-foreground">
            Browse the latest job opportunities
          </p>
        </div>

        {jobsLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                    <Card key={index} className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-1" />
                        <Skeleton className="h-4 w-2/3 mb-3" />
                        <Skeleton className="h-4 w-1/4 mb-4" />
                        <Skeleton className="h-4 w-1/3" />
                    </Card>
                ))}
            </div>
        ) : jobs.length === 0 ? (
          <Card className="p-8 text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No jobs available yet</h3>
            <p className="text-muted-foreground">
              Jobs will appear here once they're synced from LinkedIn
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                <p className="text-sm text-muted-foreground mb-1">{job.company}</p>
                {job.location && (
                  <p className="text-sm text-muted-foreground mb-3">{job.location}</p>
                )}
                {job.job_type && (
                  <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {job.job_type}
                  </span>
                )}
                {job.salary_range && (
                  <p className="text-sm font-medium mt-2">{job.salary_range}</p>
                )}
                <p className="text-xs text-muted-foreground mt-4">
                  Posted {new Date(job.posted_at).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
