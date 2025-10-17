import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, LogOut, FileText, User, Plus, Edit, Trash2 } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

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

interface Resume {
  id: string;
  title: string;
  is_ats_optimized: boolean;
  created_at: string;
  updated_at: string;
  content: any;
}

const Dashboard = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      fetchJobs();
      fetchResumes();
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate("/auth");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("posted_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      setJobs(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch jobs.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchResumes = async () => {
    try {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      setResumes(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch resumes.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteResume = async (id: string) => {
    try {
      const { error } = await supabase
        .from("resumes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resume deleted successfully.",
      });
      
      fetchResumes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete resume.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
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
              Resumes
            </Button>
            <Button variant="ghost" onClick={() => navigate("/profile")}>
              <User className="h-4 w-4 mr-2" />
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
        {/* My Resumes Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">My Resumes</h2>
              <p className="text-muted-foreground">
                Manage and edit your uploaded resumes
              </p>
            </div>
            <Button onClick={() => navigate("/resumes/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Resume
            </Button>
          </div>

          {resumes.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload your resume or create one from scratch to get started
              </p>
              <Button onClick={() => navigate("/resumes/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Resume
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resumes.map((resume) => (
                <Card key={resume.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                    {resume.is_ats_optimized && (
                      <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">
                        ATS Optimized
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{resume.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Updated {new Date(resume.updated_at).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/resumes/${resume.id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteResume(resume.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Latest Jobs</h2>
          <p className="text-muted-foreground">
            Browse the latest job opportunities
          </p>
        </div>

        {jobs.length === 0 ? (
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
