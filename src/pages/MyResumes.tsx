import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, ArrowLeft, Upload, Loader2 } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Json, Tables, TablesInsert } from "@/integrations/supabase/types";
import mammoth from "mammoth";

type Resume = Tables<"resumes">;

interface ParsedResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
}

const parseResumeText = (text: string): ParsedResumeData => {
  const lines = text.split('\n').filter(line => line.trim());
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : "";
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = text.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : "";
  const linkedinRegex = /(linkedin\.com\/in\/[\w-]+)/;
  const linkedinMatch = text.match(linkedinRegex);
  const linkedin = linkedinMatch ? linkedinMatch[0] : "";
  const fullName = lines[0] || "Your Name";

  return {
    fullName,
    email,
    phone,
    location: "",
    linkedin,
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  };
};

const MyResumes = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
    };

    checkUser();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchResumes();
    }
  }, [user]);

  const fetchResumes = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
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

  const processFile = async (file: File, onSuccess: (data: ParsedResumeData) => void) => {
    setIsProcessing(true);
    try {
      let text = "";
      let parsedData: ParsedResumeData;

      if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
        parsedData = parseResumeText(text);
        onSuccess(parsedData);
      } else if (file.type === "text/plain") {
        text = await file.text();
        parsedData = parseResumeText(text);
        onSuccess(parsedData);
      } else if (file.type === "application/pdf") {
        toast({
          title: "PDF Uploaded",
          description: "PDF file saved. Content parsing for PDFs is not currently supported.",
        });
        parsedData = {
          fullName: file.name,
          email: "",
          phone: "",
          location: "",
          linkedin: "",
          summary: "This is a PDF document. Content has not been parsed.",
          experience: [],
          education: [],
          skills: [],
          projects: [],
          certifications: []
        };
        onSuccess(parsedData);
      } else {
        throw new Error("Unsupported file type. Please upload a .docx, .txt, or .pdf file.");
      }
    } catch (error: any) {
      toast({
        title: "Error Processing File",
        description: error.message || "Failed to process resume file.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      await processFile(file, async (data) => {
        try {
          const title = data.fullName || file.name;

          const resumeInsert: TablesInsert<"resumes"> = {
            title,
            content: data as unknown as Json,
            is_ats_optimized: false,
            type: 'uploaded',
            user_id: user.id,
          };

          const { data: newResume, error } = await supabase
            .from("resumes")
            .insert(resumeInsert)
            .select()
            .single();

          if (error) {
            throw error;
          }
          
          if (newResume) {
            setResumes(prevResumes => [newResume, ...prevResumes]);
          }

          toast({
            title: "Success",
            description: "Resume uploaded and saved successfully!",
          });

        } catch (error: any) {
          console.error("Error saving resume:", error);
          toast({
            title: "Error Saving Resume",
            description: error.message || "Failed to save the resume to the database.",
            variant: "destructive",
          });
        }
      });
    }
  };


  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const uploadedResumes = resumes.filter((r) => r.type === "uploaded");
  const savedResumes = resumes.filter((r) => r.type === "created" || !r.type);

  if (loading && !isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.docx,.txt"
        style={{ display: "none" }}
      />
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
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
        <Tabs defaultValue="uploaded" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="uploaded">Resumes uploaded by you ({uploadedResumes.length})</TabsTrigger>
            <TabsTrigger value="saved">Saved resumes ({savedResumes.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="uploaded" className="mt-6">
            {uploadedResumes.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {uploadedResumes.map((resume) => (
                  <Card key={resume.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/resume-builder/${resume.id}`)}>
                    <div className="flex items-start justify-between mb-4">
                      <FileText className="h-8 w-8 text-primary" />
                      <div className="flex gap-2">
                        <Badge variant="secondary">Uploaded</Badge>
                        {resume.is_ats_optimized && (
                          <Badge variant="default">ATS Optimized</Badge>
                        )}
                      </div>
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
            ) : (
              <Card className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No resumes uploaded yet</h3>
                <p className="text-muted-foreground mb-6">
                  Upload your existing resume to optimize it with our AI tools and ATS-friendly templates.
                </p>
                <Button onClick={handleUploadClick} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Your Resume
                    </>
                  )}
                </Button>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="saved" className="mt-6">
            {savedResumes.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {savedResumes.map((resume) => (
                  <Card key={resume.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/resume-builder/${resume.id}`)}>
                    <div className="flex items-start justify-between mb-4">
                      <FileText className="h-8 w-8 text-primary" />
                      <div className="flex gap-2">
                        <Badge variant="secondary">{resume.type === "created" ? "Created" : "Saved"}</Badge>
                        {resume.is_ats_optimized && (
                          <Badge variant="default">ATS Optimized</Badge>
                        )}
                      </div>
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
            ) : (
              <Card className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No saved resumes yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first resume using our builder to get personalized templates and ATS optimization.
                </p>
                <Button onClick={() => navigate("/resumes/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Resume
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MyResumes;
