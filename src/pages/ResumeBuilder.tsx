import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import ResumeUpload from "@/components/resume-builder/ResumeUpload";
import TemplateSelection from "@/components/resume-builder/TemplateSelection";
import ResumeEditor from "@/components/resume-builder/ResumeEditor";
import ResumePreview from "@/components/resume-builder/ResumePreview"; // Import ResumePreview

export interface ParsedResumeData {
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

const ResumeBuilder = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [currentStep, setCurrentStep] = useState<"upload" | "template" | "editor">("upload");
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [editedData, setEditedData] = useState<ParsedResumeData | null>(null);
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
    };

    checkUser();
  }, [navigate]);

  const handleResumeUploaded = (data: ParsedResumeData) => {
    setParsedData(data);
    setEditedData(data);
    setCurrentStep("template");
  };

  const handleTemplateSelected = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCurrentStep("editor");
  };

  const handleEditorChange = (data: ParsedResumeData) => {
    setEditedData(data);
  };

  const handleBack = () => {
    if (currentStep === "template") {
      setCurrentStep("upload");
    } else if (currentStep === "editor") {
      setCurrentStep("template");
    } else {
      navigate("/resumes");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentStep === "upload" && (
          <ResumeUpload onResumeUploaded={handleResumeUploaded} />
        )}
        
        {currentStep === "template" && parsedData && (
          <TemplateSelection
            parsedData={parsedData}
            onTemplateSelected={handleTemplateSelected}
          />
        )}
        
        {currentStep === "editor" && parsedData && selectedTemplate && editedData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-1 overflow-auto">
              <ResumeEditor
                parsedData={editedData}
                templateId={selectedTemplate}
                userId={user?.id || ""}
                onDataChange={handleEditorChange}
              />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-8 border rounded-lg p-6 bg-white shadow-lg overflow-auto max-h-[calc(100vh-4rem)]">
                <div className="mb-4 flex items-center justify-between border-b pb-3">
                  <h2 className="text-lg font-semibold">Resume Preview</h2>
                  <span className="text-xs text-muted-foreground">Live Preview</span>
                </div>
                <div className="resume-preview-wrapper" style={{ transform: "scale(0.85)", transformOrigin: "top center" }}>
                  <ResumePreview resumeData={editedData} templateId={selectedTemplate} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ResumeBuilder;
