import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Plus, FileText, ArrowLeft } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Resume {
  id: string;
  title: string;
  is_ats_optimized: boolean;
  created_at: string;
  updated_at: string;
}

const Resumes = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
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
      fetchResumes();
    };

    checkUser();
  }, [navigate]);

  const fetchResumes = async () => {
    try {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      setResumes(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch resumes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">My Resumes</h1>
            </div>
          </div>
          <Button onClick={() => navigate("/resumes/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Resume
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">📚 New to Resume Writing?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Learn how to create ATS-optimized resumes that get you interviews at top companies. 
                Our comprehensive guide covers everything from beating applicant tracking systems to crafting compelling content.
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/resume-guide")}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Read the Resume Guide
              </Button>
            </div>
          </div>
        </Card>

        {resumes.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first ATS-optimized resume to start applying for jobs
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
                  Last updated {new Date(resume.updated_at).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View
                  </Button>
                  <Button size="sm" className="flex-1">
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Resumes;
