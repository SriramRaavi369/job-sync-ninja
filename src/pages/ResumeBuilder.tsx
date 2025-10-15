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

// Default sample data for Blue Monogram template
const defaultResumeData: ParsedResumeData = {
  fullName: "Michael Rodriguez",
  email: "michael.rodriguez@email.com",
  phone: "(555) 123-4567",
  location: "New York, NY",
  linkedin: "linkedin.com/in/michaelrodriguez",
  summary: "Visionary executive with 15+ years driving digital transformation and revenue growth across Fortune 500 companies. Expert in leading high-performing teams and implementing innovative technology solutions.",
  experience: [
    {
      title: "Chief Technology Officer",
      company: "Global Tech Corp",
      location: "New York, NY",
      startDate: "Jan 2020",
      endDate: "Present",
      description: [
        "Led digital transformation initiatives resulting in $50M revenue increase",
        "Managed team of 200+ engineers across 5 countries",
        "Implemented AI-driven solutions improving operational efficiency by 40%",
      ],
    },
    {
      title: "Vice President of Engineering",
      company: "Innovation Labs Inc.",
      location: "San Francisco, CA",
      startDate: "Mar 2015",
      endDate: "Dec 2019",
      description: [
        "Built and scaled engineering organization from 20 to 150+ team members",
        "Launched 5 major product releases generating $30M in annual revenue",
        "Established engineering best practices and development standards",
      ],
    },
  ],
  education: [
    {
      degree: "MBA in Technology Management",
      institution: "Stanford University",
      location: "Stanford, CA",
      graduationDate: "May 2010",
      gpa: "3.8",
    },
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "MIT",
      location: "Cambridge, MA",
      graduationDate: "May 2005",
      gpa: "3.9",
    },
  ],
  skills: ["Strategic Planning", "Team Leadership", "Digital Transformation", "Revenue Growth", "AI Implementation", "Cloud Architecture", "Agile Methodologies"],
  projects: [
    {
      name: "Enterprise AI Platform",
      description: "Led development of company-wide AI platform serving 50,000+ employees with advanced machine learning capabilities",
      technologies: ["Machine Learning", "Cloud Architecture", "Python", "TensorFlow"],
      link: "https://github.com/mrodriguez/ai-platform"
    }
  ],
  certifications: [
    {
      name: "Certified Executive Leadership Program",
      issuer: "Harvard Business School",
      date: "2023"
    }
  ],
};

const ResumeBuilder = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [currentStep, setCurrentStep] = useState<"upload" | "template" | "editor">("upload");
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("blue-monogram");
  const [editedData, setEditedData] = useState<ParsedResumeData | null>(defaultResumeData);
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

  const handleSkipUpload = () => {
    setParsedData(defaultResumeData);
    setEditedData(defaultResumeData);
    setCurrentStep("editor");
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
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Create Your Resume</h1>
              <p className="text-muted-foreground">Upload your existing resume to get started</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <ResumeUpload onResumeUploaded={handleResumeUploaded} />
            </div>
          </div>
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
