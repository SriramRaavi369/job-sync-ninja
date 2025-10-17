import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ParsedResumeData } from "@/pages/ResumeBuilder";
import mammoth from "mammoth";

interface ResumeUploadProps {
  onResumeUploaded: (data: ParsedResumeData, resumeId?: string) => void;
}

const ResumeUpload = ({ onResumeUploaded }: ResumeUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const parseResumeText = (text: string): ParsedResumeData => {
    // Basic parsing logic - this is a simplified version
    // In production, you'd want to use more sophisticated NLP or AI parsing
    const lines = text.split('\n').filter(line => line.trim());
    
    // Extract email
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
    const emailMatch = text.match(emailRegex);
    const email = emailMatch ? emailMatch[0] : "";

    // Extract phone
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const phoneMatch = text.match(phoneRegex);
    const phone = phoneMatch ? phoneMatch[0] : "";

    // Extract LinkedIn
    const linkedinRegex = /(linkedin\.com\/in\/[\w-]+)/;
    const linkedinMatch = text.match(linkedinRegex);
    const linkedin = linkedinMatch ? linkedinMatch[0] : "";

    // Extract name (assume first non-empty line is the name)
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

  const saveResumeToDatabase = async (parsedData: ParsedResumeData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          title: `${parsedData.fullName || "My Resume"} - ${new Date().toLocaleDateString()}`,
          content: parsedData,
          is_ats_optimized: false
        } as any)
        .select()
        .single();

      if (error) throw error;

      return data.id;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save resume to database.",
        variant: "destructive",
      });
      return null;
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      let text = "";

      if (file.type === "application/pdf") {
        // For PDF files, we'll use a simple text extraction
        // In production, you'd want to use pdf.js or similar
        const reader = new FileReader();
        reader.onload = async (e) => {
          const buffer = e.target?.result as ArrayBuffer;
          // Simple text extraction - in production use pdf.js
          text = "PDF parsing would go here";
          const parsedData = parseResumeText(text);
          const resumeId = await saveResumeToDatabase(parsedData);
          onResumeUploaded(parsedData, resumeId || undefined);
          setIsProcessing(false);
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // Handle DOCX files
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          text = result.value;
          const parsedData = parseResumeText(text);
          const resumeId = await saveResumeToDatabase(parsedData);
          onResumeUploaded(parsedData, resumeId || undefined);
          setIsProcessing(false);
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type === "text/plain") {
        // Handle text files
        const reader = new FileReader();
        reader.onload = async (e) => {
          text = e.target?.result as string;
          const parsedData = parseResumeText(text);
          const resumeId = await saveResumeToDatabase(parsedData);
          onResumeUploaded(parsedData, resumeId || undefined);
          setIsProcessing(false);
        };
        reader.readAsText(file);
      } else {
        throw new Error("Unsupported file type");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process resume file. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  const handleSkip = () => {
    // Create empty resume data structure
    const emptyData: ParsedResumeData = {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      summary: "",
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: []
    };
    onResumeUploaded(emptyData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Your Resume</h1>
        <p className="text-muted-foreground">
          Upload your existing resume to get started, or create one from scratch
        </p>
      </div>

      <Card className="p-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />
          
          {isProcessing ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg font-medium">Processing your resume...</p>
              <p className="text-sm text-muted-foreground">
                Analyzing content and extracting information
              </p>
            </div>
          ) : (
            <>
              {isDragActive ? (
                <Upload className="h-12 w-12 mx-auto mb-4 text-primary" />
              ) : (
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              )}
              
              <h3 className="text-xl font-semibold mb-2">
                {isDragActive ? "Drop your resume here" : "Upload Your Existing Resume"}
              </h3>
              <p className="text-muted-foreground mb-6">
                Drag and drop your resume file here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Supported formats: PDF, DOCX, TXT
              </p>
              <Button type="button" variant="outline">
                Browse Files
              </Button>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Don't have a resume? No problem!
          </p>
          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={isProcessing}
          >
            Start from Scratch
          </Button>
        </div>
      </Card>

      <Card className="mt-6 p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          What happens next?
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• We'll analyze your resume to understand your industry and experience</li>
          <li>• You'll get AI-powered template recommendations tailored to your profile</li>
          <li>• Choose from ATS-optimized templates designed to pass screening systems</li>
          <li>• Edit your resume with real-time ATS guidance and tips</li>
          <li>• Export as a professional PDF ready for job applications</li>
        </ul>
      </Card>
    </div>
  );
};

export default ResumeUpload;
