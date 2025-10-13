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
    setCurrentStep("template");
  };

  const handleTemplateSelected = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCurrentStep("editor");
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
        
        {currentStep === "editor" && parsedData && selectedTemplate && (
          <ResumeEditor
            parsedData={parsedData}
            templateId={selectedTemplate}
            userId={user?.id || ""}
          />
        )}
      </main>
    </div>
  );
};

export default ResumeBuilder;
